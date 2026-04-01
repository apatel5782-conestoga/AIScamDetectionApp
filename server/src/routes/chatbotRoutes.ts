import { Router } from "express";
import { chatbotController } from "../controllers/chatbotController";

const chatbotRouter = Router();

chatbotRouter.post("/", chatbotController);

export default chatbotRouter;
