import React, { useState } from "react";
// import ViewDetails from "./ViewDetails";
import { ChevronsDown, ChevronsUp } from "lucide-react";
// import ViewFlightDetails from "./ViewFlightDetails";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import freeMeal from "../../images/freemeal.png";
import { findAirportByCode } from "../../utility/flightUtility/BookwarperUtility";
import { setReturnSelectedFlight } from "../../Redux/returnSelectedFlight/actionReturnSelectedFlight";
import ViewFlightDetails from "./ViewFlightDetails";

const FlightResultCard = ({
  item,
  handleSelectedChange,
  key,
  index,
  isOnward,
  selectedIndex,
}) => {
  const type = isOnward ? "onward" : "return";
  // console.log(item, "itemitemitemitemitem");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [data, setData] = useState({
  //   onward: null,
  //   return: null,
  // });

  // console.log(item, "ite in the flight result card");

  const handleNavigate = (item, isHold) => {
    // setData({
    //   onward: item,
    //   return: null,
    // });

    // if (data) {
    dispatch(
      setReturnSelectedFlight({
        onward: item,
        return: null,
      })
    );
    navigate("/flight/review-details", {
      state: { isHold: isHold === "hold" ? true : false },
    });
    // }
  };

  const isSelectedIndex = selectedIndex[type] == index;

  const [isFlightDetail, setIsFlightDetail] = useState(false);
  return (
    <div class="w-full relative transition-all ease-in-out hover:scale-[1.01] bg-white border-1 border-gray-300 rounded-md   p-3 px-3 hover:shadow-sm cursor-pointer ">
      {item?.isFreeMeal && (
        <div className="absolute -top-2 z-50 left-0  px-2 py-0.5 rounded-sm bg-gradient-to-r from-orange-500 font-semibold   to-orange-300">
          <div className="relative flex flex-row items-center gap-1">
            <img src={freeMeal} className="w-4 h-4" alt="" />
            <p className="text-[10px]">Free Meal</p>
            <div className="absolute inset-0   bg-gradient-to-r from-transparent via-white to-transparent opacity-75 blur-md z-10 animate-slide"></div>
          </div>
        </div>
      )}
      <div
        // onClick={() => handleSelectedChange(type, item, index)}
        class="flex justify-between"
      >
        <div className="flex flex-1 flex-col items-start justify-center gap-2">
          <img
            class="w-[30px] h-[30px] object-cover rounded-md"
            src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${item?.flightName}.png`}
            alt="Flight Image"
          />
          <div>
            <p class="text-sm text-gray-500">
              {item?.flightName}-{item?.flightNumber}
            </p>
          </div>
        </div>
        {/* <!-- Departure Time --> */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p class="text-sm text-gray-500">
            {findAirportByCode(item?.origin)?.name}
          </p>
          <p class="font-semibold text-gray-700">{item?.departureTime}</p>
        </div>

        {/* <!-- Duration and Stops --> */}
        <div className="relative group flex flex-1 flex-col items-center justify-center gap-2">
          {/* <p class="text-sm text-gray-500">{item?.destination}</p> */}
          <p class="font-semibold text-gray-700">{item?.layover}</p>
          <div className=" w-2/3 h-[1.5px] bg-primary-500 mt-2">
            <div className=" ">
              {item?.stopes !== 0 && (
                <div className="w-2 h-2 rounded-full bg-gray-400 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              )}
              {/* Tooltip */}
              {item?.stopes !== 0 && (
                <div className="absolute hidden -top-0 left-1/2 transform -translate-x-1/2  group-hover:block  bg-white whitespace-nowrap  text-white text-sm px-3 py-1 rounded shadow-md border border-gray-600">
                  <p className="text-center text-gray-900 block text-[12px] font-medium">
                    {item?.stopes} stop via
                  </p>
                  <ul className="p-0 list-disc mb-0">
                    {item?.via?.map((i, index) => {
                      return (
                        <>
                          {index < item?.via?.length - 1 && (
                            <li className="block  text-gray-700 text-[11px] font-medium">
                              {i} ({findAirportByCode(i)?.name}){" "}
                            </li>
                          )}
                        </>
                      );
                    })}
                  </ul>
                  <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rotate-45 border-b border-gray-300 border-r"></div>
                </div>
              )}
            </div>
          </div>

          <p class="text-xs text-gray-400 mt-2">
            {item?.stopes == 0 ? "Non-stop" : `${item?.stopes}-stop`}
          </p>
        </div>

        {/* <!-- Arrival Time --> */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <p class="text-sm text-gray-500">
            {" "}
            {findAirportByCode(item?.destination)?.name}
          </p>
          <p class="font-semibold text-gray-700">{item?.arrivalTime}</p>
        </div>
        {/* <div className="flex flex-1 flex-col items-end justify-center gap-2">
         
          <p class={`text-lg font-semibold text-gray-700"`}>₹{item.price}</p>
          <button
            onClick={() => handleNavigate(item)}
            className=" px-3 bg-primary-500 hover:bg-primary-6000 text-white font-medium py-1 rounded-full text-sm"
          >
            Book Now
          </button>
        </div> */}

        <div className="flex flex-1 flex-col items-end justify-center gap-2">
          {/* <label className="cursor-pointer flex items-center border rounded-lg hover:bg-gray-100 ">
            <div className="text-gray-700">{""}</div>
          </label> */}
          <p className={`text-lg font-semibold text-gray-800`}>
            ₹{item?.price}
          </p>
          <div className="flex gap-2 flex-col">
            {item?.type === "AMD" && (
              <button
                onClick={() => handleNavigate(item, "hold")}
                className=" px-3 border-2 border-primary-6000 bg-transparent hover:bg-primary-700 text-primary-6000 font-medium py-1 rounded-full text-sm"
              >
                Hold
              </button>
            )}
            <button
              onClick={() => handleNavigate(item, "book")}
              className=" px-3  bg-primary-6000 hover:bg-primary-700 text-white font-medium py-1 rounded-full text-sm"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center mt-2">
        <button
          onClick={() => setIsFlightDetail((pre) => !pre)}
          className="text-indigo-600  flex gap-2 items-center font-semibold text-[14px] hover:text-indigo-700 focus:outline-none text-right"
        >
          View Details{" "}
          {isFlightDetail ? (
            <ChevronsUp size={16} />
          ) : (
            <ChevronsDown size={16} />
          )}
        </button>
      </div>
      {/* <p>{item?.type}</p> */}

      {isFlightDetail && <ViewFlightDetails key={index} item={item} />}
    </div>
  );
};

export default FlightResultCard;
