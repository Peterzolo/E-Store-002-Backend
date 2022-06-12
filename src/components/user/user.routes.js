const express = require("express");
const router = express.Router();

const {
  validateSignUp,
  validateLogin,
  validateEdit,
} = require("./user.validator");
const userController = require("./user.controller");

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");
const { getAuthorize } = require("../../library/middlewares/authMiddleware");
const {
  isResetTokenValid,
} = require("../../library/middlewares/resetPasswordMiddleware");

router.post(
  "/register",
  validateSignUp(),
  catchErrors(userController.userSignUp)
);

router.post("/verify-email", catchErrors(userController.verifyEmail));
router.post("/login", catchErrors(userController.login));
router.get(
  "/get-own-user",
  getAuthorize,
  catchErrors(userController.getOwnUser)
);
router.get(
  "/get-single/:userId",
  getAuthorize,
  catchErrors(userController.getUserById)
);
router.get("/get-users", getAuthorize, catchErrors(userController.getAllUsers));
router.put("/edit/:id", getAuthorize, catchErrors(userController.editUser));
router.delete(
  "/remove/:id",
  getAuthorize,
  catchErrors(userController.deleteUser)
);
router.post(
  "/forgot-password",
  getAuthorize,
  catchErrors(userController.forgotPassword)
);
router.post(
  "/reset-password",
  isResetTokenValid,
  catchErrors(userController.resetPassword)
);

module.exports = router;
