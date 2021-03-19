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
        console.log('Error', err);
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
                trainingDaysNum: plan.trainingDays.length
            }
        })
        res.status(200).json({
            plans: plansData
        })
    }).catch(err => console.log(err));
}

exports.getPlan = (req, res, next) => {
    Plan.findById(req.params.id).then(plan => {
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

exports.addTrainingDayExercise = (req, res, next) => {
    const { userId, planId, dayId, name, series, weight, pauseTime, rate, ytLink, description } = req.body;
    let creator;
    let newPlan;

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
    }).catch(err => console.log(err))
}