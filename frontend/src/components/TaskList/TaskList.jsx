import TaskFilter from "../TaskFilter/TaskFilter.jsx";
import Modal from "../Modals/Modal.jsx";
import TaskForm from "../TaskForm/TaskForm.jsx";
import TaskItem from "../TaskItem/TaskItem.jsx";
import { useTasks } from "../../hooks/useTasks";
import { useModal } from "../../hooks/useModal";
import { useInfiniteCarousel } from "../../hooks/useInfiniteCarousel";
import { useTaskFilters } from "../../hooks/useTaskFilters";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useTaskReorder } from "../../hooks/useTaskReorder";
import { useTaskHandlers } from "../../hooks/useTaskHandlers";
import "./TaskList.css";

function TaskList() {
  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    reorderTasks,
  } = useTasks();

  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortOrder,
    setSortOrder,
    filteredAndSortedTasks,
    resetFilters,
  } = useTaskFilters(tasks);

  const {
    isCreateOpen,
    isUpdateOpen,
    isDeleteOpen,
    isToggleOpen,
    isAnyModalOpen,
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

  // Handle reordering with filtered tasks
  const handleReorderWithFilters = useTaskReorder(
    filteredAndSortedTasks,
    tasks,
    reorderTasks,
  );

  // Task operation handlers
  const { handleSubmit, handleDelete, handleToggle } = useTaskHandlers(
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
  );

  const {
    carouselRef,
    repetitions,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useInfiniteCarousel(filteredAndSortedTasks, isAnyModalOpen);

  const {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragAndDrop(filteredAndSortedTasks, handleReorderWithFilters);

  const handleTaskClick = (task) => {
    if (!draggedItem) {
      openUpdateModal(task);
    }
  };

  // Prevent carousel drag when interacting with drag handle
  const handleDragHandleMouseDown = (e) => {
    console.log("🖐️ DRAG HANDLE MOUSE DOWN - preventing carousel drag");
    e.stopPropagation();
  };

  // Wrapper functions to pass selectedTask
  const onDelete = () => handleDelete(selectedTask);
  const onToggle = () => handleToggle(selectedTask);
  const onSubmit = () => handleSubmit(formMode, newTask);

  // Skeleton while loading
  // Skeleton while loading
  if (isLoading) {
    return (
      <div className="task-list">
        <TaskFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onAddTask={openCreateModal}
          onReset={resetFilters}
        />
        <div className="header">
          <h2>Task List</h2>
          <span className="badge">0 tasks</span>
        </div>
        <div className="carousel">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="task-card skeleton">
              <div className="skeleton-title"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text" style={{ width: "60%" }}></div>
              <div className="meta skeleton-meta">
                <span className="skeleton-priority"></span>
                <span className="skeleton-status"></span>
              </div>
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
        <TaskFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onAddTask={openCreateModal}
          onReset={resetFilters}
        />
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
            onSubmit={onSubmit}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className="task-list">
      <TaskFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onAddTask={openCreateModal}
        onReset={resetFilters}
      />

      <div className="header">
        <h2>Task List</h2>
        <span className="badge">{filteredAndSortedTasks.length} tasks</span>
      </div>

      <div
        className="carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
      >
        {Array(repetitions)
          .fill(filteredAndSortedTasks)
          .flat()
          .map((task, index) => {
            const isDragging = draggedItem?.id === task.id;
            const isDragOver = dragOverItem === index;

            return (
              <div
                key={`${task.id}-${index}`}
                className={`task-card ${isDragging ? "dragging" : ""} ${
                  isDragOver ? "drag-over" : ""
                }`}
                onClick={() => handleTaskClick(task)}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleDragOver(e, index);
                }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDrop(e, index);
                }}
              >
                {/* Drag handle for reordering - isolated from carousel drag */}
                <div
                  className="drag-handle"
                  draggable={true}
                  onDragStart={(e) => {
                    console.log("🎯 DRAG HANDLE START at index:", index);
                    e.stopPropagation();
                    handleDragStart(e, index, task);
                  }}
                  onDragEnd={handleDragEnd}
                  onMouseDown={handleDragHandleMouseDown}
                  title="Drag to reorder"
                >
                  ⋮⋮
                </div>

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
            );
          })}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={closeCreateModal}>
        <TaskForm
          task={newTask}
          setTask={setNewTask}
          mode={formMode}
          onSubmit={onSubmit}
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
            <button onClick={onToggle}>Confirm</button>
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
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;
