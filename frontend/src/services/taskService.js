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
// edit Task
export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};
// tpggle task complate status
export const toggleTask = async (id) => {
  const response = await api.patch(`/tasks/${id}/toggle`);
  return response.data;
};
// delete Task
export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
