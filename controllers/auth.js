const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name,
                lastName: lastName,
                userName: userName,
                refreshToken: ''
            });
            return user.save()
        })
        .then(result => {
            res.status(201)
                .json({
                    message: 'User created',
                    userId: result._id
                })
        })
        .catch(err => {
            console.log(err);
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('error')
                const error = new Error('A user with this email could not be found');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'somesupersecretstringformykey',
                { expiresIn: '15s' }
            );
            const refreshToken = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            }, 'refreshtokensecret')
            loadedUser.refreshToken = refreshToken;
            loadedUser.save();
            return res
                .status(200)
                .json({
                    token: token,
                    refreshToken: refreshToken,
                    userId: loadedUser._id.toString()
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return next(err);
        })
};

exports.refreshToken = (req, res, next) => {
    const {refrshToken, userId} = req.body;
    if(!refrshToken) {
        return res.sendStatus(401)
    }

    User.findById(userId).then(user => {
        
        console.log('compare: ', user.refreshToken !== refrshToken);
        if(user.refreshToken !== refrshToken) {
            console.log('is here?');
            return res.sendStatus(403);
        }

        let responseData;

         jwt.verify(refrshToken, 'refreshtokensecret', (err, user) => {
            if(err) {
                return res.sendStatus(403);
            }

            const token = jwt.sign({
                email: user.email,
                userId: user.userId
            },'somesupersecretstringformykey', 
                {expiresIn: '15s'}
            );

            const refreshToken = jwt.sign({
                email: user.email,
                userId: user.userId
            }, 'refreshtokensecret');


            responseData = {
                token: token,
                refreshToken: refreshToken,
                userId: user.userId
            }
            
            

        });
        user.refreshToken = responseData.refreshToken;
        user.save();
        return responseData;
    }).then(response => {
        res.json(response);
        console.log('response: ', response);
    }).catch(err => console.log(err));

    
}
