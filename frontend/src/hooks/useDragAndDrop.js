import { useState, useRef } from "react";

export const useDragAndDrop = (items, onReorder) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const dragStartIndexRef = useRef(null);
  const draggedItemIdRef = useRef(null);

  const handleDragStart = (e, index, item) => {
    console.log("🟢 DRAG START:", {
      index,
      itemId: item.id,
      itemTitle: item.title,
      totalItems: items.length,
    });

    setDraggedItem(item);
    dragStartIndexRef.current = index;
    draggedItemIdRef.current = item.id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);

    document.body.classList.add("dragging");
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    // Get the task at this position
    const taskCount = items.length;
    const normalizedIndex = index % taskCount;
    const taskAtPosition = items[normalizedIndex];

    // Don't allow dropping on the same task (even if different repetition)
    if (taskAtPosition?.id === draggedItemIdRef.current) {
      e.dataTransfer.dropEffect = "none";
      return;
    }

    e.dataTransfer.dropEffect = "move";

    // Only log if the drag-over index changes (avoid spam)
    if (dragOverItem !== index) {
      console.log("🔵 DRAG OVER:", {
        currentIndex: index,
        startIndex: dragStartIndexRef.current,
        isSameTask: taskAtPosition?.id === draggedItemIdRef.current,
      });
    }

    setDragOverItem(index);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    // Get the task at drop position
    const taskCount = items.length;
    const normalizedDropIndex = dropIndex % taskCount;
    const taskAtDropPosition = items[normalizedDropIndex];

    // Prevent dropping on the same task
    if (taskAtDropPosition?.id === draggedItemIdRef.current) {
      console.log(
        "❌ DROP CANCELLED - Cannot drop on same task (different repetition)",
      );

      // Reset drag state
      setDraggedItem(null);
      setDragOverItem(null);
      dragStartIndexRef.current = null;
      draggedItemIdRef.current = null;
      document.body.classList.remove("dragging");
      return;
    }

    console.log("🟡 DROP:", {
      dropIndex,
      startIndex: dragStartIndexRef.current,
      draggedItemId: draggedItemIdRef.current,
      willReorder:
        dragStartIndexRef.current !== null &&
        dragStartIndexRef.current !== dropIndex,
    });

    if (
      dragStartIndexRef.current !== null &&
      dragStartIndexRef.current !== dropIndex
    ) {
      console.log("✅ CALLING REORDER:", {
        from: dragStartIndexRef.current,
        to: dropIndex,
      });
      // Call onReorder with the indices
      onReorder(dragStartIndexRef.current, dropIndex);
    } else {
      console.log("❌ REORDER SKIPPED - same position or invalid start index");
    }

    // Reset drag state
    setDraggedItem(null);
    setDragOverItem(null);
    dragStartIndexRef.current = null;
    draggedItemIdRef.current = null;
    document.body.classList.remove("dragging");
  };

  const handleDragEnd = () => {
    console.log("🔴 DRAG END - cleaning up");

    setDraggedItem(null);
    setDragOverItem(null);
    dragStartIndexRef.current = null;
    draggedItemIdRef.current = null;
    document.body.classList.remove("dragging");
  };

  return {
    draggedItem,
    dragOverItem,
    dragStartIndexRef,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};
