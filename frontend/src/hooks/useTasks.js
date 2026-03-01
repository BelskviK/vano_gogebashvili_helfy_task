import { useState, useEffect, useCallback } from "react";
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

  // for memoize the fetch function not to be recalled
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (newTask) => {
    try {
      const createdTask = await createTask(newTask);
      await fetchTasks();
      return createdTask;
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      const result = await updateTask(taskId, updatedTask);
      await fetchTasks();
      return result;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      throw error;
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleTask(taskId);
      await fetchTasks();
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
    refetchTasks: fetchTasks,
  };
};
