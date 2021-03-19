const Plan = require('../models/plan');
const User = require('../models/user');
const TrainingDay = require('../models/trainingDay');
const TrainingPlan = require('../models/trainingPlan');
const user = require('../models/user');

// exports.createPlan = (req, res, next) => {
//     const body = req.body;
//     console.log('body', body);
//     let creator;
//     const plan = new Plan({
//         name: body.name,
//         days: body.days,
//         trainingDays: [],
//         priority: body.priority,
//         image: body.image,
//         description: body.description,
//         creator: body.userId
//     });
//     plan.save().then(() => {
//         return User.findById(body.userId);
//     }).then(user => {
//         creator = user;
//         console.log('test creator', creator);
//         user.plans.push(plan);
//         return user.save()
//     }).then(result => {
//         res.status(201).json({
//             message: 'Created plan',
//             plan: plan,
//             creator: {
//                 _id: creator._id,
//                 name: creator.name
//             }
//         })
//     }).catch(err => {
//         console.log('Error', err);
//     })
// }

// exports.getPlans = (req, res, next) => {
//     console.log('user id', req.userId)
//     Plan.find({ creator: req.userId.toString() }).then(plans => {
//         res.status(200).json({
//             plans: plans
//         })
//     }).catch(err => console.log(err));
// }

// exports.getPlan = (req, res, next) => {
//     Plan.findById(req.params.id).then(plan => {
//         res.status(200).json({
//             plan: plan
//         })
//     }).catch(err => console.log(err))
// }

// exports.createTrainingDay = (req, res, next) => {
//     const body = req.body;
//     console.log(body);
//     let sourcePlan;
//     const trainingDay = new TrainingDay({
//         name: body.name,
//         trainings: [],
//         creator: body.userId,
//         plan: body.planId
//     });
//     trainingDay.save().then(() => {
//         return Plan.findById(planId);
//     }).then(plan => {
//         sourcePlan = plan;
//         plan.trainingDays.push(trainingDay);
//         return plan.save()
//     }).then(result => {
//         res.status(200).json({
//             message: 'Created training day'
//         })
//     }).catch(err => console.log(err))
// }

// exports.getTrainingDays = (req, res, next) => {
//     console.log('req', req);
//     TrainingDay.find({ plan: req.params.id.toString() }).then(trainingDays => {
//         res.status(200).json({
//             trainingDays: trainingDays
//         })
//     }).catch(err => console.log(err))
// }

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
        res.status(200).json({
            plans: plans
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