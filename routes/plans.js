const express = require('express');
const {body} = require('express-validator/check');

// const isAuth = require('../middleware/isAuth');
const plansController = require('../controllers/plans');

const router = express.Router();

router.post('/new', plansController.createPlan);

router.get('/all', plansController.getPlans);

router.get('/all/:id', plansController.getPlan);



module.exports = router;
