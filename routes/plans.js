const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/isAuth');

// const isAuth = require('../middleware/isAuth');
const plansController = require('../controllers/plans');

const router = express.Router();

router.post('/new', isAuth, plansController.createPlan);

router.post('/training-days/new', isAuth, plansController.createTrainingDay)

router.get('/all', isAuth, plansController.getPlans);

router.get('/all/:id', isAuth, plansController.getPlan);

router.get('/training-days/:id', isAuth, plansController.getTrainingDays)



module.exports = router;
