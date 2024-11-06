const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const authenticationscehme = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true,
        minlength:3,
        maxlength:50,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        enum:['user', 'adminserver']
        
    },
    token:{
        type:String
    },
    avatar:{
        type:String,
        default: "uploads/download.png"
  
    },
    tasks: [
        {
            task_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'task',
                required: true
            },
            actions: {
                type: String,
                enum: ['addTask', 'updateTask', 'deleteTask', "completeTask" , "noncompleteTask" ],
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
            
        }
    ]
},
    {
        timestamps:true
    })



const Authentications = mongoose.model('Task-maneger-Authentications', authenticationscehme);

module.exports = Authentications;