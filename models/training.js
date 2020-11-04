const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const trainingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Exercises',
            required: false
        }
    ],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Training', trainingSchema);
