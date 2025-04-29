import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CardOne = ({ className = "", data }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (destination) {
      const id = destination?._id;
      navigate(`/holidaypackages/packagedetails/${id}`);
    }
  }, [destination]);

  const searchOneHoliday = (item) => {
    // console.log(item, "item")
    const id = item?._id;
    setDestination(item);
    const payloadDestination = {
      destination: destination?.country,
      days: 0,
    };
    sessionStorage.setItem(
      "searchPackageData",
      JSON.stringify(payloadDestination)
    );
  };

  return (
    <div
      onClick={(e) => searchOneHoliday(data)}
      className={`nc-CardCategory3 flex flex-col ${className}`}
    >
      <div
        className={`flex-shrink-0 relative w-full aspect-w-5 aspect-h-5 sm:aspect-h-6 h-64 rounded-2xl overflow-hidden group`}
      >
        <img
          src={data?.pakage_img || data?.package_img?.[0]}
          className="object-cover w-full h-full rounded-2xl"
          alt="places"
        />
        <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black bg-opacity-10 transition-opacity"></span>
      </div>
      <div className="mt-4 truncate">
        <h2
          className={`text-sm sm:text-sm text-neutral-900  font-medium truncate`}
        >
          {data?.pakage_title}
        </h2>
        <span
          className={`flex justify-between mt-1.5 text-base text-neutral-600 `}
        >
          <span>
            {data?.days}D/ {data?.days - 1}N
          </span>
          <span>₹ {data?.pakage_amount?.amount}</span>
        </span>
      </div>
    </div>
  );
};

export default CardOne;
