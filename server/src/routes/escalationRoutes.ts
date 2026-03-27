import { Router } from "express";
import { createEscalationEventController } from "../controllers/escalationController";

const escalationRouter = Router();

escalationRouter.post("/", createEscalationEventController);

export default escalationRouter;
