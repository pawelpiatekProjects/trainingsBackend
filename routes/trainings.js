const express = require('express');
const isAuth = require('../middleware/isAuth');
const router = express.Router();
const trainingsController = require('../controllers/trainings');

router.post('/startTraining', isAuth, trainingsController.startNewTraining);

router.post('/completeSeries', isAuth, trainingsController.completeSeries);



module.exports = router;