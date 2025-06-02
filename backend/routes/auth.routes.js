const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidationRules, validate } = require('../middlewares/validate');
const upload = require('../middlewares/upload.middleware');


router.use(express.urlencoded({ extended: true }));
// router.post('/register', registerValidationRules, validate, upload.single('profile_image'), authController.register);
router.post('/register', upload.single('profile_image'), authController.register);
router.post('/login', authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/forget-password', authController.forgotPassword);
router.post('/reset-password-with-otp', authController.resetPasswordWithOTP);
router.delete('/delete-user', authController.deleteAccount);
router.get('/get-user-type', authController.getUserType);
router.get('/get-all-users', authController.getAllUsers);


module.exports = router;
