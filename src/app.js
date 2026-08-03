import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";


const app = express();

// Security headers
app.use(helmet());

app.use(
    cors({
        // origin: "http://localhost:5173",
        credentials: true,
    })
);

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Log every incoming request
app.use(morgan("dev"));


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "E-Library API is running.",
        version: "1.0.0",
    });
});
app.use("/api/auth", authRoutes);



app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

export default app;