import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import CardOne from "./ReviewCard";
import Heading from "../shared/Heading";
import PrevBtn from "../shared/PrevBtn";
import NextBtn from "../shared/NextBtn";

const SkeletonLoader = () => {
  return (
    <div className="flex bg-gray-200 animate-pulse space-x-4 flex-shrink-0 relative w-full aspect-w-5 aspect-h-5 sm:aspect-h-6 h-64 rounded-2xl overflow-hidden group"></div>
  );
};

const ReviewSlider = ({
  heading = "Testimonials",
  subHeading = "What our happy user says!",
  className = "",
  itemPerRow = 3,
  sliderStyle = "style1",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  const [packageData, setPackageData] = useState([1, 2, 3, 4, 5]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://back.theskytrails.com/skyTrails/latestPackages`
      );
      const result = await response.json();
      //   setPackageData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 320) {
      setNumberOfItems(1);
    } else if (windowWidth < 500) {
      setNumberOfItems(itemPerRow - 3);
    } else if (windowWidth < 1024) {
      setNumberOfItems(itemPerRow - 2);
    } else if (windowWidth < 1280) {
      setNumberOfItems(itemPerRow - 1);
    } else {
      setNumberOfItems(itemPerRow);
    }
  }, [itemPerRow, windowWidth]);

  function changeItemId(newVal) {
    if (newVal > currentIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < packageData.length - 1) {
        changeItemId(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1);
      }
    },
    trackMouse: true,
  });

  if (!numberOfItems) return null;

  return (
    <div
      className={`nc-SectionSliderNewCategories custom-container mt-16 ${className}`}
    >
      <Heading desc={subHeading} isCenter={true}>
        {heading}
      </Heading>

      <MotionConfig
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="relative flow-root" {...handlers}>
          <div className="flow-root overflow-hidden rounded-xl">
            <motion.ul
              initial={false}
              className="relative whitespace-nowrap p-0 -mx-2 xl:-mx-4"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.li
                    className={`relative inline-block sm:px-2 md:px-2 lg:px-4 xl:px-4`}
                    custom={direction}
                    initial={{
                      x: `${(currentIndex - 1) * -100}%`,
                    }}
                    animate={{
                      x: `${currentIndex * -100}%`,
                    }}
                    key={index}
                    style={{
                      width: `calc(1/${numberOfItems} * 100%)`,
                    }}
                  >
                    <SkeletonLoader key={index} />
                  </motion.li>
                ))
              ) : (
                <AnimatePresence initial={false} custom={direction}>
                  {packageData?.map((item, indx) => (
                    <motion.li
                      className={`relative inline-block sm:px-2 md:px-2 lg:px-4 xl:px-4`}
                      custom={direction}
                      initial={{
                        x: `${(currentIndex - 1) * -100}%`,
                      }}
                      animate={{
                        x: `${currentIndex * -100}%`,
                      }}
                      key={indx}
                      style={{
                        width: `calc(1/${numberOfItems} * 100%)`,
                      }}
                    >
                      {/* <CardOne data={item} /> */}
                      <CardOne />
                    </motion.li>
                  ))}
                </AnimatePresence>
              )}
            </motion.ul>
          </div>

          {currentIndex ? (
            <PrevBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex - 1)}
              className="w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -left-3 xl:-left-6 top-1/3 -translate-y-1/2 z-[1]"
            />
          ) : null}

          {packageData.length > currentIndex + numberOfItems ? (
            <NextBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className="w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -right-3 xl:-right-6 top-1/3 -translate-y-1/2 z-[1]"
            />
          ) : null}
        </div>
      </MotionConfig>
    </div>
  );
};

export default ReviewSlider;
