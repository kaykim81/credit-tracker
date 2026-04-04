import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import path from "path";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const frontendDist = path.join(process.cwd(), "artifacts/credit-tracker/dist/public");
app.use(express.static(frontendDist));

// Express 5 wildcard syntax
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
