import { Router } from "express";
import {
  createAnalysisSessionController,
  listMyAnalysisSessionsController,
} from "../controllers/analysisController";
import { authenticateJwt, authenticateJwtIfPresent } from "../middleware/authMiddleware";
import { analysisSessionValidation } from "../middleware/validationMiddleware";

const analysisRouter = Router();

analysisRouter.post("/", authenticateJwtIfPresent, analysisSessionValidation, createAnalysisSessionController);
analysisRouter.get("/mine", authenticateJwt, listMyAnalysisSessionsController);

export default analysisRouter;
