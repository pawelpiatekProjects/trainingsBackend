const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingPlanSchema = new Schema(
    {
        trainingPlanName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        image: {
            type: String,
            required: true
        },
        trainingDays: [
            {
                trainingDayName: {
                    type: String,
                    required: true
                },
                exercises: 
                [
                    {
                        exerciseName: {
                            type: String,
                            required: true
                        },
                        repsInSeries: {
                            type:  [Number],
                            required: true
                        },
                        weight: {
                            type: Number,
                            required: false
                        },
                        pause: {
                            type: Number,
                            required: false
                        },
                        rate: {
                            type: Number,
                            required: false
                        },
                        ytLink: {
                            type: String,
                            required: false
                        },
                        exerciseDescription: {
                            type: String,
                            required: false
                        }
                    }
                ]
            },
            
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model('TrainingPlan', trainingPlanSchema);