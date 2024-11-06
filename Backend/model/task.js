const mongoose = require('mongoose');

const taskschema =  new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
    },
    tasks:[{
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    dueDate: {
        type: Date,
        default: new Date,
    },
    completed: {
        type: Boolean, 
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}]
})



const Task = mongoose.model('Task', taskschema);

module.exports = Task;