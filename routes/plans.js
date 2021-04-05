const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/isAuth');


const plansController = require('../controllers/plans');

const router = express.Router();





// new approach

router.post('/addPlan', isAuth, plansController.createTrainingPlan);

router.post('/addTrainingDay', isAuth, plansController.addTrainingDay);

router.post('/addTrainingExercise', isAuth, plansController.addTrainingDayExercise);

router.get('/all', isAuth, plansController.getAllTrainingPlans);

router.get('/all/:id', isAuth, plansController.getPlan);

router.delete('/deleteTrainingPlan', isAuth, plansController.deleteTrainingPlan);

router.delete('/deleteTrainingDay', isAuth, plansController.deleteTrainingDay);

router.delete('/deleteExercise', isAuth, plansController.deleteTrainingDayExercise);





module.exports = router;
