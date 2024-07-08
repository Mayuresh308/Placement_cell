const express = require('express');
const passport = require('passport');

const router = express.Router();

const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoute');
const homeController = require('../controllers/homeController');
const companyRoutes = require('./companyRoute');


router.get('/', passport.checkAuthentication, homeController.homePage);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/company', companyRoutes);

module.exports = router;
