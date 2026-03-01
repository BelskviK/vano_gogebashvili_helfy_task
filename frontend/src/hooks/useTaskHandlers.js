import { useCallback } from "react";

export const useTaskHandlers = (
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  setNewTask,
  closeCreateModal,
  closeUpdateModal,
  closeDeleteModal,
  closeToggleModal,
  setSelectedTask,
) => {
  const handleSubmit = useCallback(
    async (formMode, newTask) => {
      try {
        if (formMode === "create") {
          await createTask(newTask);
        } else if (formMode === "update") {
          await updateTask(newTask.id, newTask);
        }

        setNewTask({ title: "", description: "", priority: "low" });
        closeCreateModal();
        setSelectedTask(null);
      } catch (error) {
        console.error("Failed to submit task:", error);
      }
    },
    [createTask, updateTask, setNewTask, closeCreateModal, setSelectedTask],
  );

  const handleDelete = useCallback(
    async (selectedTask) => {
      try {
        await deleteTask(selectedTask.id);
        closeDeleteModal();
        closeUpdateModal();
        setSelectedTask(null);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [deleteTask, closeDeleteModal, closeUpdateModal, setSelectedTask],
  );

  const handleToggle = useCallback(
    async (selectedTask) => {
      try {
        await toggleTask(selectedTask.id);
        closeToggleModal();
        closeUpdateModal();
        setSelectedTask(null);
      } catch (error) {
        console.error("Failed to toggle task:", error);
      }
    },
    [toggleTask, closeToggleModal, closeUpdateModal, setSelectedTask],
  );

  return {
    handleSubmit,
    handleDelete,
    handleToggle,
  };
};
