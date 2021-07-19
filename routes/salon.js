const express = require('express');

const salon_control = require('../controllers/salon');
const auth=require('../middlewares/auth');

const router = express.Router();

router.get('/signup',auth.verify_not_loggedIn, salon_control.get_signup);

router.post('/signup',auth.verify_not_loggedIn, salon_control.post_signup);

router.get('/login',auth.verify_not_loggedIn, salon_control.get_login);

router.post('/login',auth.verify_not_loggedIn, salon_control.post_login);

router.get('/city_salons',auth.verify_customer, salon_control.get_city_salons);

router.get('/all_salons', salon_control.get_all_salons);

router.get('/salon_info/:id',auth.verify_customer, salon_control.get_salon_info);

router.get('/get_empty_slots', auth.verify_customer,salon_control.get_empty_slots);

router.post('/book_slot/',auth.verify_customer,salon_control.post_book_slot);

router.get('/bookings',auth.verify_salon,salon_control.get_bookings);

router.get('/checkout/success',salon_control.get_checkout_success);

module.exports = router;