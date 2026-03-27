import { Router } from "express";
import { forgotPasswordController, loginController, registerController } from "../controllers/authController";
import { forgotPasswordValidation, loginValidation, registerValidation } from "../middleware/validationMiddleware";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController);
authRouter.post("/login", loginValidation, loginController);
authRouter.post("/forgot-password", forgotPasswordValidation, forgotPasswordController);

export default authRouter;
