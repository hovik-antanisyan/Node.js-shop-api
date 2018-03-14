const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order')
const userCheck = require('../middleware/check-auth');

router.get('/', userCheck, (req, res, next) => {
    Order.find({}, {__v: false})
        .populate('product', {__v: false})
        .exec()
        .then(orders => {
            res.json({
                orders: orders.map((order) => {
                    return {
                        _id: order._id,
                        product: order.product,
                        qty: order.qty,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${order._id}`
                        }
                    };
                }),
                count: orders.length
            });
        })
        .catch(err => {
            next(err);
        });
});

router.post('/', userCheck, (req, res, next) => {
    const order = new Order({
        qty: req.body.qty,
        product: req.body.productId
    });
    order.save()
        .then(order => {
            res.status(201).json({
                order: order
            });
        })
        .catch(err => {
            next(err);
        })
});

router.get('/:id', userCheck, (req, res, next) => {
    const orderId = req.params.id;

    Order.findById(orderId)
        .populate('product', {__v: false})
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'No order found.'
                });
            }

            res.json({
                _id: order._id,
                qty: order.qty,
                product: order.product,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders`
                }
            });
        })
        .catch(err => {
            return next(err);
        });
});

router.delete('/:id', userCheck, (req, res, next) => {
    const orderId = req.params.id;

    Order.findByIdAndRemove(orderId, {__v: false}, (err, order) => {
        if (err) {
            next(err);
        }

        if (!order) {
            return res.status(404).json({
                message: 'No order entry for requested ID.'
            });
        }

        res.status(202).json({
            order: order,
            request: {
                type: 'POST',
                url: `http:localhost:3000/orders`,
                body: '{product: ObjectId, qty: Number}'
            }
        });
    })
});

module.exports = router;