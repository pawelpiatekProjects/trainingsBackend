const express = require('express');
const statisticsController = require('../controllers/statistics');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.put('/updateRecords', isAuth, statisticsController.updatePersonalRecords);


module.exports = router;