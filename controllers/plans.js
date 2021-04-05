const Plan = require('../models/plan');
const User = require('../models/user');
const TrainingDay = require('../models/trainingDay');
const TrainingPlan = require('../models/trainingPlan');
const user = require('../models/user');

// New approach

exports.createTrainingPlan = (req, res, next) => {
    const { trainingPlanName, description, userId, image } = req.body;

    let creator;
    const plan = new TrainingPlan({
        trainingPlanName: trainingPlanName,
        description: description,
        creator: userId,
        image: image,
        trainingDays: []
    });

    plan.save().then(() => {
        return User.findById(userId);
    }).then(user => {
        creator = user;
        user.plans.push(plan);
        return user.save()
    }).then(result => {
        res.status(201).json({
            message: 'Created plan',
            plan: plan,
            creator: {
                _id: creator._id,
                name: creator.name
            }
        })
    }).catch(err => {
        res.status(400).json({
            message: err
        })
        console.log('Error', err);
    })

}

exports.deleteTrainingPlan = (req, res, next) => {
    const {userId, planId } = req.query;
    TrainingPlan.deleteOne({_id: planId}).then(() => {
        const user = User.findById(userId);
        return user;
    }).then(user => {
        return TrainingPlan.find({ creator: userId.toString() }).then(plans => {
            user.plans = plans;
            return user.save();
        })
         
    }).then(result => {
        res.json({
            message: 'Deleted training plan'
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: err
        })
    })
}

exports.getAllTrainingPlans = (req, res, next) => {
    TrainingPlan.find({ creator: req.userId.toString() }).then(plans => {
        const plansData = plans.map(plan => {
            return {
                _id: plan._id,
                name: plan.trainingPlanName,
                description: plan.description,
                creator: plan.creator,
                image: plan.image,
                trainingDaysNum: plan.trainingDays.length,
                createdAt: plan.createdAt
            }
        })
        res.status(200).json({
            plans: plansData
        })
    }).catch(err => console.log(err));
}

exports.getPlan = (req, res, next) => {
    console.log('id: ', req.params.id)
    TrainingPlan.findById(req.params.id).then(plan => {
        res.status(200).json({
            plan: plan
        })
    }).catch(err => console.log(err))
}

exports.addTrainingDay = (req, res, next) => {
    const { name, userId, planId } = req.body;
    let creator;
    let newPlan;
    console.log('planId: ', planId)
    TrainingPlan.findById(planId).then(plan => {
        const trainingDay = {
            trainingDayName: name,
            exercises: []
        }
        console.log(plan)
        plan.trainingDays.push(trainingDay);
        newPlan = plan;
        return plan.save();
    }).then(() => {
        return User.findById(userId);
    }).then(user => {
        creator = user;
        return TrainingPlan.find({ creator: userId.toString() }).then(plans => {
            user.plans = plans;
            return user.save();
        })
    }).then(result => {
        res.status(200).json({
            plan: newPlan
        })
    }).catch(err => console.log(err))

}

exports.deleteTrainingDay = (req, res, next) => {
    const {userId, planId, dayId} = req.query;

    TrainingPlan.findById(planId).then(plan => {
        plan.trainingDays = plan.trainingDays.filter(day => day._id.toString() != dayId.toString());
        return plan.save();
    }).then(user => {
        creator = user;
        return TrainingPlan.find({ creator: userId.toString() }).then(plans => {
            user.plans = plans;
            return user.save();
        })
    }).then(result => {
        res.status(200).json({
            message: 'Deleted training day',
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: err
        })
    })
}

exports.addTrainingDayExercise = (req, res, next) => {
    const { userId, planId, dayId, name, series, weight, pauseTime, rate, ytLink, description } = req.body;
    let creator;
    let newPlan;
    console.log('pause time ', pauseTime);
    TrainingPlan.findById(planId).then(plan => {
        const exercise = {
            exerciseName: name,
            repsInSeries: series,
            weight: weight,
            pause: pauseTime,
            rate: rate,
            ytLink: ytLink,
            exerciseDescription: description
        };
        const trainingDay = plan.trainingDays.filter(day => day._id.toString() == dayId.toString())[0];
        trainingDay.exercises.push(exercise);
        newPlan = plan;
        return plan.save()
    }).then(() => {
        return User.findById(userId);
    }).then(user => {
        creator = user;
        return TrainingPlan.find({ creator: userId.toString() }).then(plans => {
            user.plans = plans;
            return user.save();
        })
    }).then(result => {
        res.status(200).json({
            plan: newPlan
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: err
        })
    })
}

exports.deleteTrainingDayExercise = (req, res, next) => {
    const {userId, planId, dayId, exerciseId} = req.query;
    console.log(`userId: ${userId}, planId: ${planId}, dayID: ${dayId}, exerciseId: ${exerciseId}`);
    // console.log('request: ', req)

    let creator;
    let newPlan;

    TrainingPlan.findById(planId).then(plan => {
        const trainingDay = plan.trainingDays.filter(day => day._id.toString() == dayId.toString())[0];
        trainingDay.exercises = trainingDay.exercises.filter(exercise => exercise._id.toString() != exerciseId.toString());
        return plan.save();
    }).then(user => {
        creator = user;
        return TrainingPlan.find({ creator: userId.toString() }).then(plans => {
            user.plans = plans;
            return user.save();
        })
    }).then(result => {
        res.status(200).json({
            message: 'Deleted exercise',
            plan: newPlan
        })
    }).catch(err => {
        console.log(err)
        res.status(400).json({
            message: err
        })
    })
}