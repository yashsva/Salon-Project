const express = require('express');

const salon_control = require('../controllers/salon');

const router = express.Router();

router.get('/signup', salon_control.get_signup);

router.post('/signup', salon_control.post_signup);

router.get('/login', salon_control.get_login);

router.post('/login', salon_control.post_login);

router.get('/city_salons', salon_control.get_city_salons);

router.get('/all_salons', salon_control.get_all_salons);

router.get('/salon_info/:id', salon_control.get_salon_info);

router.get('/get_empty_slots', salon_control.get_empty_slots);

router.post('/book_slot/',salon_control.post_book_slot);

router.get('/bookings',salon_control.get_bookings);

module.exports = router;