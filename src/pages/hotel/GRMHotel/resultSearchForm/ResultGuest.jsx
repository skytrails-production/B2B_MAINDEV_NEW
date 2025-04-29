import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import NcInputNumber from "../../../../components/NcInputNumber";
// import NcInputNumber from "../../../components/TailwindSearchComp/heroSection/NcInputNumber";

const ResultGuest = ({
  className = "[ nc-flex-1 ]",
  hasButtonSubmit = true,
  onRoomDataChange,
  onSubmit,
  loader,
  customPadding,
}) => {
  // Retrieve session data
  const sessionData = sessionStorage.getItem("revisithotel");
  const parsedSessionData = sessionData ? JSON.parse(sessionData) : null;
  const initialRooms = parsedSessionData?.[0]?.rooms || [];

  // Calculate initial counts
  const initialRoomsCount = initialRooms.length || 1;
  const initialAdultsCount = initialRooms.reduce(
    (total, room) => total + room.adults,
    0
  );
  const initialChildrenCount = initialRooms.reduce(
    (total, room) => total + room.children_ages.length,
    0
  );
  const initialChildAges = initialRooms.flatMap((room) => room.children_ages);

  const [roomsCount, setRoomsCount] = useState(initialRoomsCount);
  const [adultsCount, setAdultsCount] = useState(initialAdultsCount);
  const [childrenCount, setChildrenCount] = useState(initialChildrenCount);
  const [childAges, setChildAges] = useState(initialChildAges);

  // Update child ages dynamically based on children count
  const updateChildAges = (count) => {
    setChildAges((prevAges) => {
      if (count > prevAges.length) {
        return [...prevAges, ...Array(count - prevAges.length).fill(1)];
      } else if (count < prevAges.length) {
        return prevAges.slice(0, count);
      }
      return prevAges;
    });
  };

  const handleRoomChange = (value) => {
    setRoomsCount(value);
    if (value > adultsCount) {
      setAdultsCount(value);
    }
  };

  const handleChildCountChange = (value) => {
    setChildrenCount(value);
    updateChildAges(value);
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childAges];
    newAges[index] = age;
    setChildAges(newAges);
  };

  const distributeGuests = () => {
    const rooms = [];
    const adultsPerRoom = Math.floor(adultsCount / roomsCount);
    const childrenPerRoom = Math.floor(childrenCount / roomsCount);
    let remainingAdults = adultsCount % roomsCount;
    let remainingChildren = childrenCount % roomsCount;
    const childAgesCopy = [...childAges];

    for (let i = 0; i < roomsCount; i++) {
      const roomAdults = adultsPerRoom + (i < remainingAdults ? 1 : 0);
      const roomChildren = childrenPerRoom + (i < remainingChildren ? 1 : 0);
      const roomChildAges = childAgesCopy.splice(0, roomChildren);
      rooms.push({
        adults: roomAdults,
        children_ages: roomChildAges,
      });
    }

    return rooms;
  };

  useEffect(() => {
    const payload = distributeGuests();
    onRoomDataChange(payload);
  }, [roomsCount, adultsCount, childrenCount, childAges]);

  const totalGuests = Number(adultsCount) + Number(childrenCount);

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
              className={`relative z-10 flex-1 flex text-left items-center [ ${customPadding} ] space-x-3 focus:outline-none`}
            >
              <div className="text-neutral-300">
                <UserPlusIcon className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="flex-grow">
                <span
                  //  className="block text-2xl font-bold"
                  className="block w-full bg-transparent text-gray-100  border-none focus:ring-0 p-0 focus:outline-none text-xl md:text-xl lg:text-xl xl:text-xl font-bold placeholder-neutral-800 truncate"
                >
                  {totalGuests || ""} Guests
                </span>
                <span className="block mt-0.5 text-[0.8rem] text-gray-100 font-medium">
                  {roomsCount} Rooms
                </span>
              </div>
            </Popover.Button>{" "}
            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <a
                  onClick={onSubmit}
                  type="button"
                  className="flex items-center shadow-md justify-center w-10 rounded-full h-10 md:h-12 md:w-12 bg-primary-6000 hover:bg-primary-700 text-neutral-50 focus:outline-none"
                >
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
              {/* Number of Rooms */}
              <NcInputNumber
                label="Rooms"
                className="w-full"
                defaultValue={roomsCount}
                onChange={handleRoomChange}
                min={1}
                max={6}
              />

              {/* Number of Adults */}
              <NcInputNumber
                label="Adults"
                className="w-full mt-4"
                defaultValue={adultsCount}
                onChange={(value) =>
                  setAdultsCount(Math.max(value, roomsCount))
                }
                min={roomsCount}
                max={15}
              />

              {/* Number of Children */}
              <NcInputNumber
                label="Children"
                className="w-full mt-4"
                defaultValue={childrenCount}
                onChange={handleChildCountChange}
                max={10}
              />

              {/* Children Ages */}
              {childrenCount > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {childAges.map((age, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700">
                        Age of Child {index + 1}
                      </label>
                      <input
                        type="number"
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-200 rounded-md"
                        value={age}
                        onChange={(e) =>
                          handleChildAgeChange(index, e.target.value)
                        }
                        min={1}
                        max={12}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Done Button */}
              <button
                type="button"
                className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-6000 hover:bg-primary-700"
                onClick={close}
              >
                Done
              </button>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default ResultGuest;
