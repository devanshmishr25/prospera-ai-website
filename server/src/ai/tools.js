import Property from "../models/Property.js";
import { searchCompanyKnowledge } from "../data/companyKnowledge.js";

const MAX_RESULTS = 10;

/*
|--------------------------------------------------------------------------
| Realtime / Text AI Tools
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Property images are intentionally separated into two flows:
|
| 1. MODEL DATA
|    - Property details
|    - NO raw image URLs
|
| 2. UI DATA
|    - Verified image URLs
|    - Used only by the frontend to render images
|
| This prevents image URLs from consuming model tokens and prevents the AI
| from accidentally exposing them in its response.
|
|--------------------------------------------------------------------------
*/

export const realtimeTools = [
  {
    type: "function",
    name: "search_properties",
    description:
      "Search live Prospera property listings using the user's current preferences. Use this whenever the user wants to find, show, browse, explore, or compare properties. Return property information for the AI, while verified property images are kept as UI-only data by the backend. Do not use this tool just to show photos of one already-known property; use get_property for a specific property's photos.",
    parameters: {
      type: "object",

      properties: {
        city: {
          type: ["string", "null"],
          description:
            "City name. Use null when the user did not provide a city.",
        },

        locality: {
          type: ["string", "null"],
          description:
            "Preferred locality or area. Use null when not provided.",
        },

        bedrooms: {
          type: ["integer", "null"],
          description:
            "Number of bedrooms/BHK requested by the user. Use null when not provided.",
        },

        minPrice: {
          type: ["number", "null"],
          description:
            "Minimum property price in INR. Use null when not provided.",
        },

        maxPrice: {
          type: ["number", "null"],
          description:
            "Maximum property price in INR. Use null when not provided.",
        },

        type: {
          type: ["string", "null"],
          enum: [
            "Apartment",
            "Villa",
            "House",
            "Plot",
            "Commercial",
            null,
          ],
          description:
            "Property type. Use null when not provided.",
        },

        listingType: {
          type: ["string", "null"],
          enum: [
            "Sale",
            "Rent",
            null,
          ],
          description:
            "Whether the user wants to buy/sale or rent. Use null when not provided.",
        },

        parking: {
          type: ["boolean", "null"],
          description:
            "Whether parking is required. Use null when not provided.",
        },

        page: {
          type: ["integer", "null"],
          minimum: 1,
          description:
            "Page number for pagination. Use 1 for a new search and the next page when the user asks for more properties.",
        },
      },

      required: [
        "city",
        "locality",
        "bedrooms",
        "minPrice",
        "maxPrice",
        "type",
        "listingType",
        "parking",
        "page",
      ],

      additionalProperties: false,
    },

    strict: true,
  },

  {
    type: "function",
    name: "get_property",

    description:
      "Get live details for one specific Prospera property using its verified propertyId. Use this when the user asks about a specific property or asks to see that property's photo/photos/pictures. For photo requests, the backend keeps verified image URLs available for the frontend UI but removes them from the AI-visible result. The AI also receives verified image availability metadata so it knows whether photos exist. Do not expose image URLs, image IDs, CDN paths, or storage paths in the response.",

    parameters: {
      type: "object",

      properties: {
        propertyId: {
          type: "string",
          description:
            "The verified Prospera propertyId of the specific property.",
        },
      },

      required: [
        "propertyId",
      ],

      additionalProperties: false,
    },

    strict: true,
  },

  {
    type: "function",
    name: "get_company_info",

    description:
      "Search Prospera's verified company information and FAQ knowledge. Use this for questions about Prospera, its services, policies, property visits, booking, fees, contact information, rental/sale services, operating cities, and company FAQs.",

    parameters: {
      type: "object",

      properties: {
        query: {
          type: "string",
          description:
            "The user's company or FAQ question rewritten as a concise search query.",
        },
      },

      required: [
        "query",
      ],

      additionalProperties: false,
    },

    strict: true,
  },
];


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function escapeRegex(value) {
  return String(value)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


/*
|--------------------------------------------------------------------------
| Build MongoDB Property Search Query
|--------------------------------------------------------------------------
*/

function buildSearchQuery(filters = {}) {
  const query = {
    available: true,
  };

  if (
    typeof filters.city === "string" &&
    filters.city.trim()
  ) {
    query["location.city"] = {
      $regex: escapeRegex(filters.city.trim()),
      $options: "i",
    };
  }

  if (
    typeof filters.locality === "string" &&
    filters.locality.trim()
  ) {
    query["location.locality"] = {
      $regex: escapeRegex(filters.locality.trim()),
      $options: "i",
    };
  }

  if (
    Number.isInteger(filters.bedrooms) &&
    filters.bedrooms > 0
  ) {
    query.bedrooms = filters.bedrooms;
  }

  if (
    typeof filters.minPrice === "number" &&
    Number.isFinite(filters.minPrice)
  ) {
    query.price = {
      ...(query.price || {}),
      $gte: filters.minPrice,
    };
  }

  if (
    typeof filters.maxPrice === "number" &&
    Number.isFinite(filters.maxPrice)
  ) {
    query.price = {
      ...(query.price || {}),
      $lte: filters.maxPrice,
    };
  }

  if (
    typeof filters.type === "string" &&
    filters.type.trim()
  ) {
    query.type = filters.type;
  }

  if (
    typeof filters.listingType === "string" &&
    filters.listingType.trim()
  ) {
    query.listingType = filters.listingType;
  }

  if (typeof filters.parking === "boolean") {
    query.parking = filters.parking;
  }

  return query;
}


/*
|--------------------------------------------------------------------------
| MODEL-SAFE PROPERTY
|--------------------------------------------------------------------------
|
| This is the most important part of the image/token fix.
|
| MongoDB can contain:
|
| images: [
|   "https://....",
|   "https://...."
| ]
|
| But those URLs MUST NOT be sent to the AI model.
|
| So the model receives the property without images[].
|
|--------------------------------------------------------------------------
*/

function sanitizePropertyForModel(property) {
  if (
    !property ||
    typeof property !== "object"
  ) {
    return property;
  }

  const sanitized = {
    ...property,
  };

  delete sanitized.images;

  return sanitized;
}


/*
|--------------------------------------------------------------------------
| SANITIZE COMPLETE TOOL RESULT FOR MODEL
|--------------------------------------------------------------------------
*/

export function sanitizeToolResultForModel(result) {
  if (
    !result ||
    typeof result !== "object"
  ) {
    return result;
  }

  /*
   * search_properties result
   */
  if (Array.isArray(result.properties)) {
    return {
      ...result,

      properties: result.properties.map(
        (property) =>
          sanitizePropertyForModel(property)
      ),
    };
  }

  /*
   * get_property result
   *
   * IMPORTANT:
   *
   * The raw property object may contain images[].
   * Those images must remain available internally for the UI,
   * but the model must receive only safe metadata.
   */
  if (
    result.property &&
    typeof result.property === "object"
  ) {
    const verifiedImages =
      Array.isArray(result.property.images)
        ? result.property.images.filter(
            (image) =>
              typeof image === "string" &&
              image.trim()
          )
        : [];

    return {
      ...result,

      /*
       * Tell the model whether verified property
       * photos actually exist.
       *
       * This prevents the AI from saying:
       * "verified photos are not available"
       * when the UI actually has images.
       */
      verifiedImagesAvailable:
        verifiedImages.length > 0,

      verifiedImageCount:
        verifiedImages.length,

      /*
       * Send only the safe property data to the model.
       */
      property:
        sanitizePropertyForModel(
          result.property
        ),
    };
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| UI IMAGE EXTRACTION
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This function DOES keep image URLs.
|
| But these URLs are returned to the frontend/UI only.
| They are NOT sent back to the AI model.
|
|--------------------------------------------------------------------------
*/

export function extractPropertyImages(result) {
  if (
    !result ||
    typeof result !== "object"
  ) {
    return [];
  }

  /*
   * Search result
   *
   * Normally search results are rendered as property cards.
   * We still expose verified image data to the UI because the property
   * card may use its thumbnail.
   */
  if (Array.isArray(result.properties)) {
    return result.properties.flatMap(
      (property) => {
        if (
          !Array.isArray(property?.images)
        ) {
          return [];
        }

        return property.images
          .filter(
            (image) =>
              typeof image === "string" &&
              image.trim()
          )
          .map(
            (image) => ({
              propertyId:
                property.propertyId ||
                property.id ||
                null,

              title:
                property.title || "",

              image:
                image.trim(),
            })
          );
      }
    );
  }

  /*
   * Specific property result
   *
   * Used primarily for explicit photo requests.
   */
  if (
    result.property &&
    typeof result.property === "object"
  ) {
    const property =
      result.property;

    if (
      !Array.isArray(property.images)
    ) {
      return [];
    }

    return property.images
      .filter(
        (image) =>
          typeof image === "string" &&
          image.trim()
      )
      .map(
        (image) => ({
          propertyId:
            property.propertyId ||
            property.id ||
            null,

          title:
            property.title || "",

          image:
            image.trim(),
        })
      );
  }

  return [];
}


/*
|--------------------------------------------------------------------------
| UI PROPERTY EXTRACTION
|--------------------------------------------------------------------------
|
| Search:
|   -> returns properties for property cards
|
| get_property:
|   -> DOES NOT return the property as UI card data.
|
| This keeps the two visual flows mutually exclusive:
|
|   search_properties
|       -> property cards
|
|   get_property
|       -> verified photo gallery only
|
| This is especially important for explicit requests such as:
|
|   "iski photo dikhao"
|   "first wali ki photos dikhao"
|
| In these cases we must not render the property's normal card again.
|
|--------------------------------------------------------------------------
*/

export function extractPropertiesForUI(result) {
  if (
    !result ||
    typeof result !== "object"
  ) {
    return [];
  }

  /*
   * Search properties
   *
   * These become property cards in the frontend.
   */
  if (Array.isArray(result.properties)) {
    return result.properties;
  }

  /*
   * IMPORTANT:
   *
   * Do NOT return result.property here.
   *
   * get_property is also used for explicit photo requests.
   * Returning the property again would cause the frontend to
   * render a normal property card together with the photo gallery.
   *
   * The property remains available to the model through the
   * model-safe result, while verified images are exposed separately
   * through extractPropertyImages().
   */
  return [];
}


/*
|--------------------------------------------------------------------------
| SEARCH PROPERTIES
|--------------------------------------------------------------------------
*/

async function searchProperties(filters = {}) {
  const page = Math.max(
    Number(filters.page) || 1,
    1
  );

  const query =
    buildSearchQuery(filters);

  const skip =
    (page - 1) * MAX_RESULTS;

  const [
    properties,
    total,
  ] = await Promise.all([
    Property.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(MAX_RESULTS)
      .lean(),

    Property.countDocuments(query),
  ]);

  return {
    properties,

    total,

    page,

    limit: MAX_RESULTS,

    hasMore:
      page * MAX_RESULTS < total,
  };
}


/*
|--------------------------------------------------------------------------
| GET SPECIFIC PROPERTY
|--------------------------------------------------------------------------
*/

async function getProperty(
  propertyId
) {
  if (
    typeof propertyId !== "string" ||
    !propertyId.trim()
  ) {
    return {
      found: false,

      propertyId:
        propertyId || null,

      property: null,

      message:
        "A valid propertyId is required.",
    };
  }

  const property =
    await Property.findOne({
      propertyId:
        propertyId.trim(),

      available:
        true,
    }).lean();

  if (!property) {
    return {
      found: false,

      propertyId:
        propertyId.trim(),

      property: null,

      message:
        "Property not found or is no longer available.",
    };
  }

  /*
   * Important:
   *
   * We DO NOT remove images here.
   *
   * The complete result is needed internally so that:
   *
   * extractPropertyImages()
   *
   * can send verified images to the frontend.
   *
   * sanitizeToolResultForModel()
   *
   * will sanitize the same result before sending
   * it to the AI model.
   *
   * The model will receive:
   *
   * - verifiedImagesAvailable
   * - verifiedImageCount
   * - safe property details
   *
   * But it will NOT receive raw image URLs.
   */
  return {
    found: true,

    property,
  };
}


/*
|--------------------------------------------------------------------------
| COMPANY INFORMATION
|--------------------------------------------------------------------------
*/

async function getCompanyInfo(
  args = {}
) {
  const query =
    typeof args.query === "string"
      ? args.query.trim()
      : "";

  if (!query) {
    return {
      found: false,

      answer:
        "No company information query was provided.",
    };
  }

  const result =
    await searchCompanyKnowledge(
      query
    );

  return result;
}


/*
|--------------------------------------------------------------------------
| TOOL EXECUTOR
|--------------------------------------------------------------------------
*/

export async function executeTool(
  name,
  args = {}
) {
  console.log(
    "TOOL CALLED:",
    name
  );

  console.log(
    "TOOL ARGUMENTS:",
    args
  );

  switch (name) {
    case "search_properties":
      return searchProperties(
        args
      );

    case "get_property":
      return getProperty(
        args.propertyId
      );

    case "get_company_info":
      return getCompanyInfo(
        args
      );

    default:
      throw new Error(
        `Unknown tool: ${name}`
      );
  }
}