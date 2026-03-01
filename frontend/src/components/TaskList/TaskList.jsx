import TaskFilter from "../TaskFilter/TaskFilter.jsx";
import Modal from "../Modals/Modal.jsx";
import TaskForm from "../TaskForm/TaskForm.jsx";
import TaskItem from "../TaskItem/TaskItem.jsx";
import { useTasks } from "../../hooks/useTasks";
import { useModal } from "../../hooks/useModal";
import { useInfiniteCarousel } from "../../hooks/useInfiniteCarousel";
import "./TaskList.css";

function TaskList() {
  const { tasks, isLoading, createTask, updateTask, deleteTask, toggleTask } =
    useTasks();

  const {
    isCreateOpen,
    isUpdateOpen,
    isDeleteOpen,
    isToggleOpen,
    selectedTask,
    formMode,
    newTask,
    setNewTask,
    setSelectedTask,
    openCreateModal,
    openUpdateModal,
    openEditForm,
    closeCreateModal,
    closeUpdateModal,
    openDeleteModal,
    closeDeleteModal,
    openToggleModal,
    closeToggleModal,
  } = useModal();

  const {
    carouselRef,
    repetitions,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  } = useInfiniteCarousel(tasks);

  const handleTaskClick = (task) => {
    openUpdateModal(task);
  };

  const handleSubmit = async () => {
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
  };

  const handleDelete = async () => {
    try {
      await deleteTask(selectedTask.id);
      closeDeleteModal();
      closeUpdateModal();
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleTask(selectedTask.id);
      closeToggleModal();
      closeUpdateModal();
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // Skeleton while loading
  if (isLoading) {
    return (
      <div className="task-list">
        <h2>Task List</h2>
        <div className="carousel">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="task-card skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <TaskFilter onAddTask={openCreateModal} />
        <div className="header">
          <h2>Task List</h2>
          <span className="badge">0 tasks</span>
        </div>
        <p className="empty-state">
          No tasks available. Click "Add Task" to create your first task!
        </p>

        <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
          <TaskForm
            task={newTask}
            setTask={setNewTask}
            mode={formMode}
            onSubmit={handleSubmit}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="task-list">
      <TaskFilter onAddTask={openCreateModal} />

      <div className="header">
        <h2>Task List</h2>
        <span className="badge">{tasks.length} tasks</span>
      </div>

      <div
        className="carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {Array(repetitions)
          .fill(tasks)
          .flat()
          .map((task, index) => (
            <div
              key={`${task.id}-${index}`}
              className="task-card"
              onClick={() => handleTaskClick(task)}
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="meta">
                <span className={`priority ${task.priority}`}>
                  {task.priority}
                </span>
                <span className={`status ${task.completed ? "done" : ""}`}>
                  {task.completed ? "✓" : "○"}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
        <TaskForm
          task={newTask}
          setTask={setNewTask}
          mode={formMode}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={closeUpdateModal}>
        <TaskItem
          task={selectedTask}
          onEdit={() => openEditForm(selectedTask)}
          onToggle={openToggleModal}
          onDelete={openDeleteModal}
        />
      </Modal>

      {/* Toggle Confirmation Modal */}
      <Modal isOpen={isToggleOpen} onClose={closeToggleModal}>
        <div>
          <h3>
            Are you sure you want to mark this task as{" "}
            {selectedTask?.completed ? "active" : "completed"}?
          </h3>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button onClick={closeToggleModal}>Cancel</button>
            <button onClick={handleToggle}>Confirm</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal}>
        <div>
          <h3>Are you sure you want to delete?</h3>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button onClick={closeDeleteModal}>Cancel</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;
