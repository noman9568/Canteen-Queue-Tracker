const express = require('express');
const router = express.Router();
const { register , login , orderData } = require('../controllers/userController');

router.post('/register',register);
router.post('/login',login);
router.post('/orderData',orderData);

module.exports = router;