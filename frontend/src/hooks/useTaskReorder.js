import { useCallback } from "react";

export const useTaskReorder = (filteredTasks, allTasks, onReorder) => {
  const handleReorderWithFilters = useCallback(
    (sourceCarouselIndex, destinationCarouselIndex) => {
      //   console.log("🔄 HANDLE REORDER WITH FILTERS:", {
      //     sourceCarouselIndex,
      //     destinationCarouselIndex,
      //     taskCount: filteredTasks.length,
      //     totalTasks: allTasks.length,
      //   });

      const taskCount = filteredTasks.length;
      if (taskCount === 0) {
        console.log("❌ No tasks to reorder");
        return;
      }

      // Convert carousel indices to actual array indices (modulo the task count)
      const sourceFilteredIndex = sourceCarouselIndex % taskCount;
      const destFilteredIndex = destinationCarouselIndex % taskCount;

      //   console.log("📐 MODULO CALCULATION:", {
      //     sourceFilteredIndex,
      //     destFilteredIndex,
      //     calculation: `${sourceCarouselIndex} % ${taskCount} = ${sourceFilteredIndex}, ${destinationCarouselIndex} % ${taskCount} = ${destFilteredIndex}`,
      //   });

      // Get the actual task IDs from the filtered list
      const sourceTaskId = filteredTasks[sourceFilteredIndex]?.id;
      const destTaskId = filteredTasks[destFilteredIndex]?.id;

      //   console.log("🔍 TASK IDS:", {
      //     sourceTaskId,
      //     destTaskId,
      //     sourceTask: filteredTasks[sourceFilteredIndex],
      //     destTask: filteredTasks[destFilteredIndex],
      //   });

      if (!sourceTaskId || !destTaskId) {
        console.log("❌ Missing task IDs");
        return;
      }

      // Find the indices in the original tasks array
      const sourceOriginalIndex = allTasks.findIndex(
        (t) => t.id === sourceTaskId,
      );
      const destOriginalIndex = allTasks.findIndex((t) => t.id === destTaskId);

      console.log("🎯 ORIGINAL INDICES:", {
        sourceOriginalIndex,
        destOriginalIndex,
        tasksArrayLength: allTasks.length,
      });

      if (sourceOriginalIndex === -1 || destOriginalIndex === -1) {
        console.log("❌ Could not find tasks in original array");
        return;
      }

      //   console.log("✅ CALLING REORDER TASKS:", {
      //     from: sourceOriginalIndex,
      //     to: destOriginalIndex,
      //   });

      // Call the original reorder function with the correct indices
      onReorder(sourceOriginalIndex, destOriginalIndex);
    },
    [filteredTasks, allTasks, onReorder],
  );

  return handleReorderWithFilters;
};
