const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://admin:admin@cluster0.dvzkc.mongodb.net/training-plan-db?retryWrites=true&w=majority')
        .then(result => {
            console.log('connected');
            callback(result);
        })
        .catch(err => {
            console.log((err))
        })
}

module.exports.mongoConnect;

