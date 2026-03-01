import api from "./api";

// Get all tasks
export const getAllTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};
// create Task
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const toggleTask = async (id) => {};

export const deleteTask = async (id) => {};
