import express from "express";
import Property from "../models/Property.js";

const router = express.Router();

/*
  GET /api/properties/search

  Example:

  /api/properties/search?
  city=Lucknow&
  locality=Gomti%20Nagar&
  bedrooms=2&
  minPrice=3000000&
  maxPrice=7000000&
  type=Apartment&
  page=1&
  limit=10
*/

router.get("/search", async (req, res) => {
  try {
    const {
      city,
      locality,
      bedrooms,
      minPrice,
      maxPrice,
      type,
      listingType,
      parking,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      available: true,
    };

    if (city) {
      query["location.city"] = new RegExp(
        `^${escapeRegex(city)}$`,
        "i"
      );
    }

    if (locality) {
      query["location.locality"] = new RegExp(
        escapeRegex(locality),
        "i"
      );
    }

    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (type) {
      query.type = type;
    }

    if (listingType) {
      query.listingType = listingType;
    }

    if (parking !== undefined) {
      query.parking = parking === "true";
    }

    const safeLimit = Math.min(
      Math.max(Number(limit) || 10, 1),
      10
    );

    const safePage = Math.max(
      Number(page) || 1,
      1
    );

    const skip =
      (safePage - 1) * safeLimit;

    const [properties, total] =
      await Promise.all([
        Property.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .lean(),

        Property.countDocuments(query),
      ]);

    res.json({
      success: true,

      data: properties,

      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(
          total / safeLimit
        ),
        hasMore:
          safePage * safeLimit < total,
      },
    });
  } catch (error) {
    console.error(
      "Property search error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to search properties.",
    });
  }
});

/*
  GET /api/properties/:propertyId
*/

router.get("/:propertyId", async (req, res) => {
  try {
    const property =
      await Property.findOne({
        propertyId:
          req.params.propertyId,
      }).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error(
      "Property detail error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch property.",
    });
  }
});

function escapeRegex(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

export default router;