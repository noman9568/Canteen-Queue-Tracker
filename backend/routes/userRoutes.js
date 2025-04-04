const express = require('express');
const router = express.Router();
const { register , login , orderData, userData } = require('../controllers/userController');

router.post('/register',register);
router.post('/login',login);
router.post('/orderData',orderData);
router.post('/userData',userData)

module.exports = router;