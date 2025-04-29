import React, { useState } from "react";
import LazyLoad from "react-lazyload";

const CardOne1 = ({ item, icon, index }) => {
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };
  const generateRandomColor = () => {
    let color;
    let brightness; // Define brightness here
    do {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      brightness = (r * 299 + g * 587 + b * 114) / 1000;
      color = `rgb(${r}, ${g}, ${b})`;
    } while (brightness < 150);
    return color;
  };

  const backgroundColor = generateRandomColor();
  let rating = item?.rate;

  const LazyImage = ({ src, alt, title, backgroundColor }) => {
    return (
      <LazyLoad
        height={50}
        width={50}
        offset={100}
        placeholder={
          <div
            className="rounded-full object-cover w-[50px] h-[50px] flex items-center justify-center text-white font-semibold uppercase"
            style={{ backgroundColor: backgroundColor || "red" }}
          >
            <p>{title}</p>
          </div>
        }
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="rounded-full object-cover w-[50px] h-[50px]"
            onError={handleImageError}
          />
        ) : (
          <div
            className="rounded-full object-cover w-[50px] h-[50px] flex items-center justify-center text-white font-semibold uppercase"
            style={{ backgroundColor: backgroundColor || "red" }}
          >
            <p>{title}</p>
          </div>
        )}
      </LazyLoad>
    );
  };
  return (
    <div class="swiper-slide group bg-white border border-solid h-auto border-gray-300 rounded-2xl p-6 transition-all duration-500 w-full hover:border-indigo-600 slide-active:border-indigo-600 min-w-[300px]">
      <div class="flex items-center mb-2 gap-2 text-amber-500 transition-all duration-500  group-hover:text-indigo-600 swiper-slide-active:text-indigo-600 h-auto">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 transition-all duration-500 ${
              index < rating
                ? "text-yello-600 "
                : "group-hover:text-gray-300 text-gray-300"
            }`}
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.10326 1.31699C8.47008 0.57374 9.52992 0.57374 9.89674 1.31699L11.7063 4.98347C11.8519 5.27862 12.1335 5.48319 12.4592 5.53051L16.5054 6.11846C17.3256 6.23765 17.6531 7.24562 17.0596 7.82416L14.1318 10.6781C13.8961 10.9079 13.7885 11.2389 13.8442 11.5632L14.5353 15.5931C14.6754 16.41 13.818 17.033 13.0844 16.6473L9.46534 14.7446C9.17402 14.5915 8.82598 14.5915 8.53466 14.7446L4.91562 16.6473C4.18199 17.033 3.32456 16.41 3.46467 15.5931L4.15585 11.5632C4.21148 11.2389 4.10393 10.9079 3.86825 10.6781L0.940384 7.82416C0.346867 7.24562 0.674378 6.23765 1.4946 6.11846L5.54081 5.53051C5.86652 5.48319 6.14808 5.27862 6.29374 4.98347L8.10326 1.31699Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>
      <div className="h-[138px] overflow-scroll">
        <p class="text-base text-gray-500 leading-7 h-32 transition-all duration-500 mb-9 group-hover:text-gray-800  whitespace-break-spaces">
          {item?.comments}
        </p>
      </div>
      <div class="flex items-center gap-2  mt-3">
        {item?.userId?.profilePic && !hasError ? (
          <LazyImage
            src={item?.userId?.profilePic}
            alt=""
            title={item?.userName?.[0]}
            backgroundColor={backgroundColor}
          />
        ) : (
          <div
            className="rounded-full object-cover w-[50px] h-[50px] bg-red-400 flex items-center justify-center text-white font-semibold uppercase"
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            <p className=" font-semibold">{item?.userName?.[0]}</p>
          </div>
        )}

        <div class="grid gap-1 items-center">
          <h5 class="text-gray-800 text-base font-medium transition-all duration-500  group-hover:text-indigo-600 swiper-slide-active:text-indigo-600 m-0">
            {item?.userName}
          </h5>
          <span class="text-sm leading-6 text-gray-500 flex gap-1 items-center">
            {icon}
            {item.destination}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardOne1;
