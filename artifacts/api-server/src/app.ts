import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ADD THIS ROUTE HERE ---
app.get("/", (req, res) => {
  res.json({ 
    message: "Credit Tracker API is Online", 
    status: "Secure",
    timestamp: new Date().toISOString() 
  });
});
// ---------------------------

app.use("/api", router);

export default app;
