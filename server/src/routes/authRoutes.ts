import { Router } from "express";
import {
  demoLoginController,
  forgotPasswordController,
  loginController,
  registerController,
} from "../controllers/authController";
import { forgotPasswordValidation, loginValidation, registerValidation } from "../middleware/validationMiddleware";

const authRouter = Router();

authRouter.post("/register", registerValidation, registerController);
authRouter.post("/login", loginValidation, loginController);
authRouter.post("/forgot-password", forgotPasswordValidation, forgotPasswordController);
authRouter.post("/demo", demoLoginController);

export default authRouter;
