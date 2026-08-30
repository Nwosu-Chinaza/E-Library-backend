import express from "express";
import cors from "cors";
import env from "./config/env.js";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import bookFileRoutes from "./routes/bookFileRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import readingHistoryRoutes from "./routes/readingHistoryRoute.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { testEmail } from "./services/emailService.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Log every incoming request
app.use(morgan("dev"));
app.use("/api/books", favoriteRoutes);
app.use("/api/books", readingHistoryRoutes);
app.use("/api/books", readingRoutes);
app.use("/api/books", bookFileRoutes);
app.use("/api/books", downloadRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(express.static(path.join(__dirname, "public")));





app.get("/test-email", async (req, res) => {
  try {
    const result = await testEmail();

    return res.status(200).json({
      success: true,
      message: "Test email sent successfully.",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send test email.",
    });
  }
});





app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Library API is running.",
    version: "1.0.0",
  });
});

// Handle unknown routes
app.use(notFound);
// Handle all errors
app.use(errorHandler);

export default app;
