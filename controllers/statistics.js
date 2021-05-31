const User = require('../models/user');

exports.updatePersonalRecords = async(req, res, next) => {
    const { userId, squat, benchPress, deadlift } = req.body.params;

    const user = await User.findById(userId);

    const personalRecords = user.personalRecords;
    personalRecords.squat = squat;
    personalRecords.benchPress = benchPress;
    personalRecords.deadlift = deadlift;

    user.save().then(() => {
        res.status(201).json({
            message: `Updated records`
        })
    }).catch(err => {
        res.status(500).json({
            message: `Can't update`
        })
    })

}