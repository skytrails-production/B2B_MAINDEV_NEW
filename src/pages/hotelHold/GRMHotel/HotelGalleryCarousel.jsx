import React, { useState } from "react";
import { motion } from "motion/react";
import { Image } from "lucide-react";
import { Carousel } from "flowbite-react";

const HotelGalleryCarousel = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <div className="grid grid-cols-2 max-h-[350px] md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 grid-rows-4 md:grid-rows-2 lg:grid-rows-2 xl:grid-rows-2 gap-4">
        <div
          className="relative col-span-2 row-span-2 cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={data?.[0]?.url}
            alt="cover"
            className="rounded-lg w-full  h-full object-cover"
          />
        </div>
        <div className="relative cursor-pointer group">
          <img
            src={data?.[1]?.url}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="relative cursor-pointer group">
          <img
            src={data?.[2]?.url}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div className="relative cursor-pointer group">
          <img
            src={data?.[3]?.url}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer group"
        >
          <Carousel
            indicators={false}
            leftControl=" "
            rightControl=" "
            pauseOnHover
          >
            {data?.map((item, index) => (
              <img
                src={item?.url}
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

            <button
              onClick={handleClose}
              className=" hidden md:flex text-gray-700 hover:text-gray-900"
            >
              <i className="fa-solid fa-arrow-left-long w-32"></i>
            </button>
          </div>

          <div className="grid px-4 pt-4 pb-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 overflow-hidden overflow-y-scroll">
            {data.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image?.url}
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

export default HotelGalleryCarousel;
