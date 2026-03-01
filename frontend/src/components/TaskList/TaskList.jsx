import { useEffect, useState, useRef } from "react";
import TaskFilter from "../TaskFilter/TaskFilter.jsx";
import Modal from "../Modals/Modal.jsx";
import TaskForm from "../TaskForm/TaskForm.jsx";
import TaskItem from "../TaskItem/TaskItem.jsx";

import {
  getAllTasks,
  createTask,
  updateTask,
} from "../../services/taskService";
import "./TaskList.css";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);

  const isAdjustingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // ADD THIS LINE

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsUpdateOpen(true);
  };
  const getRepetitions = (taskCount) => {
    if (taskCount <= 0) return 0;
    if (taskCount >= 20) return 5;
    return Math.floor(100 / taskCount);
  };
  // this needs only for safe smooth scroll with  mouse drag on desktop mode.
  const repetitions = getRepetitions(tasks.length);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  const handleSubmit = async () => {
    try {
      if (formMode === "create") {
        const createdTask = await createTask(newTask);

        setTasks((prev) => [...prev, createdTask]);
      } else if (formMode === "update") {
        const updatedTask = await updateTask(newTask.id, newTask);

        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );
      }

      setNewTask({
        title: "",
        description: "",
        priority: "low",
      });

      setIsCreateOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await getAllTasks();
        console.log(`repetitions :${repetitions}`);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);
  const handleToggle = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };
  // infinite scrolling logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || tasks.length === 0) return;

    // Set initial position to middle
    const oneSetWidth = carousel.scrollWidth / 3;
    carousel.scrollLeft = oneSetWidth;

    const handleScroll = () => {
      if (isAdjustingRef.current) return;

      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const clientWidth = carousel.clientWidth;
      const oneSetWidth = scrollWidth / 3;

      // scroling to right
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        isAdjustingRef.current = true;
        carousel.scrollLeft = oneSetWidth + (scrollLeft - oneSetWidth * 2);
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, 50);
      }
      // scrolling to left
      else if (scrollLeft <= 10) {
        isAdjustingRef.current = true;
        carousel.scrollLeft = oneSetWidth + scrollLeft;
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, 50);
      }
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [tasks]);

  // drag to scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // skeleton while loading
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

  // empty state
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <h2>Task List</h2>
        <p className="empty-state">No tasks available</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <TaskFilter
        onAddTask={() => {
          setNewTask({
            title: "",
            description: "",
            priority: "",
          });
          setFormMode("create");
          setIsCreateOpen(true);
        }}
      />{" "}
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
              {" "}
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
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <TaskForm
          task={newTask}
          setTask={setNewTask}
          mode={formMode}
          onSubmit={handleSubmit}
        />
      </Modal>
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <TaskItem
          task={selectedTask}
          onEdit={() => {
            setIsUpdateOpen(false);
            setNewTask(selectedTask);
            setFormMode("update");
            setIsCreateOpen(true);
          }}
          onToggle={() => {
            setIsToggleOpen(true);
          }}
          onDelete={() => {
            setIsDeleteOpen(true);
          }}
        />
      </Modal>
      <Modal isOpen={isToggleOpen} onClose={() => setIsToggleOpen(false)}>
        <div>
          <h3>
            Are you sure you want to mark this task as{" "}
            {selectedTask?.completed ? "active" : "completed"}?
          </h3>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button onClick={() => setIsToggleOpen(false)}>Cancel</button>

            <button
              onClick={() => {
                console.log("Toggle:", selectedTask);
                handleToggle(selectedTask.id);
                setIsToggleOpen(false);
                setIsUpdateOpen(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div>
          <h3>Are you sure you want to delete?</h3>

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <button onClick={() => setIsDeleteOpen(false)}>Cancel</button>

            <button
              onClick={() => {
                console.log("Delete:", selectedTask);
                setIsDeleteOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TaskList;
