const User = require('../models/user');
const Training = require('../models/training');
const TrainingPlan = require('../models/trainingPlan');

exports.startNewTraining = async(req, res, next) => {

    const {userId, planId, dayId} = req.body;

    const trainingPlan = await TrainingPlan.findById(planId);

    const trainingDay = trainingPlan.trainingDays.filter(day => day._id.toString() == dayId.toString())[0];


    const exercisesToDo = trainingDay.exercises.map(exercise => {

        const series =  exercise.repsInSeries.map(reps => {
            return {
                reps: reps,
                weight: exercise.weight,
                rate: exercise.rate,
                pause: exercise.pause
            }
        });

        return {
            _id: exercise._id,
            exerciseName: exercise.exerciseName,
            series: series
        }
    });

    console.log('exercises to do: ', exercisesToDo);

    const training = new Training({
        creator: userId,
        date: new Date(),
        length: 0,
        isFinished: false,
        planName: trainingPlan.trainingPlanName,
        dayName: trainingDay.trainingDayName,
        exercisesToDo: exercisesToDo,
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