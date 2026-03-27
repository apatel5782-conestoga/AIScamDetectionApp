import { Router } from "express";
import {
  adminAnalyticsController,
  listAllReportsController,
  updateReportStatusController,
} from "../controllers/adminController";
import { authenticateJwt, authorizeRoles } from "../middleware/authMiddleware";

const adminRouter = Router();

adminRouter.use(authenticateJwt, authorizeRoles("admin"));
adminRouter.get("/reports", listAllReportsController);
adminRouter.patch("/reports/:id/status", updateReportStatusController);
adminRouter.get("/analytics", adminAnalyticsController);

export default adminRouter;
