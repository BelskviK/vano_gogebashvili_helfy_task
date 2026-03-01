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
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;

  if (data.priority && !allowedPriorities.includes(data.priority)) {
    return null;
  }

  task.title = data.title ?? task.title;
  task.description = data.description ?? task.description;
  task.priority = data.priority ?? task.priority;

  return task;
};

export const deleteTask = (id) => {
  return "deleteTask";
};

export const toggleTaskStatus = (id) => {
  return "toggleTaskStatus";
};
