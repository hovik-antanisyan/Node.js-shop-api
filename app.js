const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/node-shop');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Allow requests from other servers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Origin, X-requested-With, Accept, Authorization'
    );
    if (req.method === 'OPTION') {
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE'
        );
        return res.status(200).json();
    }
    next();
});

//Routes which handles requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Handling Not found errors
app.use(function (req, res, next) {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    console.log(error.message);
    res
        .status(error.status || 500)
        .json({error: {message: error.message}});
});

module.exports = app;