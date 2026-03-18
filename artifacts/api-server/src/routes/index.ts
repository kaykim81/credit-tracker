import { Router, type IRouter } from "express";
import healthRouter from "./health";
import personsRouter from "./persons";
import creditsRouter from "./credits";

const router: IRouter = Router();

router.use(healthRouter);
router.use(personsRouter);
router.use(creditsRouter);

export default router;
