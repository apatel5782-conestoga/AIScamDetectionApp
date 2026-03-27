import { Router } from "express";
import { getMyProfileController, updateMyProfileController } from "../controllers/userController";
import { authenticateJwt } from "../middleware/authMiddleware";
import { updateProfileValidation } from "../middleware/validationMiddleware";

const userRouter = Router();

userRouter.get("/me", authenticateJwt, getMyProfileController);
userRouter.patch("/me", authenticateJwt, updateProfileValidation, updateMyProfileController);

export default userRouter;
