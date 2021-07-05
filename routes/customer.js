const express = require('express');

const customer_control=require('../controllers/customer');

const router=express.Router();

router.get('/signup',customer_control.get_signup);

router.post('/signup',customer_control.post_signup);

router.get('/login',customer_control.get_login);

router.post('/login',customer_control.post_login);

router.get('/bookings',customer_control.get_bookings)

module.exports=router;