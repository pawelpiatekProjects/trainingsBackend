const User = require('../models/user');

exports.getUser = (req, res, next) => {
    // console.log('user id', req.userId)
    User.findById(req.userId).then(user => {
        res.status(200).json({
            user: user
        })
    }).catch(err => console.log(err))
};
