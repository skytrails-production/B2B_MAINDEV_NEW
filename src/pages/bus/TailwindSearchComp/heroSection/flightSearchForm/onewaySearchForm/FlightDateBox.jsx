import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import ClearDataButton from "../../ClearDataButton";
import DatePickerCustomHeaderTwoMonth from "../../DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../DatePickerCustomDay";
// Helper function to format dates as "YYYY-MM-DD"
// const formatDate = (date) => {
//   return date ? date.toISOString().split("T")[0] : null;
// };

const FlightDateBox = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  onDateChange,
  hasButtonSubmit = true,
  onSubmit,
}) => {
  const today = new Date();

  const [startDate, setStartDate] = useState(today);

  const onChangeDate = (date, closePopover) => {
    setStartDate(date);
    // if (date) {
    //   console.log({
    //     checkin: formatDate(date),
    //   });
    // }
    closePopover();
  };

  useEffect(() => {
    if (onDateChange) {
      onDateChange({ startDate });
    }
  }, [startDate, onDateChange]);

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block text-base md:text-2xl font-bold">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "2-digit",
            }) || "Add date"}
          </span>
          <span className="block mt-1 text-[0.8rem] text-neutral-400 leading-none font-light">
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
                <ClearDataButton onClick={() => onChangeDate(null)} />
              )}
            </Popover.Button>

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <a
                  onClick={onSubmit}
                  type="button"
                  className="h-14 md:h-16 w-14 md:w-16 rounded-full bg-primary-6000 hover:bg-primary-700 flex items-center justify-center text-neutral-50 focus:outline-none"
                >
                  {/* <span className="mr-3 md:hidden">Search</span> */}
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
            <Popover.Panel className=" absolute left-1/2 md:left-0 z-30 mt-[-40px] top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-8">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => onChangeDate(dates, close)}
                  startDate={startDate}
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  minDate={today}
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

export default FlightDateBox;
