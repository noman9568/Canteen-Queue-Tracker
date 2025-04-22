const express = require('express');
const router = express.Router();
const { register , login , orderData, userData , getToken , update } = require('../controllers/userController');

router.post('/register',register);
router.post('/login',login);
router.post('/orderData',orderData);
router.post('/userData',userData)
router.post('/getToken',getToken);
router.post('/update',update);

module.exports = router;