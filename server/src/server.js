import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";

async function startServer() {
  try {
    await connectDatabase();

    app.listen(
      env.port,
      () => {
        console.log(
          `Prospera AI server running on http://localhost:${env.port}`
        );
        
      }
    );
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
}

startServer();