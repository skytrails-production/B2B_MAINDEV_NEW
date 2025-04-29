import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import NcInputNumber from "../../../components/NcInputNumber";

// import NcInputNumber from "../NcInputNumber";

const HolidayGuestInput = ({
  fieldClassName = "[ nc-hero-field-padding ]",
  className = "[ nc-flex-1 ]",
  buttonSubmitHref = "",
  hasButtonSubmit = true,
  onRoomDataChange,
  onSubmit,
}) => {
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);

  const handleChangeData = (value, type) => {
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
    }
  };

  useEffect(() => {
    const payload = {
      adults: guestAdultsInputValue,
      child: guestChildrenInputValue,
    };
    onRoomDataChange(payload);
  }, [guestAdultsInputValue, guestChildrenInputValue]);

  const totalGuests = guestChildrenInputValue + guestAdultsInputValue;

  return (
    <Popover className={`flex relative z-30 `}>
      {({ open, close }) => (
        <>
          <div
            className={` z-10 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                {/* <ButtonSubmit href={buttonSubmitHref} /> */}
                <a
                  onClick={onSubmit}
                  type="button"
                  className="flex items-center justify-center w-10 rounded-full h-10 md:h-16 md:w-16 bg-primary-6000 hover:bg-primary-700 text-neutral-50 focus:outline-none"
                >
                  {/* <span className="mr-3 md:hidden">Search</span> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
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
                </a>
              </div>
            )}
          </div>

          {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -left-0.5 right-0.5 bg-white "></div>
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
            <Popover.Panel className="absolute right-0 z-10 w-full sm:min-w-[340px] max-w-sm bg-white  top-full mt-3 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl">
              <NcInputNumber
                className="w-full"
                defaultValue={guestAdultsInputValue}
                onChange={(value) => handleChangeData(value, "guestAdults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
              <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestChildrenInputValue}
                onChange={(value) => handleChangeData(value, "guestChildren")}
                max={4}
                label="Children"
                desc="Ages 2–12"
              />

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                  onClick={() => close()}
                >
                  Okay
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default HolidayGuestInput;
