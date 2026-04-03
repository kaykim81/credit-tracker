import path from "path";
import express from "express";
import app from "./app";
import { seedPersons } from "./seed";

// Default to 3000 if the environment variable is missing
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Resolve the path to the frontend dist folder
// In your Docker structure, it is two levels up from the server dist
const frontendPath = path.resolve(__dirname, "../../frontend/dist");

// Static File Serving
app.use(express.static(frontendPath));

// API routes are handled in app.ts, everything else goes to index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"), (err) => {
    if (err) {
      res.status(404).send("Frontend build not found. Ensure pnpm -r run build was successful.");
    }
  });
});

seedPersons().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server active on port ${port}`);
    console.log(`📂 Serving frontend from: ${frontendPath}`);
  });
}).catch((err) => {
  console.error("❌ Database Seed Failed:", err);
  process.exit(1);
});
