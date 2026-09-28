import { PROSPERA_SYSTEM_INSTRUCTIONS } from "./agent.js";
import { realtimeTools } from "./tools.js";
import { env } from "../config/env.js";


/*
|--------------------------------------------------------------------------
| Realtime Interface Modes
|--------------------------------------------------------------------------
|
| INDEX_VOICE
|   -> Prospera homepage voice assistant
|   -> Can naturally tell the user that results/photos are shown in chat.
|
| PROPERTY_FINDER_CHAT
|   -> Standalone AI Property Finder
|   -> Must NOT tell the user to look in a chat.
|
| NORMAL_CHAT
|   -> Generic non-homepage conversational mode.
|
|--------------------------------------------------------------------------
*/

const DEFAULT_INTERFACE_MODE =
  "PROPERTY_FINDER_CHAT";


const ALLOWED_INTERFACE_MODES =
  new Set([
    "INDEX_VOICE",
    "PROPERTY_FINDER_CHAT",
    "NORMAL_CHAT",
  ]);


/*
|--------------------------------------------------------------------------
| Normalize Interface Mode
|--------------------------------------------------------------------------
*/

function normalizeInterfaceMode(value) {
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
| Create OpenAI Realtime WebRTC Session
|--------------------------------------------------------------------------
*/

export async function createRealtimeSession(
  sdp,
  options = {}
) {
  /*
   * Validate OpenAI API key.
   */
  if (!env.openaiApiKey) {
    throw new Error(
      "OpenAI API key is not configured."
    );
  }


  /*
   * Validate SDP offer.
   */
  if (
    !sdp ||
    typeof sdp !== "string" ||
    !sdp.trim()
  ) {
    throw new Error(
      "A valid WebRTC SDP offer is required."
    );
  }


  /*
   |--------------------------------------------------------------------------
   | Resolve Interface Mode
   |--------------------------------------------------------------------------
   */

  const interfaceMode =
    normalizeInterfaceMode(
      options.interfaceMode
    );


  /*
   |--------------------------------------------------------------------------
   | Prepare Realtime Tools
   |--------------------------------------------------------------------------
   |
   | The internal tool definitions may contain
   | the `strict` property used by the normal
   | Responses API architecture.
   |
   | Realtime session tools should receive the
   | tool definition without that internal field.
   |
   |--------------------------------------------------------------------------
   */

  const realtimeSessionTools =
    realtimeTools.map(
      ({
        strict,
        ...tool
      }) => tool
    );


  /*
   |--------------------------------------------------------------------------
   | Interface-specific Runtime Instructions
   |--------------------------------------------------------------------------
   */

  const modeInstructions =
    interfaceMode === "INDEX_VOICE"
      ? `

RUNTIME CONTEXT:
PROSPERA_INTERFACE_MODE=INDEX_VOICE

This Realtime session is running on the Prospera homepage voice experience.

Keep spoken responses concise and natural.

When you search for properties, you may naturally tell the user that the matching properties have been shown in the chat.

When the user asks for verified photos of a property, you may naturally tell them that the verified photos have been shown in the chat.

Do NOT mention:
- frontend
- backend
- UI
- API
- database
- JSON
- tools
- internal implementation
- image URLs
- image links
- technical rendering details

Never speak raw image URLs or internal identifiers aloud.
`
      : `

RUNTIME CONTEXT:
PROSPERA_INTERFACE_MODE=${interfaceMode}

This is NOT the Prospera homepage voice experience.

Do not tell the user to look in the chat.

Do not say that something was rendered by the frontend or UI.

Do not mention:
- frontend
- backend
- UI
- API
- database
- JSON
- tools
- internal implementation
- image URLs
- image links

Speak naturally about the property information itself.

The webpage will handle structured property results separately.
`;


  /*
   |--------------------------------------------------------------------------
   | Complete System Instructions
   |--------------------------------------------------------------------------
   */

  const sessionInstructions =
    `${PROSPERA_SYSTEM_INSTRUCTIONS}${modeInstructions}`;


  /*
   |--------------------------------------------------------------------------
   | Realtime Session Configuration
   |--------------------------------------------------------------------------
   */

  const session = {
    /*
     * Realtime session type.
     */
    type:
      "realtime",


    /*
     * Model configured through environment variables.
     */
    model:
      env.realtimeModel,


    /*
     * Main Prospera AI instructions + runtime mode.
     */
    instructions:
      sessionInstructions,


    /*
     * Voice assistant primarily produces audio.
     */
    output_modalities: [
      "audio",
    ],


    /*
     |--------------------------------------------------------------------------
     | Audio Configuration
     |--------------------------------------------------------------------------
     */

    audio: {
      input: {
        /*
         * Speech-to-text model.
         */
        transcription: {
          model:
            "gpt-4o-mini-transcribe",
        },


        /*
         |--------------------------------------------------------------------------
         | Server-side Voice Activity Detection
         |--------------------------------------------------------------------------
         |
         | 900ms keeps the assistant noticeably faster
         | than the previous 1500ms configuration while
         | still giving the user a reasonable pause.
         |
         |--------------------------------------------------------------------------
         */

        turn_detection: {
          type:
            "server_vad",

          silence_duration_ms:
            900,

          prefix_padding_ms:
            250,

          threshold:
            0.5,
        },
      },


      /*
       |--------------------------------------------------------------------------
       | Output Voice
       |--------------------------------------------------------------------------
       */

      output: {
        /*
         * Voice configured through .env.
         */
        voice:
          env.realtimeVoice,
      },
    },


    /*
     |--------------------------------------------------------------------------
     | Available AI Tools
     |--------------------------------------------------------------------------
     |
     | search_properties
     |   -> search live property listings
     |
     | get_property
     |   -> fetch a specific property
     |   -> also used for verified property photos
     |
     | get_company_info
     |   -> answer Prospera/company questions
     |
     |--------------------------------------------------------------------------
     */

    tools:
      realtimeSessionTools,


    /*
     |--------------------------------------------------------------------------
     | Tool Execution
     |--------------------------------------------------------------------------
     |
     | Keep calls sequential.
     |
     | Example:
     |
     | 1. Search properties
     | 2. Identify a specific property
     | 3. Retrieve verified photos
     |
     | This prevents unrelated parallel calls.
     |
     |--------------------------------------------------------------------------
     */

    parallel_tool_calls:
      false,
  };


  /*
   |--------------------------------------------------------------------------
   | Create Multipart Form Data
   |--------------------------------------------------------------------------
   */

  const formData =
    new FormData();


  /*
   * WebRTC SDP offer.
   */
  formData.set(
    "sdp",
    sdp
  );


  /*
   * Complete Realtime session configuration.
   */
  formData.set(
    "session",
    JSON.stringify(session)
  );


  /*
   |--------------------------------------------------------------------------
   | Send SDP + Session Configuration to OpenAI
   |--------------------------------------------------------------------------
   */

  const response =
    await fetch(
      "https://api.openai.com/v1/realtime/calls",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${env.openaiApiKey}`,
        },

        body:
          formData,
      }
    );


  /*
   |--------------------------------------------------------------------------
   | Read OpenAI Response
   |--------------------------------------------------------------------------
   */

  const body =
    await response.text();


  /*
   |--------------------------------------------------------------------------
   | Handle OpenAI Error
   |--------------------------------------------------------------------------
   */

  if (!response.ok) {
    throw new Error(
      `OpenAI Realtime error (${response.status}): ${body}`
    );
  }


  /*
   |--------------------------------------------------------------------------
   | Return SDP Answer
   |--------------------------------------------------------------------------
   */

  return body;
}