import path from "path";
import express from "express";
import app from "./app";
import { seedPersons } from "./seed";

const rawPort = process.env["PORT"] || "3000";
const port = Number(rawPort);

// --- SERVE FRONTEND ---
// This points to the 'dist' folder created by 'pnpm -r run build'
const frontendPath = path.resolve(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));

// Support for Single Page App (SPA) routing
app.get("*", (req, res, next) => {
  // If the request starts with /api, let the router handle it
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});
// ----------------------

seedPersons().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}).catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});
