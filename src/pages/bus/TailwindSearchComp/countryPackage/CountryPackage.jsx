
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import CardOne from "./CardTwo";
import Heading from "../shared/Heading";
import PrevBtn from "../shared/PrevBtn";
import NextBtn from "../shared/NextBtn";


const DEMO_CATS = [
    {
        id: "1",
        href: "/listing-stay-map",
        name: "U.S.A",
        country: "United States of America",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    },
    {
        id: "2",
        href: "/listing-stay-map",
        name: "Singapore",
        country: "Singapore",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        id: "3",
        href: "/listing-stay-map",
        name: "Paris",
        country: "France",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
        id: "4",
        href: "/listing-stay-map",
        name: "London",
        country: "Europe",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
    },
    {
        id: "5",
        href: "/listing-stay-map",
        name: "U.A.E",
        country: "UAE",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/3214995/pexels-photo-3214995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
        id: "6",
        href: "/listing-stay-map",
        name: "Mauritius",
        country: "Mauritius",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/3930724/pexels-photo-3930724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
        id: "7",
        href: "/listing-stay-map",
        name: "Italy",
        country: "Italy",
        count: 188288,
        thumbnail:
            "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
];


const CountryPackage = ({
    heading = "Suggestions for Countries",
    subHeading = "Popular countries to recommend for you",
    className = "",
    itemPerRow = 5,
    caterogy = DEMO_CATS,
    sliderStyle = "style1",
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


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
            if (currentIndex < caterogy.length - 1) {
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
        <div className={`nc-SectionSliderNewCategories ${className}`}>
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
                            <AnimatePresence initial={false} custom={direction}>
                                {caterogy?.map((item, indx) => (
                                    <motion.li
                                        className={`relative inline-block md:px-2 sm:px-2 lg:px-4 xl:px-4`}
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
                                        <CardOne data={item} />
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    </div>

                    {currentIndex ? (
                        <PrevBtn
                            style={{ transform: "translate3d(0, 0, 0)" }}
                            onClick={() => changeItemId(currentIndex - 1)}
                            className="w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -left-3 xl:-left-6 top-1/3 -translate-y-1/2 z-[1]"
                        />
                    ) : null}

                    {caterogy.length > currentIndex + numberOfItems ? (
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

export default CountryPackage;
