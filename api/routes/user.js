const express = require('express');
const router = express.Router();
const UserContreller = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserContreller.signup);

router.post('/signin', UserContreller.signin);

router.delete('/:id', checkAuth, UserContreller.delete);

module.exports = router;