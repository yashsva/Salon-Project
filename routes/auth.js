const express = require('express');

const router=express.Router();

const auth_controller=require('../controllers/auth');

router.get('/logout',auth_controller.logout);

module.exports=router;