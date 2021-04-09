const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainingSchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        length: {
            type: Number,
            required: true
        },
        isFinished: {
            type: Boolean,
            required: true
        },
        planName: {
            type: String,
            required: true
        },
        dayName: {
            type: String,
            required: true
        },
        exercisesToDo: [
            {
                _id: {
                    type: String,
                    required: true
                },
                exerciseName: {
                    type: String,
                    required: true
                },
                series: [
                    {
                        reps: {
                            type: Number,
                            required: true
                        },
                        weight: {
                            type: Number,
                            required: true
                        },
                        pause: {
                            type: Number,
                            required: true
                        },
                        rate: {
                            type: Number,
                            required: true
                        },
                    }
                ]
            }
        ],
        finishedExercises: [
            {
                _id: {
                    type: String,
                    required: true
                },
                exerciseName: {
                    type: String,
                    required: true
                },
                series: [
                    {
                        reps: {
                            type: Number,
                            required: true
                        },
                        weight: {
                            type: Number,
                            required: true
                        },
                        pause: {
                            type: Number,
                            required: true
                        },
                        rate: {
                            type: Number,
                            required: true
                        },
                    }
                ]
            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model('Training', trainingSchema);