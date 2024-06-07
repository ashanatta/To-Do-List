const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cors());

//for connection to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/student");

//import StudentModle from student file
const StudentModel = require("./models/student");
const AddTaskModel = require("./models/AddTask");
const AddBlogsModel = require("./models/AddBlogs");

// Middleware to check for authentication using JWT
//authenticateToken is Middlewarefuntion
//next parameter is for to pass the controlo of next middleware funtion
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/SignIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await StudentModel.findOne({
      email: email,
      password: password,
    }).exec();
    if (user) {
      const token = jwt.sign({ userId: user._id }, "your-secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/register", async (req, res) => {
  try {
    const student = await StudentModel.create(req.body);
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////////////////////////ToDoList Part ///////////////////////////////
// add new tsak

app.post("/CreateTask", async (req, res) => {
  const student = await AddTaskModel.create(req.body);
  res.json(student);
});

// fatching to page from DataBase

app.get("/Home", async (req, res) => {
  try {
    const tasks = await AddTaskModel.find().exec();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//delete task of todolist

app.delete("/DeleteTask", async (req, res) => {
  const { taskId } = req.body;
  await AddTaskModel.deleteOne({ _id: taskId });
  res.send({ status: "delete" });
});

////////////////////////Blog Part //////////////////////////////////

//Create New Blogs
app.post("/CreateBlogs", async (req, res) => {
  const student = await AddBlogsModel.create(req.body);
  res.json(student);
});

// fatching to page from DataBase

app.get("/Blog", async (req, res) => {
  try {
    const Blog = await AddBlogsModel.find().exec();
    res.json(Blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete blogs from database

app.delete("/DeleteBlog", async (req, res) => {
  const { blogId } = req.body;
  await AddBlogsModel.deleteOne({ _id: blogId });
  res.send({ status: "delete" });
});

// Edit Blog  From DataBase and page

// ////////////////Example of a protected route////////////////
app.get("/Home", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed" });
});

/////////////////////////Route Path for localhoast server///////////////////////////

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
