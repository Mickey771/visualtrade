import React, { useEffect, useState, useRef } from "react";

const originalReviews = [
  {
    image: "shane",
    name: "Shane Smith",
    username: "curtis",
    text:
      "Easy to use and perfect for beginners-learned quickly and gained confidence",
  },
  {
    image: "david",
    name: "David Woe",
    username: "curtis",
    text: "Fast execution and no lag - ideal for active trading",
  },
  {
    image: "alixha",
    name: "Alixha Hales",
    username: "curtis",
    text:
      "I am thoroughly impressed by the efficiency and ease of the withdrawal process, which was completed with exceptional promptness",
  },
  {
    image: "manp",
    name: "Ben Curtis",
    username: "curtis",
    text: "Transparent fees and steady returns, a very trustworthy platform",
  },
  {
    image: "mand",
    name: "Shane Cooper",
    username: "curtis",
    text: "Great customer support - quick, clear, and helpful every time",
  },
  {
    image: "manb",
    name: "Daniel Bones",
    username: "curtis",
    text: "Lots of tools and real-time data - helps me trade smarter",
  },
];

const DontTake = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Build a triple-sized array for infinite scroll effect
  const reviews = [...originalReviews, ...originalReviews, ...originalReviews];
  const startIndex = originalReviews.length; // Start in the middle set

  // Initialize item refs
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, reviews.length);
  }, [reviews.length]);

  // Center the active review
  const centerActiveReview = (index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const activeItem = itemsRef.current[startIndex + index];

    if (!activeItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    // Calculate the center points
    const containerCenter = containerRect.left + containerRect.width / 2;
    const itemCenter = itemRect.left + itemRect.width / 2;

    // Calculate the offset needed to center
    const offset = containerCenter - itemCenter;

    // Update translateX
    setTranslateX((prev) => prev + offset);
  };

  // Initialize positioning
  useEffect(() => {
    const timer = setTimeout(() => {
      centerActiveReview(currentIndex);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle transition end - for infinite scroll reset
  const handleTransitionEnd = () => {
    // If we're at the end of a set, jump to the equivalent position in the middle set
    if (currentIndex >= originalReviews.length) {
      // Disable transitions temporarily
      const carousel = document.querySelector(".carousel") as HTMLElement;
      if (carousel) {
        carousel.style.transition = "none";
      }

      // Reset to the equivalent position in the middle set
      setCurrentIndex(currentIndex % originalReviews.length);

      // Force browser reflow to make the transition removal take effect
      carousel?.offsetHeight;

      // Re-enable transitions
      setTimeout(() => {
        if (carousel) {
          carousel.style.transition =
            "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        }
      }, 10);
    }

    // If we're at the beginning, jump to the equivalent position in the middle set
    if (currentIndex < 0) {
      // Same process for backwards movement
      const carousel = document.querySelector(".carousel") as HTMLElement;
      if (carousel) {
        carousel.style.transition = "none";
      }

      setCurrentIndex(
        originalReviews.length + (currentIndex % originalReviews.length)
      );

      carousel?.offsetHeight;

      setTimeout(() => {
        if (carousel) {
          carousel.style.transition =
            "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        }
      }, 10);
    }
  };

  // Go to next or previous review
  const goToReview = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Update positioning when current index changes
  useEffect(() => {
    centerActiveReview(currentIndex);
  }, [currentIndex]);

  // Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      goToReview("next");
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-12 md:py-20 lg:py-32 bg-[hsl(222,65%,8%)]">
      <div className="w-full px-6 lg:px-0 max-w-[1300px] mx-auto flex flex-col items-center">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-white">
          Don't take our words
        </h2>
        <p className="font-normal mt-5 text-sm md:text-base text-[rgba(255,255,255,0.7)] text-center max-w-[800px]">
          From beginners to experts, True stories showing success in trading -
          listen to our successful traders
        </p>

        <div
          ref={containerRef}
          className="w-full mt-12 overflow-hidden py-10 relative"
        >
          <div
            className="carousel flex px-4 gap-5 md:gap-8 transition-transform duration-800 ease-in-out"
            style={{
              transform: `translateX(${translateX}px)`,
              transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {reviews.map((item, index) => {
              // Calculate if this item is active
              const isMiddleSet =
                index >= originalReviews.length &&
                index < originalReviews.length * 2;
              const indexInSet = index % originalReviews.length;
              const isActive =
                isMiddleSet &&
                indexInSet === currentIndex % originalReviews.length;

              return (
                <div
                  key={`${item.name}-${index}`}
                  ref={(el) => (itemsRef.current[index] = el) as any}
                  className={`min-w-[280px] md:min-w-[350px] lg:min-w-[400px] py-8 px-5 rounded-lg flex flex-col items-center transition-all duration-300 ${
                    isActive
                      ? "bg-[rgb(30,38,56)] scale-105 shadow-lg"
                      : "bg-[rgb(25,31,46)] opacity-70"
                  }`}
                >
                  <img
                    src={`/${item.image}.png`}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {item.name}
                  </h3>
                  <p className="mt-4 text-center text-white">{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Navigation controls */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-6 px-2 md:px-4">
            <button
              onClick={() => goToReview("prev")}
              className="bg-[rgba(0,0,0,0.5)] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.7)] transition-all z-10"
              aria-label="Previous review"
            >
              ←
            </button>
            <button
              onClick={() => goToReview("next")}
              className="bg-[rgba(0,0,0,0.5)] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.7)] transition-all z-10"
              aria-label="Next review"
            >
              →
            </button>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 gap-2">
            {originalReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex % originalReviews.length === index
                    ? "bg-white scale-125"
                    : "bg-gray-500"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DontTake;
