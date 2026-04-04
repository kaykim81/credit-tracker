import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import path from "path";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve frontend static files
const frontendDist = path.join(__dirname, "../../../artifacts/credit-tracker/dist/public");
app.use(express.static(frontendDist));

// SPA catch-all — serve index.html for any non-API route
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
