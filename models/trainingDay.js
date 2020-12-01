const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingDaySchema = new Schema({
        name: {
            type: String,
            required: true
        },
        trainings: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Trainings',
                required: false
            }
        ],
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        plan: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TrainingDay', trainingDaySchema);
