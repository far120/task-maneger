const express = require('express')
const Task = require('../model/task')
const Joi = require('joi')
const User = require('../model/authentication')

const routes = express.Router();

routes.post('/:userid', async (req, res) => {
    const userId = req.params.userid
    const schema = Joi.object({
        title : Joi.string().required().min(3).max(50).trim(),
        description : Joi.string().required().min(3).max(255).trim(),
        dueDate : Joi.date(),
        completed : Joi.boolean(),
        user_id : userId  
    })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')

        let task = await Task.findOne({ user_id: userId });
        if (!task) {
            task = new Task({ user_id: userId, tasks: [] });
        }
        task.tasks.push({ title: req.body.title, description: req.body.description, dueDate: req.body.dueDate , completed: req.body.completed});
        let a = task.tasks.length -1 ;
        task.save()
        user.tasks.push({
            task_id: task.tasks[a]._id,
            actions:"addTask",
            })
            await user.save();    
        res.send(task)

    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }  
})

routes.get('/:userid', async (req, res) => {
    const userId = req.params.userid
    try {
        const task = await Task.findOne({user_id : userId})
        if (!task) return res.status(404).send('Task not found')
            res.send(task)
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

routes.get('/:userid/:taskId', async (req, res) => {
    const userId = req.params.userid
    const taskId = req.params.taskId
    try {
        const task = await Task.findOne({user_id : userId, 'tasks._id': taskId})
        if (!task) return res.status(404).send('Task not found')
        const index = task.tasks.findIndex(t => t._id.toString() === taskId)
        res.send(task.tasks[index])
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


routes.put('/:userId/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;

    console.log(1)
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        dueDate: Joi.date(),
        completed: Joi.boolean()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found'); 

        const task = await Task.findOne({ user_id: userId, 'tasks._id': taskId });
        if (!task) return res.status(404).send('Task not found');

        console.log(2)

        const ToUpdate = task.tasks.find(item => item._id.toString() === taskId);
        if (!ToUpdate) {
            return res.status(401).json({ message: 'You are not authorized to update this task' });
        }

       
        ToUpdate.title = req.body.title || ToUpdate.title;
        ToUpdate.description = req.body.description || ToUpdate.description;
        ToUpdate.dueDate = req.body.dueDate || ToUpdate.dueDate;
        ToUpdate.completed = req.body.completed !== undefined ? req.body.completed : ToUpdate.completed;

        const index = task.tasks.findIndex(t => t._id.toString() === taskId);
        if (index === -1) return res.status(404).send('Task not found');

        console.log(4)
        await task.save();

        const action = ToUpdate.completed ? "completeTask" : "updateTask";
        user.tasks.push({
            task_id: taskId,
            actions: action,
        });
        await user.save();

        res.send(ToUpdate);
    } catch (err) {
        console.log(7)
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



routes.delete('/:userid/:taskId', async (req, res) => {
    const userId = req.params.userid
    const taskId = req.params.taskId
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).send('User not found')

        const task = await Task.findOne({user_id : userId})
        if (!task) return res.status(404).send('Task not found')
        const index = task.tasks.findIndex(t => t._id.toString() === taskId)
       
        task.tasks = task.tasks.filter(item => item._id.toString() !== taskId);
       task.save()
       user.tasks.push({
        task_id: taskId,
        actions:"deleteTask",
        })
        await user.save();
        res.send("Task deleted successfully")
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = routes;

 