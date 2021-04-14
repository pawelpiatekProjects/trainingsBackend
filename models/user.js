const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    lastName: {
        type:String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default: 'I am new'
    },
    plans:[
        {
            type: Schema.Types.ObjectId,
            ref:'Plans'
        }
    ],
    trainings:[
        {
            type:Schema.Types.ObjectId,
            ref:'Trainings'
        }
    ],
    refreshToken: {
        type: String
    }
    
});

module.exports = mongoose.model('User',userSchema);
