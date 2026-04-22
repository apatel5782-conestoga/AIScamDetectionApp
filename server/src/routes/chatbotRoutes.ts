import { Router } from "express";
import multer from "multer";
import { chatbotController } from "../controllers/chatbotController";

const chatbotRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 5 },
});

chatbotRouter.post("/", upload.array("files", 5), chatbotController);

export default chatbotRouter;
