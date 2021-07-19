const express = require('express');

const router = express.Router();

const auth_controller = require('../controllers/auth');
const auth = require('../middlewares/auth');


router.get('/logout', auth.verify_loggedIn, auth_controller.logout);

module.exports = router;