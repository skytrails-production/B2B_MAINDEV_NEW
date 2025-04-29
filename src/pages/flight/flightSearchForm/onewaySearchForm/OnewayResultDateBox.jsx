import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
// import ClearDataButton from "../../../../components/TailwindSearchComp/heroSection/ClearDataButton";
// import DatePickerCustomHeaderTwoMonth from "../../../../components/TailwindSearchComp/heroSection/DatePickerCustomHeaderTwoMonth";
// import DatePickerCustomDay from "../../../../components/TailwindSearchComp/heroSection/DatePickerCustomDay";
import dayjs from "dayjs";
import { parseISO, isValid } from "date-fns";
// import ClearDataButton from "../../../../components/ClearDateButton";
import DatePickerCustomHeaderTwoMonth from "../../../../components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../../../components/DatePickerCustomDay";
import ClearDataButton from "../../../../components/ClearDateButton";

// Helper function to ensure a valid Date object
const ensureDate = (date) => {
  if (!date) return null;
  if (typeof date === "string") {
    const parsedDate = parseISO(date); // Use parseISO to safely parse strings
    return isValid(parsedDate) ? parsedDate : new Date(date);
  }
  return date instanceof Date ? date : null;
};

const OnewayResultDateBox = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ p-3 ]",
  onDateChange,
  hasButtonSubmit = true,
  onSubmit,
  StartDate,
}) => {
  // console.log(StartDate, "start date in oneway result date box");
  const today = ensureDate(StartDate) || new Date();
  const [startDate, setStartDate] = useState(today);

  useEffect(() => {
    setStartDate(today);
  }, [StartDate]);

  const onChangeDate = (dates, closePopover) => {
    const [start] = dates || [];
    setStartDate(start);
    if (onDateChange) onDateChange({ startDate: start });
    if (start) closePopover();
  };

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block w-full bg-transparent text-gray-100 placeholder:text-gray-100 border-none focus:ring-0 p-0 focus:outline-none text-xl md:text-xl lg:text-xl xl:text-xl font-bold placeholder-neutral-800 truncate">
            {startDate ? dayjs(startDate).format("MMM DD, YY") : "Add dates"}
          </span>
          <span className="block mt-0.5 text-[0.8rem] text-gray-100 font-medium">
            {"Departure Date"}
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`relative flex ${className}`}>
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
              {renderInput()}
              {startDate && open && (
                <ClearDataButton onClick={() => onChangeDate(null, close)} />
              )}
            </Popover.Button>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <a
                  onClick={onSubmit}
                  type="button"
                  className="h-14 md:h-16 w-14 md:w-16 rounded-full bg-primary-6000 hover:bg-primary-700 flex items-center justify-center text-neutral-50 focus:outline-none"
                >
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
            <Popover.Panel className="absolute left-1/2 md:left-0 z-30 mt-[-40px] top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-8">
                <DatePicker
                  selected={ensureDate(startDate)}
                  onChange={(date) => onChangeDate([date], close)}
                  startDate={ensureDate(startDate)}
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  minDate={new Date()}
                  renderCustomHeader={(p) => (
                    <DatePickerCustomHeaderTwoMonth {...p} />
                  )}
                  renderDayContents={(day, date) => (
                    <DatePickerCustomDay dayOfMonth={day} date={date} />
                  )}
                />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default OnewayResultDateBox;
