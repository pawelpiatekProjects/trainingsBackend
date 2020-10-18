const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        days: {
            type: Number,
            required: true
        },
        priority: {
            type: String,
            required: false
        },
        image: {
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
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Plan', planSchema);
