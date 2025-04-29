import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { UserPlusIcon, TrashIcon } from "@heroicons/react/24/outline";
// import NcInputNumber from "../../NcInputNumber";
// import ClearDataButton from "../../ClearDataButton";
const flightClass = [
  { id: 2, value: "Y", label: "Economy" },
  { id: 3, value: "W", label: "Premium" },
  { id: 4, value: "C", label: "Business" },
  { id: 6, value: "F", label: "First" },
];
const RetrunGuestsInput = ({
  fieldClassName = "[ p-3]",
  className = "[ nc-flex-1 ]",
  hasButtonSubmit = true,
  onTravellerClassChange,
  onSubmit,
  loader,
  adult,
  child,
  infant,
}) => {
  const [passengers, setPassengers] = useState({
    adult: Number(adult || 1),
    child: Number(child || 0),
    infant: Number(infant || 0),
  });
  // console.log("adult,chilf", adult, child, infant);
  const totalGuests =
    passengers?.adult + passengers?.child + passengers?.infant;
  const [flightClassState, setFlightClassState] = useState(flightClass?.[0]);
  const maxTotalPassengers = 10;

  const handleSelect = (type, value) => {
    setPassengers((prev) => {
      let { adult, child, infant } = prev;

      if (type === "adult") {
        const newTotal = value + child;
        if (newTotal <= maxTotalPassengers) {
          adult = value;
          infant = Math.min(infant, value); // Ensure infants <= adults
        }
      } else if (type === "child") {
        const newTotal = value + adult;
        if (newTotal <= maxTotalPassengers) {
          child = value;
        }
      } else if (type === "infant") {
        if (value <= adult) {
          infant = value;
        }
      }
      // console.log("{ adult, child, infant }", { adult, child, infant });
      onTravellerClassChange({ adult, child, infant }, flightClassState);

      return { adult, child, infant };
    });
  };

  return (
    <Popover className={`flex relative ${className}`}>
      {({ open, close }) => (
        <>
          <div
            className={`flex-1 z-10 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            <Popover.Button
              className={`relative z-10 flex-1 flex text-left items-center ${fieldClassName} space-x-3 focus:outline-none`}
            >
              <div className="text-neutral-300">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span className="block w-full bg-transparent text-gray-100  border-none focus:ring-0 p-0 focus:outline-none text-xl md:text-xl lg:text-xl xl:text-xl font-bold placeholder-neutral-800 truncate">
                  {totalGuests || ""} Travellers
                </span>
                <span className="block mt-0.5 text-[0.8rem] text-gray-100 font-medium">
                  {flightClassState.label}
                </span>
              </div>

              {/* {!!totalGuests && open && (
                <ClearDataButton onClick={() => onChangeDate([null, null])} />
              )} */}
            </Popover.Button>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <a
                  onClick={onSubmit}
                  type="button"
                  className="flex items-center shadow-md justify-center w-10 rounded-full h-10 md:h-12 md:w-12 bg-primary-6000 hover:bg-primary-700 text-neutral-50 focus:outline-none"
                >
                  {/* <span className="mr-3 md:hidden">Search</span> */}
                  {loader ? (
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient
                        id="a2"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stop-color="#FFFFFF"></stop>
                        <stop
                          offset=".3"
                          stop-color="#FFFFFF"
                          stop-opacity=".9"
                        ></stop>
                        <stop
                          offset=".6"
                          stop-color="#FFFFFF"
                          stop-opacity=".6"
                        ></stop>
                        <stop
                          offset=".8"
                          stop-color="#FFFFFF"
                          stop-opacity=".3"
                        ></stop>
                        <stop
                          offset="1"
                          stop-color="#FFFFFF"
                          stop-opacity="0"
                        ></stop>
                      </radialGradient>
                      <circle
                        transform-origin="center"
                        fill="none"
                        stroke="url(#a2)"
                        stroke-width="15"
                        stroke-linecap="round"
                        stroke-dasharray="200 1000"
                        stroke-dashoffset="0"
                        cx="100"
                        cy="100"
                        r="70"
                      >
                        <animateTransform
                          type="rotate"
                          attributeName="transform"
                          calcMode="spline"
                          dur="2"
                          values="360;0"
                          keyTimes="0;1"
                          keySplines="0 0 1 1"
                          repeatCount="indefinite"
                        ></animateTransform>
                      </circle>
                      <circle
                        transform-origin="center"
                        fill="none"
                        opacity=".2"
                        stroke="#FFFFFF"
                        stroke-width="15"
                        stroke-linecap="round"
                        cx="100"
                        cy="100"
                        r="70"
                      ></circle>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </a>
              </div>
            )}
          </div>

          {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-transparent"></div>
          )}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
              {/* <div className="absolute inset-0 bg-black opacity-20 z-0 pointer-events-none"></div>{" "} */}
              {/* Dark background layer */}
              {/* <div className="z-10 w-full sm:min-w-[340px] max-w-sm bg-white py-3 sm:py-3 px-4 sm:px-3 rounded-2xl shadow-xl"> */}
              <div
              //  className="p-6  mx-auto bg-white shadow-lg rounded-lg border"
              >
                <h2 className="text-sm font-semibold mb-2 ">
                  Passenger Selection
                </h2>

                {["adult", "child", "infant"].map((type) => {
                  const maxCount = type === "adult" ? 9 : 6;

                  return (
                    <div key={type} className="flex flex-col  rounded-lg ">
                      <span className="capitalize font-medium text-gray-700 mb-2">
                        {type === "adult" && "Adult (12+ years)"}
                        {type === "child" && "Child (2-11 years)"}
                        {type === "infant" && "Infant (under 2 years)"}
                      </span>
                      <div className="flex flex-nowrap gap-1">
                        {Array.from({ length: maxCount + 1 }).map(
                          (_, index) => {
                            const isDisabled =
                              (type === "adult" &&
                                index + passengers.child >
                                  maxTotalPassengers) ||
                              (type === "child" &&
                                index + passengers.adult >
                                  maxTotalPassengers) ||
                              (type === "infant" && index > passengers.adult);

                            return (
                              <button
                                key={index}
                                type="button" // Prevent form submission
                                className={`px-2 py-1 rounded-md ${
                                  isDisabled
                                    ? " text-gray-400 cursor-not-allowed"
                                    : " text-indigo-700 hover:bg-gray-50"
                                } ${
                                  passengers[type] === index && !isDisabled
                                    ? "bg-indigo-700 text-white"
                                    : ""
                                }`}
                                disabled={isDisabled}
                                onClick={() => handleSelect(type, index)}
                              >
                                {index}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
                <h2 className="text-sm font-semibold mb-4  ">Class</h2>
                <div className="flex gap-2 justify-between  w-full">
                  {flightClass.map((item) => {
                    const isSelected = item.value == flightClassState.value;
                    return (
                      <div
                        key={item.value}
                        // href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setFlightClassState(item);
                        }}
                        className={`flex items-center no-underline p-2 -m-3 transition duration-150 ease-in-out rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${
                          isSelected
                            ? "bg-indigo-700 text-white"
                            : "text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium">{item.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-end items-center  w-full">
                  {/* <p className="text-gray-600 font-medium">
                      Total Passengers: {passengers.adult + passengers.child}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Adults and Children cannot exceed 10. Infants must not
                      exceed Adults.
                    </p> */}
                  <button
                    className="bg-indigo-700 text-white font-bold text-md px-4 py-2 text-center rounded-full cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      close();
                      onTravellerClassChange(passengers, flightClassState);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              {/* </div> */}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default RetrunGuestsInput;
