const express = require('express');
const { uploadDish , dishData } = require('../controllers/imageController');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage:storage});


router.post('/add',upload.single("image"),uploadDish);
router.get('/dishData',dishData);


module.exports = router;