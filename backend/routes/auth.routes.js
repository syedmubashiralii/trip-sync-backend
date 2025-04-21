const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginValidationRules, validate } = require('../middlewares/validate');

router.post('/register', loginValidationRules, validate, authController.register);
router.post('/login', authController.login);


module.exports = router;
