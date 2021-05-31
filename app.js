const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config(); // allows to use dotenv

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const plansRouter = require('./routes/plans');
const authRouter = require('./routes/auth');
const trainingsRouter = require('./routes/trainings');
const statisticsRouter = require('./routes/statistics');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors())

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trainings', trainingsRouter);
app.use('/plans',plansRouter);
app.use('/auth', authRouter);
app.use('/statistics', statisticsRouter);


app.use((error,req,res,next)=>{
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({message:message, data:data});
})


mongoose
    // .connect(
    //   process.env.MONGO_KEY
    // )
    .connect(
        'mongodb+srv://admin:17071998@cluster0.dvzkc.mongodb.net/trainings?retryWrites=true&w=majority'
    )
    .then(result => {
      app.listen(8080);
    })
    .catch(err => console.log(err));


