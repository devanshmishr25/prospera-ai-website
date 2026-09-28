import { Router } from "express";

import { runTextAgent } from "../ai/chat.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      message,
      previousResponseId,
    } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "message must be a non-empty string.",
      });
    }

    const result =
      await runTextAgent({
        message,
        previousResponseId:
          typeof previousResponseId ===
          "string"
            ? previousResponseId
            : null,
      });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Chat route error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to process AI request.",
    });
  }
});

export default router;