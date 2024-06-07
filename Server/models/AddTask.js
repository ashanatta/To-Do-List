const mongoose = require("mongoose");

const AddTaskSchema = new mongoose.Schema({
  task: String,
  description: String,
  Dates: String,
});

const AddTaskModel = mongoose.model("AddTask", AddTaskSchema);
module.exports = AddTaskModel;
