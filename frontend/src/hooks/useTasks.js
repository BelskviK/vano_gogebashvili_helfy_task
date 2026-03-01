import { useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      setTasks((prev) => [...prev, createdTask]);
      return createdTask;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const result = await updateTask(taskId, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === result.id ? result : task)),
      );
      return result;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleTask(taskId);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      return updatedTask;
    } catch (error) {
      console.error("Failed to toggle task:", error);
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleTask: handleToggleTask,
  };
};
