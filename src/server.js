import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
  try {
    // Connect to PostgreSQL first
    await connectDB();

    // Start the Express server
    app.listen(env.PORT, () => {
      console.log(" E-Library API Started");
      console.log(`Server: http://localhost:${env.PORT}`);
      console.log(` Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error(" Failed to start the server.");
    console.error(error);
    process.exit(1);
  }
};

startServer();