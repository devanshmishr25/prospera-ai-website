import { Router } from "express";

import {
  createRealtimeSession,
} from "../ai/realtime.js";

import {
  executeTool,
  sanitizeToolResultForModel,
  extractPropertyImages,
  extractPropertiesForUI,
} from "../ai/tools.js";


/*
|--------------------------------------------------------------------------
| Express Router
|--------------------------------------------------------------------------
*/

const router =
  Router();


/*
|--------------------------------------------------------------------------
| Supported Realtime Interface Modes
|--------------------------------------------------------------------------
|
| INDEX_VOICE
|   -> Prospera homepage voice assistant
|
| PROPERTY_FINDER_CHAT
|   -> Standalone AI Property Finder
|
| NORMAL_CHAT
|   -> Normal conversational mode
|
|--------------------------------------------------------------------------
*/

const ALLOWED_INTERFACE_MODES =
  new Set([
    "INDEX_VOICE",
    "PROPERTY_FINDER_CHAT",
    "NORMAL_CHAT",
  ]);


const DEFAULT_INTERFACE_MODE =
  "PROPERTY_FINDER_CHAT";


/*
|--------------------------------------------------------------------------
| Normalize Interface Mode
|--------------------------------------------------------------------------
*/

function normalizeInterfaceMode(
  value
) {
  const mode =
    typeof value === "string"
      ? value.trim().toUpperCase()
      : "";

  if (
    ALLOWED_INTERFACE_MODES.has(mode)
  ) {
    return mode;
  }

  return DEFAULT_INTERFACE_MODE;
}


/*
|--------------------------------------------------------------------------
| POST /session
|--------------------------------------------------------------------------
|
| Creates an OpenAI Realtime WebRTC session.
|
| The browser sends:
|
|   Content-Type: application/sdp
|
| The request body contains the raw SDP offer.
|
| Interface mode is passed through the query string:
|
|   /session?interfaceMode=INDEX_VOICE
|
|   /session?interfaceMode=PROPERTY_FINDER_CHAT
|
| This lets the same Realtime backend support different
| frontend experiences without changing the actual SDP body.
|
|--------------------------------------------------------------------------
*/

router.post(
  "/session",
  async (req, res) => {
    try {
      /*
       * --------------------------------------------------------------
       * Validate SDP body
       * --------------------------------------------------------------
       */

      const sdp =
        req.body;


      if (
        typeof sdp !== "string" ||
        !sdp.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "SDP offer is required.",
        });
      }


      /*
       * --------------------------------------------------------------
       * Resolve Interface Mode
       * --------------------------------------------------------------
       *
       * Default:
       * PROPERTY_FINDER_CHAT
       *
       * This is intentional because a standalone AI Property Finder
       * should never automatically inherit homepage voice wording.
       */

      const interfaceMode =
        normalizeInterfaceMode(
          req.query?.interfaceMode
        );


      /*
       * --------------------------------------------------------------
       * Create OpenAI Realtime Session
       * --------------------------------------------------------------
       */

      const answer =
        await createRealtimeSession(
          sdp,
          {
            interfaceMode,
          }
        );


      /*
       * --------------------------------------------------------------
       * Return SDP Answer
       * --------------------------------------------------------------
       *
       * Realtime WebRTC expects application/sdp.
       */

      return res
        .type("application/sdp")
        .send(answer);

    } catch (error) {
      /*
       * --------------------------------------------------------------
       * Realtime Session Error
       * --------------------------------------------------------------
       */

      console.error(
        "Realtime session error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to create Realtime session.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| POST /tool
|--------------------------------------------------------------------------
|
| Executes one Realtime function call.
|
| Request body:
|
| {
|   "name": "search_properties",
|   "arguments": {
|      ...
|   }
| }
|
| OR:
|
| {
|   "name": "get_property",
|   "arguments": {
|      "propertyId": "..."
|   }
| }
|
|--------------------------------------------------------------------------
|
| IMPORTANT IMAGE ARCHITECTURE
|
| The tool is executed once.
|
| Then the result is split into TWO independent flows:
|
| 1. MODEL DATA
|    -> sanitized
|    -> no raw image URLs
|    -> returned to OpenAI
|
| 2. UI DATA
|    -> verified image URLs may remain
|    -> returned to browser only
|
|--------------------------------------------------------------------------
*/

router.post(
  "/tool",
  async (req, res) => {
    try {
      /*
       * --------------------------------------------------------------
       * Read Tool Request
       * --------------------------------------------------------------
       */

      const {
        name,
        arguments:
          toolArguments,
      } = req.body || {};


      /*
       * --------------------------------------------------------------
       * Validate Tool Name
       * --------------------------------------------------------------
       */

      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Tool name is required.",
        });
      }


      /*
       * --------------------------------------------------------------
       * Normalize Arguments
       * --------------------------------------------------------------
       */

      const normalizedArguments =
        toolArguments &&
        typeof toolArguments === "object"
          ? toolArguments
          : {};


      /*
       * --------------------------------------------------------------
       * Execute Tool
       * --------------------------------------------------------------
       */

      const result =
        await executeTool(
          name,
          normalizedArguments
        );


      /*
       * --------------------------------------------------------------
       * MODEL-SAFE RESULT
       * --------------------------------------------------------------
       *
       * This result is the ONLY result that should be sent back
       * to the Realtime model.
       *
       * Raw image URLs are removed here.
       */

      const modelResult =
        sanitizeToolResultForModel(
          result
        );


      /*
       * --------------------------------------------------------------
       * UI PROPERTY DATA
       * --------------------------------------------------------------
       *
       * Search properties:
       *   -> property cards
       *
       * get_property:
       *   -> NO property cards
       *
       * The get_property visual flow is handled through images.
       */

      let uiProperties = [];


      if (
        name ===
        "search_properties"
      ) {
        uiProperties =
          extractPropertiesForUI(
            result
          );
      }


      /*
       * --------------------------------------------------------------
       * UI IMAGE DATA
       * --------------------------------------------------------------
       *
       * Only verified property images are extracted.
       *
       * These are intended for the browser/UI only.
       *
       * They are NEVER included inside modelResult.
       */

      let uiImages = [];


      if (
        name ===
        "get_property"
      ) {
        uiImages =
          extractPropertyImages(
            result
          );
      }


      /*
       * --------------------------------------------------------------
       * Final Structured Response
       * --------------------------------------------------------------
       *
       * model:
       *   -> safe for OpenAI
       *
       * ui:
       *   properties:
       *      -> property-card data
       *
       *   images:
       *      -> verified photo data
       *
       * The frontend decides how to visually present the structured
       * data without exposing the image URLs to the AI model.
       */

      return res.json({
        success: true,

        data: {
          model:
            modelResult,

          ui: {
            properties:
              uiProperties,

            images:
              uiImages,
          },
        },
      });

    } catch (error) {
      /*
       * --------------------------------------------------------------
       * Tool Execution Error
       * --------------------------------------------------------------
       */

      console.error(
        "Realtime tool error:",
        error
      );


      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Tool execution failed.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
*/

export default router;