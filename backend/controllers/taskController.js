import Task from '../models/taskModel.js';

export const createTask=async(req, res)=>{
    try {
        const{title,description,priority,dueDate,completed} = req.body;
        const newTask = new Task({
            title,description,priority, dueDate,
            completed:completed==='Yes' || completed === true,
            owner:req.user.id
        })
        const task = await newTask.save();
        return res.status(201).json({success:true, task});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message:'internal server error'});
    }
}


//getting all task for loggedin user
export const getTask=async(req, res)=>{
    try {
        const task = await Task.find({owner:req.user.id}).sort({createdAt:-1})
        res.json({success:true, task})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message:'internal server error'});
    }
}


export const getTaskById = async(req, res)=>{
    try {
        const task = await Task.findOne({_id:req.params.id, owner:req.user.id});
        if(!task){
            return res.status(404).json({success:false, message:'no task found'});
        }
        res.json({success:true, task})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message:'internal server error'});
    }
}


export const updateTask = async(req, res)=>{
    try {
        const data = {...req.body}
        if(data.completed !== undefined){
            data.completed === 'Yes' || data.completed === true
        }
        const updated = await Task.findByIdAndUpdate({_id:req.params.id, owner:req.user.id}, data, {new:true})
        if(!updated){
            return res.status(404).json({success:false, message:'task  not found or not yours'});
        }
        res.json({success:true, task:updated})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message:'internal server error'});
    }
}

export const deleteTask = async(req, res)=>{
    try {
        const deleted = await Task.findByIdAndDelete({_id:req.params.id, owner:req.user.id});
        if(!deleted){
            return res.status(400).json({success:false, message:'task not found'});
        }
        res.json({success:true, message:'task deleted success'});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message:'internal server error'});
    }
}