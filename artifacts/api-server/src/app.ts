import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs"; // Add fs to check if the file exists
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Resolve the path and log it for debugging
// Replace your path definition with this:
const frontendDistPath = path.resolve(process.cwd(), "../../artifacts/credit-tracker/dist/public");
console.log("Serving frontend from:", frontendDistPath);

// 2. Safety Check: If the folder doesn't exist, log a warning instead of crashing later
if (!fs.existsSync(frontendDistPath)) {
  console.error("FATAL: Frontend dist/public folder not found at", frontendDistPath);
}

// 3. Serve static files
app.use(express.static(frontendDistPath));

app.use("/api", router);

// 4. Catch-all for SPA routing
// To this (Express 5 compatible):
app.get("(.*)", (req, res) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Frontend index.html not found.");
  }
});

export default app;
