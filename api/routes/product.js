const express = require('express');
const router = express.Router();
const multer = require('multer');
const userCheck = require('../middleware/check-auth');
const ProductsController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString();
        const date = now.replace(/:/g, '-');
        cb(null, date + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('The image can accept only jpeg and png mimetypes.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 *1024 *5,
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.index);

router.post('/', userCheck, upload.single('productImage'), ProductsController.create);

router.get('/:id', ProductsController.getProduct);

router.patch('/:id', userCheck, upload.single('productImage'), ProductsController.update);

router.delete('/:id', userCheck, ProductsController.delete);

module.exports = router;