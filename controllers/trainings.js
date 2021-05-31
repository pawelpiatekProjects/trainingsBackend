const User = require('../models/user');
const Training = require('../models/training');
const TrainingPlan = require('../models/trainingPlan');

exports.fetchTrainings = async (req, res, next) => {
    const userId = req.userId;

    Training.find({ creator: userId }).then(trainings => {
        const trainingsData = trainings.map(training => {
            return {
                _id: training._id,
                creator: training.creator,
                date: training.date,
                length: training.length,
                planName: training.planName,
                dayName: training.dayName,
                isFinished: training.isFinished
            }
        });
        res.status(200).json({
            trainings: trainingsData
        })
    }).catch(err => {
        const error = new Error('Could not fetch plans');
        error.status(500);
        throw error;
    });


}

exports.fetchTraining = async (req, res, next) => {
    const { id } = req.params;

    Training.findById(id).then(training => {
        res.status(200).json({
            training: training
        })
    }).catch(err => console.log(err))
}

exports.checkTrainings = async (req, res, next) => {
    const { userId } = req.body;

    if(!userId) {
        res.status(403);
    }

    const userTrainings = await Training.find({ creator: userId });

    const notFinishedTraining = userTrainings.filter(training => !training.isFinished);

    let previousTraining;

    if(notFinishedTraining.length === 0) {
        previousTraining = {}
    } else {
        previousTraining = notFinishedTraining[0];
    }

    console.log('user trainings: ', userTrainings);

    console.log('not finished trainings: ', notFinishedTraining)

    res.status(201).json({
        prevoiusTraining: previousTraining
    })

}

exports.fetchNotFinishedTraining = async (req, res, next) => {
    const { userId } = req.body;

    if(!userId) {
        res.status(403);
    }

    const userTrainings = await Training.find({ creator: userId });

    const notFinishedTraining = userTrainings.filter(training => !training.isFinished)[0];

    if(notFinishedTraining) {
        res.status(200).json({
            training: notFinishedTraining
        })
    } else {
        res.status(500);
    }
}

exports.finishPreviousTraining = async (req, res, next) => {
    const { userId } = req.body;

    if(!userId) {
        res.status(403);
    }

    const userTrainings = await Training.find({ creator: userId });

    const notFinishedTraining = userTrainings.filter(training => !training.isFinished)[0];
    notFinishedTraining.isFinished = true;
    
    notFinishedTraining.save().then(() => {
        res.status(200). json({
            message: 'Finished training'
        })
    }).catch(e => console.log(e))
}

exports.startNewTraining = async (req, res, next) => {

    const { userId, planId, dayId } = req.body;

    const trainingPlan = await TrainingPlan.findById(planId);

    const trainingDay = trainingPlan.trainingDays.filter(day => day._id.toString() == dayId.toString())[0];

    const exercises = trainingDay.exercises.map(exercise => {

        const series = exercise.repsInSeries.map(reps => {
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
        exercises: exercises
    });

    training.save()
        .then(result => {
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

exports.completeSeries = async (req, res, next) => {
    const { trainingId, exerciseId, seriesId, reps, weight, pause, rate } = req.body;

    const training = await Training.findById(trainingId);

    const exercise = training.exercises.filter(exercise => exercise._id.toString() == exerciseId.toString())[0];

    const series = exercise.series.filter(series => series._id.toString() == seriesId.toString())[0];
    series.isFinished = true;
    series.reps = reps;
    series.weight = weight;
    series.pause = pause;
    series.rate = rate;

    const notFinishedSeries = exercise.series.filter(series => !series.isFinished).length;


    if (notFinishedSeries === 0) {
        exercise.isFinished = true;
    }



    console.log('not finished series: ', notFinishedSeries);

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

exports.completeTraining = async (req, res, next) => {

    const { trainingId, userId } = req.body;

    const training = await Training.findById(trainingId);

    training.isFinished = true;

    training.save().then(() => {
        return User.findById(userId);
    }).then(user => {
        user.trainings.push(training);
        return user.save();
    }).then(async result => {

        const trainings = await Training.find({creator: userId});
        res.status(201).json({
            message: 'Finished training',
            trainings: trainings
        })
    }).catch(err => {
        res.status(400).json({
            message: err
        })
        console.log('Error', err);
    })

}