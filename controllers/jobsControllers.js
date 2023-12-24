const asyncHandler = require("express-async-handler");
const JobsModel = require("../models/JobsModel");

const addJob = asyncHandler(async (req, res) => {
  try {
    const newJob = await JobsModel.create(req.body);
    res.json(newJob);
  } catch (error) {
    throw new Error(error);
  }
});

//Read jobs
const viewAllJobs = asyncHandler(async (req, res) => {
  try{
      const viewAllJobs = await JobsModel.find();
      res.json(viewAllJobs);
  }catch(error){
    throw new Error(error);
  }
});

//Read job by Id
const viewJobById = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try{
    const findJob = await JobsModel.findById(id);
    res.json(findJob);
  } catch(error){
    throw new Error(error);
  }
});

//update job

  const updateJob = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try{
      const updateJob = await JobsModel.findByIdAndUpdate(id,
        req.body,{new:true}
        );
        res.json(updateJob);
    }catch(error){
      throw new Error(error);
    }
  })

//Delete Job
const deleteJob = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try{
    const deleteJob = await JobsModel.findByIdAndDelete(id);
    res.json({message:"Job Deleted Successfully"});
  }catch(error){
    throw new Error(error);
  }
});

module.exports = { addJob, viewAllJobs, viewJobById, updateJob, deleteJob };
