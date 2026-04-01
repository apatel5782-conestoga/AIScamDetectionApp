import { Router } from "express";
import multer from "multer";
import { createAnalysisSessionController, listMyAnalysisSessionsController } from "../controllers/analysisController";
import { authenticateJwt, authenticateJwtIfPresent } from "../middleware/authMiddleware";

const analysisRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 10 },
});

analysisRouter.post(
  "/",
  authenticateJwtIfPresent,
  upload.array("files", 10),
  createAnalysisSessionController,
);

analysisRouter.get("/mine", authenticateJwt, listMyAnalysisSessionsController);

export default analysisRouter;
