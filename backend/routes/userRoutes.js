const express = require('express');
const router = express.Router();
const { register , login , orderData, userData , getToken } = require('../controllers/userController');

router.post('/register',register);
router.post('/login',login);
router.post('/orderData',orderData);
router.post('/userData',userData)
router.post('/getToken',getToken);

module.exports = router;