import { useState, useMemo } from "react";

export const useTaskFilters = (tasks) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        const matchesSearch = task.title
          .toLowerCase()
          .includes(search.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "completed" && task.completed) ||
          (statusFilter === "active" && !task.completed);

        // Priority filter
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        // Always sort by priority
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        const comparison =
          priorityOrder[a.priority] - priorityOrder[b.priority];

        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [tasks, search, statusFilter, priorityFilter, sortOrder]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortOrder("asc");
  };

  return {
    // Filter state
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortOrder,
    setSortOrder,

    // Filtered results
    filteredAndSortedTasks,

    // Utilities
    resetFilters,
  };
};
