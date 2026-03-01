import { useState } from "react";

export const useModal = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  const isAnyModalOpen =
    isCreateOpen || isUpdateOpen || isDeleteOpen || isToggleOpen;

  const openCreateModal = () => {
    setNewTask({ title: "", description: "", priority: "low" });
    setFormMode("create");
    setIsCreateOpen(true);
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setIsUpdateOpen(true);
  };

  const openEditForm = (task) => {
    setNewTask(task);
    setFormMode("update");
    setIsCreateOpen(true);
    setIsUpdateOpen(false); // Close the update modal
    setSelectedTask(null); // Optionally clear selected task
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setNewTask({ title: "", description: "", priority: "low" });
  };

  const closeUpdateModal = () => {
    setIsUpdateOpen(false);
    setSelectedTask(null);
  };

  const openDeleteModal = () => setIsDeleteOpen(true);
  const closeDeleteModal = () => setIsDeleteOpen(false);

  const openToggleModal = () => setIsToggleOpen(true);
  const closeToggleModal = () => setIsToggleOpen(false);

  return {
    // State
    isCreateOpen,
    isUpdateOpen,
    isDeleteOpen,
    isToggleOpen,
    isAnyModalOpen, // NEW: Add this
    selectedTask,
    formMode,
    newTask,

    // Setters
    setNewTask,
    setSelectedTask,

    // Actions
    openCreateModal,
    openUpdateModal,
    openEditForm,
    closeCreateModal,
    closeUpdateModal,
    openDeleteModal,
    closeDeleteModal,
    openToggleModal,
    closeToggleModal,
  };
};
