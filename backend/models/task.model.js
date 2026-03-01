export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export function createTask({ id, title, description, priority }) {
  return {
    id,
    title,
    description,
    completed: false,
    createdAt: new Date(),
    priority,
  };
}
