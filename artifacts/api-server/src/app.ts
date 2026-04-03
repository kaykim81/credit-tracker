import express, { type Express } from "express";
import path from "path";
import fs from "fs";

const app: Express = express();

// 1. NO CORS, NO JSON, NO ROUTER - Just the basics to start
const frontendDistPath = path.resolve(process.cwd(), "artifacts/credit-tracker/dist/public");

// 2. Logging
console.log("CRITICAL DEBUG: Starting Minimal App");
console.log("Target Path:", frontendDistPath);

// 3. Simple static serving
app.use(express.static(frontendDistPath));

// 4. Simplest possible catch-all (No regex, just a function)
app.use((req, res, next) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("File Not Found");
  }
});

export default app;
