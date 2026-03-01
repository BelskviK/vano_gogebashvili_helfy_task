import "./TaskItem.css";

function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className="task-item">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? "Completed" : "Active"}</p>

      <div className="actions">
        <button onClick={onToggle} className="toggle-btn">
          Toggle Status
        </button>

        <button onClick={onEdit} className="edit-btn">
          Edit
        </button>

        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
