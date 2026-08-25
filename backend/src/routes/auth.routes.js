import { Router } from "express";
import {
  resetForgotPassword,
  forgotPasswordRequest,
  login,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyEmail,
  getCurrentUser,
  changeCurrentPassword,
  resendEmailVerification,
} from "../controllers/auth.controllers.js";

import { validate } from "../middlewares/validator.middlewares.js";
import {
  userRegisterValidator,
  userLoginValidator,
  userForgotPasswordValidator,
  resetForgotPasswordValidator,
  userChangeCurrentPasswordValidator,
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// unsecure routes
router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/forgot-password")
  .post(userForgotPasswordValidator(), validate, forgotPasswordRequest);
router
  .route("/reset-password/:resetToken")
  .post(resetForgotPasswordValidator(), validate, resetForgotPassword);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router
  .route("/change-password")
  .post(
    verifyJWT,
    userChangeCurrentPasswordValidator(),
    validate,
    changeCurrentPassword,
  );
router
  .route("/resend-email-verification")
  .post(verifyJWT, resendEmailVerification);

export default router;
