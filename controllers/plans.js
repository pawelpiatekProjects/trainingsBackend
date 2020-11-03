const Plan = require('../models/plan');
const User = require('../models/user');

exports.createPlan = (req, res, next) => {
   const body = req.body;
   console.log('body', body);
   let creator;
   const plan = new Plan({
       name: body.name,
       days: body.days,
       priority: body.priority,
       image: body.image,
       description: body.description,
       creator: body.userId
   });
   plan.save().then(() => {
       return User.findById(body.userId);
   }).then(user => {
       creator = user;
       console.log('test creator', creator);
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

exports.getPlans = (req, res, next) => {
    Plan.find({creator: req.userId.toString()}).then(plans => {
        res.status(200).json({
            plans: plans
        })
    }).catch(err => console.log(err));
}

exports.getPlan = (req, res, next) => {

}
