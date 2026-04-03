import express, { type Express } from "express";
import cors from "cors";
import path from "path"; // Don't forget to import path
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Define the exact path we found with the 'ls' command
const frontendDistPath = path.resolve(__currentDir, "../../credit-tracker/dist/public");

// 2. Serve the static assets (CSS, JS, Images)
app.use(express.static(frontendDistPath));

// 3. Your API routes (Keep these prefixed with /api)
app.use("/api", router);

// 4. The "Catch-All" - This replaces your app.get("/") 
// It serves the UI for the home page AND handles React refresh/routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

export default app;
