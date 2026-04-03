import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. This logic finds the 'artifacts' root regardless of where the script runs
const rootDir = path.resolve(process.cwd());
const frontendDistPath = path.join(rootDir, "artifacts/credit-tracker/dist/public");

console.log("------------------------------------------");
console.log("SERVER STARTUP DEBUG INFO:");
console.log("Current Working Directory:", rootDir);
console.log("Looking for Frontend at:", frontendDistPath);
console.log("Does it exist?", fs.existsSync(frontendDistPath));
console.log("------------------------------------------");

app.use(express.static(frontendDistPath));
app.use("/api", router);

// Use the Express 5 compatible catch-all
app.get("(.*)", (req, res) => {
  const indexPath = path.join(frontendDistPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If it's not found, tell us the EXACT path it failed on in the browser
    res.status(404).send(`Frontend not found. Server was looking at: ${indexPath}`);
  }
});

export default app;
