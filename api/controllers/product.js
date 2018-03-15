const Product = require('../models/product');

module.exports = {
    index(req, res, next) {
        Product.find({})
            .select({'__v': false})
            .exec()
            .then(products => {
                if (!products.length) {
                    return res.json({message: 'No products found.'});
                }

                products = products.map((item) => {
                    return {
                        _id: item.id,
                        name: item.name,
                        price: item.price,
                        productImage: item.productImage,
                        request: {
                            type: 'GET',
                            url: `http:localhost:3000/products/${item.id}`
                        }
                    };
                });

                res.json({
                    products: products,
                    count: products.length
                });
            })
            .catch(err => {
                next(err);
            });
    },

    create(req, res, next) {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        });

        product.save((err, product) => {
            if (err) {
                next(err);
            }

            res.status(201).json({
                product: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    request: {
                        type: 'GET',
                        url: `http:localhost:3000/products/${product.id}`
                    }
                }
            });
        });
    },

    getProduct(req, res, next) {
        const productId = req.params.id;

        Product.findById(productId, {__v: false}, (err, product) => {
            if (err) {
                next(err);
            }

            if (!product) {
                return res.status(404).json({
                    message: 'No product entry for requested ID.'
                });
            }

            res.json({
                product: product,
                request: {
                    type: 'GET',
                    url: `http:localhost:3000/products`
                }
            });
        });
    },

    update(req, res, next) {
        const productId = req.params.id;
        const productProps = {};
        for (const prop in req.body) {
            if (req.body.hasOwnProperty(prop))
                productProps[prop] = req.body[prop];
        }
        if (req.file) {
            productProps.productImage = req.file.path;
        }
        console.log(productProps);

        Product.update(
            {_id: productId},
            {$set: productProps}
        )
            .select({_v: false})
            .exec()
            .then((result) => {
                res.status(202).json({
                    message: 'Product updated',
                    request: {
                        type: 'GET',
                        url: `http:localhost:3000/products/${productId}`
                    }
                });
            })
            .catch(err => {
                next(err);
            })
    },

    delete(req, res, next) {
        const productId = req.params.id;

        Product.findByIdAndRemove(productId, {__v: false}, (err, product) => {
            if (err) {
                next(err);
            }

            if (!product) {
                return res.status(404).json({
                    message: 'No product entry for requested ID.'
                });
            }

            res.status(202).json({
                product: product,
                request: {
                    type: 'POST',
                    url: `http:localhost:3000/products`,
                    body: '{name: String, price: Number}'
                }
            });
        });
    }
};