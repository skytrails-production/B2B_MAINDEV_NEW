import React from "react";
// import HIW1img from "../../images/tailwind/HIW1.png";
// import HIW2img from "../../images/tailwind/HIW2.png";
// import HIW3img from "../../images/tailwind/HIW3.png";
import VectorImg from "../../images/tailwind/VectorHIW.svg";
import Heading from "./shared/Heading";

const DEMO_DATA = [
  {
    id: 1,
    // img: HIW1img,
    title: "Discover & Explore",
    desc: "Find hidden gems on every trip, and explore places you've never been before.",
  },
  {
    id: 2,
    // img: HIW2img,
    title: "Plan Effortlessly",
    desc: "Easily organize your itinerary with our smart planning tools, designed for convenience.",
  },
  {
    id: 3,
    // img: HIW3img,
    title: "Exclusive Discounts",
    desc: "Unlock great savings with special deals on accommodation, travel, and more.",
  },
];

const WhyChooseUsTailwind = ({ className = "", data = DEMO_DATA }) => {
  return (
    <div
      className={`nc-SectionHowItWork ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <Heading isCenter desc="Keep calm & travel on">
        How it works
      </Heading>
      <div className="mt-20 relative grid md:grid-cols-3 gap-20">
        <img
          className="hidden md:block absolute inset-x-0 top-10"
          src={VectorImg}
          alt=""
        />
        {data.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center max-w-xs mx-auto"
          >
            <img
              alt=""
              className="mb-8 max-w-[180px] mx-auto"
              // src={item.img}
            />
            <div className="text-center mt-auto">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUsTailwind;
