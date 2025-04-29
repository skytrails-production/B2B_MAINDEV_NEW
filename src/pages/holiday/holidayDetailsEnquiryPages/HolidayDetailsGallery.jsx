import { Image } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Carousel } from "flowbite-react";

const HolidayDetailsGallery = ({ data, isOpen, setIsOpen }) => {
  const [activeTab, setActiveTab] = useState("activities");

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleClose = () => setIsOpen(false);

  // Flatten stays images only if the active tab is 'stays'
  const getActiveTabImages = () => {
    if (activeTab === "stays") {
      return data?.images?.stays?.flatMap((stay) => stay.Images) || [];
    }
    if (activeTab === "activities") {
      return data?.images?.activities?.flatMap((stay) => stay.Images) || [];
    }
    return data?.images?.[activeTab] || [];
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 grid-rows-4 md:grid-rows-2 lg:grid-rows-2 xl:grid-rows-2 gap-4">
        <div
          className="relative col-span-2 row-span-2 cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={data?.coverImage}
            alt="cover"
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <Carousel
            indicators={false}
            leftControl=" "
            rightControl=" "
            pauseOnHover
          >
            {data?.images?.destinations
              ?.slice()
              .reverse()
              .map((item, index) => (
                <img
                  src={item}
                  alt={index}
                  key={index}
                  className="rounded-lg w-full h-full object-cover"
                />
              ))}
          </Carousel>
          <span className="absolute bottom-0 left-0 w-full rounded-lg bg-gradient-to-t from-black to-transparent text-white font-semibold pt-4 p-2 text-sm">
            Destination
          </span>
        </div>
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <Carousel
            indicators={false}
            leftControl=" "
            rightControl=" "
            pauseOnHover
          >
            {data?.images?.stays
              ?.flatMap((stay) => stay.Images)
              ?.map((item, index) => (
                <img
                  src={item}
                  alt={`Stay ${index}`}
                  key={index}
                  className="rounded-lg w-full h-full object-cover"
                />
              ))}
          </Carousel>
          <span className="absolute bottom-0 left-0 w-full rounded-lg bg-gradient-to-t from-black to-transparent text-white font-semibold pt-4 p-2 text-sm">
            Stays
          </span>
        </div>
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <Carousel
            indicators={false}
            leftControl=" "
            rightControl=" "
            pauseOnHover
          >
            {data?.images?.activities
              ?.flatMap((activity) => activity.Images)
              .map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Activity Image ${idx + 1}`}
                  className="rounded-lg w-full h-full object-cover"
                />
              ))}
          </Carousel>
          <span className="absolute bottom-0 left-0 w-full rounded-lg bg-gradient-to-t from-black to-transparent text-white font-semibold pt-4 p-2 text-sm">
            Activity & Sightseeing
          </span>
        </div>
        <div
          className="relative cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <Carousel
            indicators={false}
            leftControl=" "
            rightControl=" "
            pauseOnHover
          >
            {data?.images?.destinations?.map((item, index) => (
              <img
                src={item}
                alt={index}
                key={index}
                className="rounded-lg w-full h-full object-cover"
              />
            ))}
          </Carousel>
          <span className="flex items-center gap-2 absolute bottom-4 right-4 rounded-lg bg-white text-gray-800 font-semibold p-2 text-sm">
            <Image size={16} /> View all images
          </span>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={`fixed inset-0 bg-white z-50  overflow-auto transition-transform duration-500 ease-in-out transform ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="sticky p-4 bg-white z-10 top-0 flex flex-row-reverse items-center justify-between ">
            <button
              onClick={handleClose}
              className=" text-gray-700 hover:text-gray-900"
            >
              &#10005;
            </button>

            <div className="flex justify-center">
              {Object.keys(data.images).map((tab) => {
                const imageCount = (() => {
                  if (tab === "destinations") {
                    return data.images[tab].length;
                  } else if (tab === "stays") {
                    return data.images[tab].reduce(
                      (total, stay) => total + (stay.Images?.length || 0),
                      0
                    );
                  } else if (tab === "activities") {
                    return data.images[tab].reduce(
                      (total, activity) =>
                        total + (activity.Images?.length || 0),
                      0
                    );
                  }
                  return 0;
                })();

                return (
                  <button
                    key={tab}
                    className={`px-2 py-2 mr-2 border-b-2 ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab} ({imageCount})
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleClose}
              className=" hidden md:flex text-gray-700 hover:text-gray-900"
            >
              <i className="fa-solid fa-arrow-left-long w-32"></i>
            </button>
          </div>

          <div className="grid px-4 pt-4 pb-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 overflow-hidden overflow-y-scroll">
            {getActiveTabImages().map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Image ${index}`}
                  className=" w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HolidayDetailsGallery;
