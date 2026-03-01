import { useRef, useState, useEffect } from "react";

export const useInfiniteCarousel = (tasks) => {
  const carouselRef = useRef(null);
  const isAdjustingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const getRepetitions = (taskCount) => {
    if (taskCount <= 0) return 0;
    if (taskCount >= 20) return 5;
    return Math.floor(100 / taskCount);
  };

  const repetitions = getRepetitions(tasks.length);

  // Infinite scrolling logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || tasks.length === 0) return;

    const oneSetWidth = carousel.scrollWidth / 3;
    carousel.scrollLeft = oneSetWidth;

    const handleScroll = () => {
      if (isAdjustingRef.current) return;

      const scrollLeft = carousel.scrollLeft;
      const scrollWidth = carousel.scrollWidth;
      const clientWidth = carousel.clientWidth;
      const oneSetWidth = scrollWidth / 3;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        isAdjustingRef.current = true;
        carousel.scrollLeft = oneSetWidth + (scrollLeft - oneSetWidth * 2);
        setTimeout(() => {
          isAdjustingRef.current = false;
        }, 50);
      } else if (scrollLeft <= 10) {
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

  // Drag to scroll handlers
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

  return {
    carouselRef,
    repetitions,
    isDragging,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
  };
};
