import path from "path";
import fs from "fs"; // Add this to check if files exist
import express from "express";
import app from "./app";
import { seedPersons } from "./seed";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// 1. Target the correct folder name: 'credit-tracker'
// 2. Use process.cwd() which is more reliable in Docker (/app)
const frontendPath = path.resolve(process.cwd(), "artifacts/credit-tracker/dist");

// Debug log to help us see where it's looking
console.log(`🔍 Checking for frontend at: ${frontendPath}`);
if (!fs.existsSync(frontendPath)) {
  console.warn("⚠️  WARNING: Frontend dist folder not found!");
}

app.use(express.static(frontendPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  
  const indexFile = path.join(frontendPath, "index.html");
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send("Frontend not built. Check Docker logs for build errors.");
  }
});

seedPersons().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server live at http://0.0.0.0:${port}`);
  });
}).catch((err) => {
  console.error("❌ Critical: Database seeding or startup failed", err);
  process.exit(1);
});
