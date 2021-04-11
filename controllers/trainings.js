const User = require('../models/user');
const Training = require('../models/training');
const TrainingPlan = require('../models/trainingPlan');

exports.startNewTraining = async(req, res, next) => {

    const {userId, planId, dayId} = req.body;

    const trainingPlan = await TrainingPlan.findById(planId);

    const trainingDay = trainingPlan.trainingDays.filter(day => day._id.toString() == dayId.toString())[0];


    const exercises = trainingDay.exercises.map(exercise => {

        const series =  exercise.repsInSeries.map(reps => {
            return {
                reps: reps,
                weight: exercise.weight,
                rate: exercise.rate,
                pause: exercise.pause,
                isFinished: false
            }
        });

        return {
            _id: exercise._id,
            exerciseName: exercise.exerciseName,
            isFinished: false,
            series: series
        }
    });


    const training = new Training({
        creator: userId,
        date: new Date(),
        length: 0,
        isFinished: false,
        planName: trainingPlan.trainingPlanName,
        dayName: trainingDay.trainingDayName,
        exercises: exercises,
        finishedExercises: []
    });

    training.save().then(() => {
        return User.findById(userId);
    }).then(user => {
        user.trainings.push(training);
        return user.save();
    }).then(result => {
        res.status(201).json({
            message: 'Started training',
            training: training
        })
    }).catch(err => {
        res.status(400).json({
            message: err
        })
        console.log('Error', err);
    })
}

exports.completeSeries = async(req, res, next) => {
    const {trainingId, exerciseId, seriesId, reps, weight, pause, rate} = req.body;

    const training = await Training.findById(trainingId);

    const exercise = training.exercises.filter(exercise => exercise._id.toString() == exerciseId.toString())[0];

    const series = exercise.series.filter(series => series._id.toString() == seriesId.toString())[0];
    series.isFinished = true;
    series.reps = reps;
    series.weight = weight;
    series.pause = pause;
    series.rate = rate;

    training.save().then(result => {
        res.status(201).json({
            message: 'Completed serie',
            training: training
        })
    }).catch(err => {
        res.status(400).json({
            message: err
        })
        console.log('Error', err);
    })
}