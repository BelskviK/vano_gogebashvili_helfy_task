import { useRef, useState, useEffect, useCallback } from "react";

export const useInfiniteCarousel = (tasks, isModalOpen = false) => {
  const carouselRef = useRef(null);
  const isAdjustingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const animationRef = useRef(null);
  const lastScrollLeftRef = useRef(0);

  const getRepetitions = (taskCount) => {
    if (taskCount <= 0) return 0;
    if (taskCount >= 20) return 5;
    return Math.floor(100 / taskCount);
  };

  const repetitions = getRepetitions(tasks.length);

  // Function to reset position if at boundaries
  const checkAndResetPosition = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel || tasks.length === 0 || isAdjustingRef.current) return;

    const scrollLeft = carousel.scrollLeft;
    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    const oneSetWidth = scrollWidth / 3;

    // Check if we're at the right boundary
    if (scrollLeft + clientWidth >= scrollWidth - 10) {
      isAdjustingRef.current = true;
      carousel.scrollLeft = oneSetWidth + (scrollLeft - oneSetWidth * 2);
      setTimeout(() => {
        isAdjustingRef.current = false;
      }, 50);
    }
    // Check if we're at the left boundary
    else if (scrollLeft <= 10) {
      isAdjustingRef.current = true;
      carousel.scrollLeft = oneSetWidth + scrollLeft;
      setTimeout(() => {
        isAdjustingRef.current = false;
      }, 50);
    }
  }, [tasks.length]);

  // Auto-scroll function
  const startAutoScroll = useCallback(() => {
    if (animationRef.current) return;

    const scroll = () => {
      if (
        !carouselRef.current ||
        isDragging ||
        isHovering ||
        isModalOpen || // NEW: Stop scrolling when modal is open
        tasks.length === 0
      ) {
        animationRef.current = requestAnimationFrame(scroll);
        return;
      }

      carouselRef.current.scrollLeft += 0.5;

      // Check and reset position if needed
      checkAndResetPosition();

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
  }, [
    isDragging,
    isHovering,
    isModalOpen,
    tasks.length,
    checkAndResetPosition,
  ]);

  const stopAutoScroll = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Start/stop auto-scroll based on hover/drag/modal state
  useEffect(() => {
    if (tasks.length > 0 && !isDragging && !isHovering && !isModalOpen) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [
    isDragging,
    isHovering,
    isModalOpen,
    tasks.length,
    startAutoScroll,
    stopAutoScroll,
  ]);

  // Initialize carousel position
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || tasks.length === 0) return;

    // Set initial position to middle
    const oneSetWidth = carousel.scrollWidth / 3;
    carousel.scrollLeft = oneSetWidth;
    lastScrollLeftRef.current = oneSetWidth;

    // Add scroll event listener for manual scrolling
    const handleScroll = () => {
      if (isAdjustingRef.current) return;

      // Only check and reset on manual scroll, not during auto-scroll
      if (!animationRef.current) {
        checkAndResetPosition();
      }
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [tasks, checkAndResetPosition]);

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    stopAutoScroll();
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
    const newScrollLeft = scrollLeftRef.current - walk;

    carouselRef.current.scrollLeft = newScrollLeft;

    // Check and reset position while dragging
    checkAndResetPosition();
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Auto-scroll will restart via useEffect
  };

  return {
    carouselRef,
    repetitions,
    isDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};
