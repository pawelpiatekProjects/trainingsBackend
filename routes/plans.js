const express = require('express');
const isAuth = require('../middleware/isAuth');
const plansController = require('../controllers/plans');
const router = express.Router();

router.post('/addPlan', isAuth, plansController.createTrainingPlan);

router.post('/addTrainingDay', isAuth, plansController.addTrainingDay);

router.post('/addTrainingExercise', isAuth, plansController.addTrainingDayExercise);

router.put('/editExercise', isAuth, plansController.editTrainingDayExercise);

router.put('/editTrainingDay', isAuth, plansController.editTrainingDay);

router.put('/editTrainingPlan', isAuth, plansController.editTrainingPlan);

router.get('/all', isAuth, plansController.getAllTrainingPlans);

router.get('/all/:id', isAuth, plansController.getPlan);

router.delete('/deleteTrainingPlan', isAuth, plansController.deleteTrainingPlan);

router.delete('/deleteTrainingDay', isAuth, plansController.deleteTrainingDay);

router.delete('/deleteExercise', isAuth, plansController.deleteTrainingDayExercise);





module.exports = router;
