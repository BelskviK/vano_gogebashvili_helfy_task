import "./TaskFilter.css";

function TaskFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onAddTask,
}) {
  return (
    <div className="toolbar">
      {/* TODO */}
      {/* searc */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="toolbar-input"
      />
      {/* TODO */}
      {/* status changer  */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="toolbar-select"
      >
        <option value="all">All Status</option>
        <option value="completed">Completed</option>
        <option value="active">Active</option>
      </select>

      {/* TODO */}
      {/* prioritu changer */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="toolbar-select"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Add Task */}
      <button onClick={onAddTask} className="toolbar-button">
        + Add Task
      </button>
    </div>
  );
}

export default TaskFilter;
