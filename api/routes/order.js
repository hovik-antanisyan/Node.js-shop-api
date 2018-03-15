const express = require('express');
const router = express.Router();
const userCheck = require('../middleware/check-auth');
const OrdersController = require('../controllers/order');

router.get('/', userCheck, OrdersController.index);

router.post('/', userCheck, OrdersController.create);

router.get('/:id', userCheck, OrdersController.getOrder);

router.delete('/:id', userCheck, OrdersController.delete);

module.exports = router;