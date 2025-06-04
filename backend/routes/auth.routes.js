const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  registerValidationRules,
  validate,
} = require("../middlewares/validate");
const upload = require("../middlewares/upload.middleware");
const { googleLogin } = require("../controllers/google.controller");

router.use(express.urlencoded({ extended: true }));

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10,
  message: "Too many login attempts. Please try again after 5 minutes.",
});
// router.post('/register', registerValidationRules, validate, upload.single('profile_image'), authController.register);
router.post(
  "/register",
  upload.single("profile_image"),
  authController.register
);
router.post("/login", loginLimiter, authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forget-password", authController.forgotPassword);
router.post("/reset-password-with-otp", authController.resetPasswordWithOTP);
router.delete("/delete-user", authController.deleteAccount);
router.get("/get-user-type", authController.getUserType);
router.get("/get-all-users", authController.getAllUsers);
//Google
router.post("/google-login", googleLogin);

module.exports = router;
