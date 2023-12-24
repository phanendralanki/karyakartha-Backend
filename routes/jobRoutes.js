const express = require("express");
const router = express.Router();

const {
  addJob,
  viewAllJobs,
  viewJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobsControllers");

router
  .post("/", addJob)
  .get("/", viewAllJobs)
  .get("/:id", viewJobById)
  .put("/:id", updateJob)
  .delete("/:id", deleteJob);

module.exports = router;
