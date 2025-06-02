const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const upload = require('../middlewares/upload.middleware');


router.use(express.urlencoded({ extended: true }));
router.get('/', profileController.getProfile);
router.put('/',upload.single('profile_image'), profileController.updateProfile);
router.put("/update-password", profileController.updatePassword);


module.exports = router;
