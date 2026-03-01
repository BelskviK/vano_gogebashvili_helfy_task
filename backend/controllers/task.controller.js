import * as taskService from "../services/task.service.js";

export const getAll = (req, res) => {
  try {
    const tasks = taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const create = (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        message: "Title, description and priority are required",
      });
    }
    const newTask = taskService.createNewTask({
      title,
      description,
      priority,
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

export const update = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = taskService.updateTask(id, req.body);
    if (!updated) {
      return res.status(404).json({
        message: "Task not found or invalid priority",
      });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const remove = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = taskService.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const toggle = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = taskService.toggleTaskStatus(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
