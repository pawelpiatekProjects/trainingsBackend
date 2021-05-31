const express = require('express');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const trainingsController = require('../controllers/trainings');

router.post('/checkTrainings', isAuth, trainingsController.checkTrainings);

router.post('/startTraining', isAuth, trainingsController.startNewTraining);

router.post('/completeSeries', isAuth, trainingsController.completeSeries);

router.post('/completeTraining', isAuth, trainingsController.completeTraining);

router.post('/finishPreviousTraining', isAuth, trainingsController.finishPreviousTraining);

router.post('/fetchNotFinished', isAuth, trainingsController.fetchNotFinishedTraining);

router.get('/all', isAuth, trainingsController.fetchTrainings);

router.get('/all/:id', isAuth, trainingsController.fetchTraining);



module.exports = router;