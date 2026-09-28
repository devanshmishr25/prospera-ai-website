import OpenAI from "openai";

import { env } from "../config/env.js";

import {
  realtimeTools,
  executeTool,
  sanitizeToolResultForModel,
  extractPropertyImages,
  extractPropertiesForUI,
} from "./tools.js";

import {
  PROSPERA_SYSTEM_INSTRUCTIONS,
} from "./agent.js";


/*
|--------------------------------------------------------------------------
| OpenAI Client
|--------------------------------------------------------------------------
*/

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
});


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

/*
 * Add only lightweight image availability metadata to the AI-visible
 * property data.
 *
 * IMPORTANT:
 *
 * We do NOT send:
 *
 * images: [
 *   "https://....",
 *   "https://...."
 * ]
 *
 * to the model.
 *
 * We only tell the model whether verified images exist and how many.
 *
 * This solves the problem where the frontend has an image but the AI
 * incorrectly says that no verified photo is available.
 */
function addImageMetadataForModel(result) {
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

      properties:
        result.properties.map(
          (property) => {
            if (
              !property ||
              typeof property !== "object"
            ) {
              return property;
            }

            const images =
              Array.isArray(property.images)
                ? property.images.filter(
                    (image) =>
                      typeof image === "string" &&
                      image.trim()
                  )
                : [];

            return {
              ...property,

              /*
               * These are safe, lightweight metadata.
               * No URL is exposed to the model.
               */
              verifiedImagesAvailable:
                images.length > 0,

              verifiedImageCount:
                images.length,
            };
          }
        ),
    };
  }

  /*
   * get_property result
   */
  if (
    result.property &&
    typeof result.property === "object"
  ) {
    const property =
      result.property;

    const images =
      Array.isArray(property.images)
        ? property.images.filter(
            (image) =>
              typeof image === "string" &&
              image.trim()
          )
        : [];

    return {
      ...result,

      property: {
        ...property,

        verifiedImagesAvailable:
          images.length > 0,

        verifiedImageCount:
          images.length,
      },
    };
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| Collect unique properties
|--------------------------------------------------------------------------
*/

function mergeProperties(
  existing,
  incoming
) {
  if (!Array.isArray(incoming)) {
    return existing;
  }

  const map = new Map();

  for (const property of existing) {
    const key =
      property?.propertyId ||
      property?._id?.toString?.() ||
      property?.id;

    if (key) {
      map.set(String(key), property);
    }
  }

  for (const property of incoming) {
    const key =
      property?.propertyId ||
      property?._id?.toString?.() ||
      property?.id;

    if (key) {
      map.set(String(key), property);
    }
  }

  return Array.from(map.values());
}


/*
|--------------------------------------------------------------------------
| Collect unique images
|--------------------------------------------------------------------------
*/

function mergeImages(
  existing,
  incoming
) {
  if (!Array.isArray(incoming)) {
    return existing;
  }

  const map = new Map();

  for (const item of existing) {
    if (
      item?.propertyId &&
      item?.image
    ) {
      map.set(
        `${item.propertyId}:${item.image}`,
        item
      );
    }
  }

  for (const item of incoming) {
    if (
      item?.propertyId &&
      item?.image
    ) {
      map.set(
        `${item.propertyId}:${item.image}`,
        item
      );
    }
  }

  return Array.from(map.values());
}


/*
|--------------------------------------------------------------------------
| Run Text AI Agent
|--------------------------------------------------------------------------
*/

export async function runTextAgent({
  message,
  previousResponseId = null,
}) {
  if (!env.openaiApiKey) {
    throw new Error(
      "OpenAI API key is not configured."
    );
  }

  if (
    typeof message !== "string" ||
    !message.trim()
  ) {
    throw new Error(
      "A valid message is required."
    );
  }


  /*
   * These arrays are for the FRONTEND/UI.
   *
   * They are never directly sent to OpenAI.
   */
  let collectedProperties = [];

  let collectedImages = [];


  /*
   * Keep latest search metadata.
   */
  let latestSearchMeta = {
    total: 0,
    page: 1,
    limit: 10,
    hasMore: false,
  };


  /*
   |--------------------------------------------------------------------------
   | FIRST MODEL REQUEST
   |--------------------------------------------------------------------------
   */

  let response =
    await openai.responses.create({
      model: env.textModel,

      instructions:
        PROSPERA_SYSTEM_INSTRUCTIONS,

      input: [
        {
          role: "user",

          content: message.trim(),
        },
      ],

      tools: realtimeTools,

      previous_response_id:
        previousResponseId || undefined,
    });


  /*
   |--------------------------------------------------------------------------
   | TOOL LOOP
   |--------------------------------------------------------------------------
   |
   | The model may request one or more tools.
   |
   | We execute them on the server.
   |
   | IMPORTANT:
   |
   | FULL RESULT
   |     -> frontend/UI
   |
   | MODEL-SAFE RESULT
   |     -> OpenAI
   |
   |--------------------------------------------------------------------------
   */

  while (true) {
    const functionCalls =
      Array.isArray(response.output)
        ? response.output.filter(
            (item) =>
              item.type ===
              "function_call"
          )
        : [];


    /*
     * No more tool calls.
     *
     * The model has finished generating
     * its final answer.
     */
    if (
      functionCalls.length === 0
    ) {
      break;
    }


    const toolOutputs = [];


    /*
     * Execute every requested function.
     */
    for (
      const toolCall of functionCalls
    ) {
      let args = {};

      try {
        args = JSON.parse(
          toolCall.arguments || "{}"
        );
      } catch (error) {
        console.error(
          "Invalid tool arguments:",
          error
        );

        args = {};
      }


      try {
        /*
         * Execute the actual backend tool.
         */
        const result =
          await executeTool(
            toolCall.name,
            args
          );


        /*
         |--------------------------------------------------------------------------
         | UI DATA
         |--------------------------------------------------------------------------
         |
         | Keep the complete verified property data
         | internally for the frontend.
         |
         */
        const uiProperties =
          extractPropertiesForUI(
            result
          );

        const uiImages =
          extractPropertyImages(
            result
          );


        /*
         * Collect properties returned by tools.
         */
        if (
          uiProperties.length > 0
        ) {
          collectedProperties =
            mergeProperties(
              collectedProperties,
              uiProperties
            );
        }


        /*
         * Collect verified images returned by
         * get_property/search_properties.
         */
        if (
          uiImages.length > 0
        ) {
          collectedImages =
            mergeImages(
              collectedImages,
              uiImages
            );
        }


        /*
         |--------------------------------------------------------------------------
         | SEARCH METADATA
         |--------------------------------------------------------------------------
         */

        if (
          toolCall.name ===
          "search_properties"
        ) {
          latestSearchMeta = {
            total:
              Number(result?.total) || 0,

            page:
              Number(result?.page) || 1,

            limit:
              Number(result?.limit) ||
              10,

            hasMore:
              Boolean(
                result?.hasMore
              ),
          };
        }


        /*
         |--------------------------------------------------------------------------
         | MODEL DATA
         |--------------------------------------------------------------------------
         |
         | First add lightweight image availability
         | metadata.
         |
         | Then remove actual image URLs.
         |
         |--------------------------------------------------------------------------
         */

        const resultWithImageMetadata =
          addImageMetadataForModel(
            result
          );

        const modelSafeResult =
          sanitizeToolResultForModel(
            resultWithImageMetadata
          );


        /*
         * Send ONLY the model-safe result
         * back to OpenAI.
         *
         * The model NEVER receives raw image URLs.
         */
        toolOutputs.push({
          type:
            "function_call_output",

          call_id:
            toolCall.call_id,

          output:
            JSON.stringify(
              modelSafeResult
            ),
        });
      } catch (error) {
        console.error(
          `Tool execution failed: ${toolCall.name}`,
          error
        );


        /*
         * Return structured error to the model.
         */
        toolOutputs.push({
          type:
            "function_call_output",

          call_id:
            toolCall.call_id,

          output:
            JSON.stringify({
              error:
                error.message ||
                "Tool execution failed.",
            }),
        });
      }
    }


    /*
     * Continue the same OpenAI response chain
     * using the tool results.
     */
    response =
      await openai.responses.create({
        model: env.textModel,

        instructions:
          PROSPERA_SYSTEM_INSTRUCTIONS,

        previous_response_id:
          response.id,

        input:
          toolOutputs,

        tools:
          realtimeTools,
      });
  }


  /*
   |--------------------------------------------------------------------------
   | FINAL RESPONSE
   |--------------------------------------------------------------------------
   */

  const text =
    typeof response.output_text ===
    "string"
      ? response.output_text.trim()
      : "";


  /*
   |--------------------------------------------------------------------------
   | IMPORTANT FINAL CLEANUP
   |--------------------------------------------------------------------------
   |
   | The model should never expose raw image URLs.
   |
   | This is an additional defensive layer.
   |
   |--------------------------------------------------------------------------
   */

  const safeText =
    text
      .replace(
        /https?:\/\/[^\s<>"']+/gi,
        ""
      )
      .replace(
        /\s{2,}/g,
        " "
      )
      .trim();


  /*
   |--------------------------------------------------------------------------
   | IMAGE ALT
   |--------------------------------------------------------------------------
   */

  const imageAlt =
    collectedImages[0]?.title ||
    "Property image";


  /*
   |--------------------------------------------------------------------------
   | RETURN
   |--------------------------------------------------------------------------
   |
   | text
   |     -> AI text only
   |
   | properties
   |     -> frontend property cards
   |
   | images
   |     -> frontend verified images
   |
   | The actual images never go to the model.
   |
   |--------------------------------------------------------------------------
   */

  return {
    text:
      safeText ||
      "I’m ready to help you find the right property.",

    responseId:
      response.id,

    properties:
      collectedProperties,

    images:
      collectedImages,

    imageAlt,

    total:
      latestSearchMeta.total,

    page:
      latestSearchMeta.page,

    limit:
      latestSearchMeta.limit,

    hasMore:
      latestSearchMeta.hasMore,
  };
}