import path from "path";
import express from "express";
import app from "./app";
import { seedPersons } from "./seed";

// Use 3000 as a hard fallback if PORT is missing
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Force the path to be absolute within the Docker container
const frontendPath = path.join(__dirname, "../../frontend/dist");

// Static serving for the UI
app.use(express.static(frontendPath));

// Route all non-API requests to the index.html for SPA support
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

seedPersons().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server live at http://0.0.0.0:${port}`);
    console.log(`📂 Frontend served from: ${frontendPath}`);
  });
}).catch((err) => {
  console.error("❌ Critical: Database seeding or startup failed", err);
  process.exit(1);
});
