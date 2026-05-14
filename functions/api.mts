import express, { Application, Request, Response } from "express";
import cors from "cors";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";

import { router as patientRoutes } from "./patientRoutes.mts";
import { router as surgeonRoutes } from "./surgeonRoutes.mts";
import { router as researcherRoutes } from "./researcherRoutes.mts";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://precede-ptda.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: "application/vnd.api+json" }));
app.use(cookieParser());

// Routes
app.use("/.netlify/functions/api/patients", patientRoutes);
app.use("/.netlify/functions/api/surgeons", surgeonRoutes);
app.use("/.netlify/functions/api/researchers", researcherRoutes);

app.use("/", (req: Request, res: Response): void => {
  res.status(200).send(JSON.stringify({ message: "Allo! Catch-all route." }));
});

export const handler = serverless(app);

export default app;
