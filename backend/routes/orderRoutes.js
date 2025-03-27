const express = require("express");
const { placeOrder , saveOrder } = require("../controllers/orderController");

const router = express.Router();

router.post('/placeOrder',placeOrder);
router.post('/saveOrder',saveOrder);

module.exports = router;