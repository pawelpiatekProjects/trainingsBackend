const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
        exerciseNumber: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        series: {
            type: String,
            required: true
        },
        reps: {
            type: String,
            required: true
        },
        rate: {
            type: Number,
            required: false
        },
        ytLink: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
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

module.exports = mongoose.model('Exercise', exerciseSchema);
