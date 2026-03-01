import tasks from "../data/tasks.data.js";
import { createTask, Priority } from "../models/task.model.js";

let idCounter = 1;
const allowedPriorities = Object.values(Priority);

export const getAllTasks = () => tasks;

export const getTaskById = (id) => {
  return "getTaskById";
};

export const createNewTask = ({ title, description, priority }) => {
  if (!allowedPriorities.includes(priority)) {
    const error = new Error("Invalid priority");
    error.status = 400;
    throw error;
  }

  const newTask = createTask({
    id: idCounter++,
    title,
    description,
    priority,
  });

  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id, data) => {
  return "updateTask";
};

export const deleteTask = (id) => {
  return "deleteTask";
};

export const toggleTaskStatus = (id) => {
  return "toggleTaskStatus";
};
