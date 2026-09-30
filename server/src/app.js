import express from "express";
import cors from "cors";

import { env } from "./config/env.js";

import propertyRoutes from "./routes/properties.js";
import chatRoutes from "./routes/chat.js";
import realtimeRoutes from "./routes/realtime.js";
import marketNewsRoutes from "./routes/marketNews.js";

const app = express();

/*
  CORS
  Allows the Prospera frontend running through
  VS Code Live Server as well as localhost.
*/
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  env.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(
        `CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `Origin ${origin} is not allowed by CORS.`
        )
      );
    },
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Prospera AI backend is running.",
    });
  }
);

app.use(
  "/api/properties",
  propertyRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/market-news",
  marketNewsRoutes
);

/*
  Realtime session receives raw SDP.
  This parser must run before the session route.
*/
app.use(
  "/api/realtime/session",
  express.text({
    type: [
      "application/sdp",
      "text/plain",
    ],
  })
);

app.use(
  "/api/realtime",
  realtimeRoutes
);

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found.",
    });
  }
);

app.use(
  (error, req, res, next) => {
    console.error(
      "Unhandled server error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
);

export default app;