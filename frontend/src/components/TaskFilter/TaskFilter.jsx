import "./TaskFilter.css";

function TaskFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortOrder,
  setSortOrder,
  onAddTask,
  onReset,
}) {
  return (
    <div className="toolbar">
      {/* TODO */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="toolbar-input"
      />
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

      {/* Sort order toggle button */}
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="toolbar-button sort-order"
        title={sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        Sort {sortOrder === "asc" ? "↑" : "↓"}
      </button>

      {/* Reset filters button */}
      <button
        onClick={onReset}
        className="toolbar-button reset-button"
        title="Reset all filters"
      >
        ⟲ Reset
      </button>

      {/* Add Task */}
      <button onClick={onAddTask} className="toolbar-button add-task">
        + Add Task
      </button>
    </div>
  );
}

export default TaskFilter;
