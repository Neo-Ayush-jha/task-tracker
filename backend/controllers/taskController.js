const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};