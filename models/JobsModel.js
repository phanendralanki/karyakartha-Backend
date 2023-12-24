const mongoose = require('mongoose');

const JobsModel = mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    rolesResponsibilities: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
    },
    jobType: {
      type: String,
    },
    companyImage: {
      type: String,
      default: "https://icon-library.com/icon/human-icon-png-11.html",
    },
  },
  { timeStamps: true }
);

const jobSchema = mongoose.model('job',JobsModel);
module.exports = jobSchema;