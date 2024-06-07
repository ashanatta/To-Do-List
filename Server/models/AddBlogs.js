const mongoose = require("mongoose");

const AddBlogsSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const AddBlogsModel = mongoose.model("AddBlogs", AddBlogsSchema);
module.exports = AddBlogsModel;
