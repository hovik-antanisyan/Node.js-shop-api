const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
    Order.find({}, {__v: false})
        .populate('product')
        .exec()
        .then(orders => {
            console.log(orders);
            res.json({orders: orders});
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        qty: req.body.qty,
        product: req.body.productId
    });
    console.log(req.body);
    order.save()
        .then(order => {
            console.log('ok');
            res.status(201).json({
                order: order
            });
        })
        .catch(err => {
            console.log('err:', err);
            next(err);
        })
});

router.get('/:id', (req, res, next) => {
    res.json({message: 'Order detail', id: req.params.id});
});

router.delete('/:id', (req, res, next) => {
    console.log('delete');
    res.status(202).json({message: 'Order deleted', id: req.params.id});
});

module.exports = router;