import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Path to your UI files
const frontendPath = path.resolve(process.cwd(), "artifacts/credit-tracker/dist/public");

// 2. Serve static files FIRST
app.use(express.static(frontendPath));

// 3. API Routes SECOND
app.use("/api", router);

// 4. Catch-all LAST (Using the (.*) syntax for Node 24)
app.get("(.*)", (req, res) => {
  const indexPath = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("UI files not found in container.");
  }
});

export default app;
