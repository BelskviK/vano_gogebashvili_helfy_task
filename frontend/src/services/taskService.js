import api from "./api";

// Get all tasks
export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (taskData) => {};

export const toggleTask = async (id) => {};

export const deleteTask = async (id) => {};
