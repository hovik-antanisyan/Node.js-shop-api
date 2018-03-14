const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return next(err);
        }

        const user = new User({
            email: req.body.email,
            password: hash
        });

        user.save((err, user) => {
            if(err) {
                return next(err);
            }
            res.status(201).json({user: {email: user.email}});
        });
    });
});

router.post('/signin', (req, res, next) => {
    console.log(555);
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            return next(err);
        }

        if(!user) {
            return res.status(401).json({'message': 'Auth failed.'});
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                next(err);
            }

            if(result) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id
                    },
                    'secret',
                    {
                        expiresIn: '1h'
                    }
                );

                return res.json({message: 'Auth successful', token: token});
            } else {
                return res.status(401).json({'message': 'Auth failed.'});
            }
        })
    });
});

router.delete('/:id', (req, res, next) => {
    const userId = req.params.id;

    User.findByIdAndRemove(userId, (err, user) => {
        if (err) {
            next(err);
        }

        if (!user) {
            return res.status(404).json({
                message: 'No user for requested ID.'
            });
        }

        res.status(202).json({
            user: {email: user.email},
        });
    });
});

module.exports = router;