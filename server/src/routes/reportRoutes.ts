import { Router } from "express";
import {
  createFraudReportController,
  downloadReportPdfController,
  getMyReportsController,
} from "../controllers/reportController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { fraudReportValidation } from "../middleware/validationMiddleware";

const reportRouter = Router();

reportRouter.post("/", authenticateJwt, fraudReportValidation, createFraudReportController);
reportRouter.get("/mine", authenticateJwt, getMyReportsController);
reportRouter.get("/:id/pdf", authenticateJwt, downloadReportPdfController);

export default reportRouter;
