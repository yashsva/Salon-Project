const express = require('express');

const customer_control = require('../controllers/customer');
const auth = require('../middlewares/auth');


const router = express.Router();

router.get('/signup', auth.verify_not_loggedIn, customer_control.get_signup);

router.post('/signup', auth.verify_not_loggedIn, customer_control.post_signup);

router.get('/login', auth.verify_not_loggedIn, customer_control.get_login);

router.post('/login', auth.verify_not_loggedIn, customer_control.post_login);

router.get('/bookings', auth.verify_customer, customer_control.get_bookings)

module.exports = router;