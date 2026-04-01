import { Router } from "express";
import { newsController } from "../controllers/newsController";

const newsRouter = Router();

newsRouter.get("/", newsController);

export default newsRouter;
