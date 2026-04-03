import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use __dirname instead of __currentDir
const frontendDistPath = path.resolve(__dirname, "../../credit-tracker/dist/public");

app.use(express.static(frontendDistPath));

app.use("/api", router);

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

export default app;
