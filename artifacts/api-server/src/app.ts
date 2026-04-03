import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;


import { dbTestRouter } from './routes/db-test';

// ... other middleware
app.use('/api', dbTestRouter); // This makes the URL: /api/db-test
