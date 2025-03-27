const express = require('express');
const { joinQueue , saveToken , getQueue , deleteQ } = require('../controllers/queueController');

const router = express.Router();

router.post('/join',joinQueue);
router.post('/saveToken',saveToken);
router.get('/getQueue',getQueue);
router.post('/delete',deleteQ)



module.exports = router;