import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "../../../../components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../../../components/DatePickerCustomDay";
import ClearDataButton from "../../../../components/ClearDateButton";
// import DatePickerCustomHeaderTwoMonth from "../../../components/TailwindSearchComp/heroSection/DatePickerCustomHeaderTwoMonth";
// import DatePickerCustomDay from "../../../components/TailwindSearchComp/heroSection/DatePickerCustomDay";
// import ClearDataButton from "../../../components/TailwindSearchComp/heroSection/ClearDataButton";

const ResultDateRange = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "p-3",
  onDateChange,
}) => {
  const today = new Date();

  // Retrieve session data
  const sessionData = sessionStorage.getItem("revisithotel");
  const parsedSessionData = JSON.parse(sessionData);

  const parsedCheckInDate = new Date(parsedSessionData?.[0]?.checkin);
  const parsedCheckOutDate = new Date(parsedSessionData?.[0]?.checkout);
  const [startDate, setStartDate] = useState(parsedCheckInDate);
  const [endDate, setEndDate] = useState(parsedCheckOutDate);

  const onChangeDate = (dates, closePopover) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      closePopover(); // Close the popover when both start and end dates are selected
    }
  };

  useEffect(() => {
    if (onDateChange) {
      onDateChange({ startDate, endDate });
    }
  }, [startDate, endDate, onDateChange]);

  const renderInput = () => (
    <>
      <div className="text-neutral-300">
        <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
      </div>
      <div className="flex-grow text-left">
        <span
          // className="block text-2xl font-bold"
          className="block w-full bg-transparent text-gray-100 placeholder:text-gray-100 border-none focus:ring-0 p-0 focus:outline-none text-xl md:text-xl lg:text-xl xl:text-xl font-bold placeholder-neutral-800 truncate"
        >
          {startDate?.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          }) || "Add dates"}
          {endDate
            ? " - " +
              endDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })
            : ""}
        </span>
        <span className="block mt-0.5 text-[0.8rem] text-gray-100 font-medium">
          {"Check in - Check out"}
        </span>
      </div>
    </>
  );

  return (
    <Popover className={`StayDatesRangeInput z-10 relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`flex-1 z-10 flex relative ${fieldClassName} items-center space-x-3 focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
            {renderInput()}
            {startDate && open && (
              <ClearDataButton onClick={() => onChangeDate([null, null])} />
            )}
          </Popover.Button>

          {/* {open && (
            <div className="h-8 absolute self-center top-1/2 -translate-y-1/2 z-0 -inset-x-0.5 bg-white"></div>
          )} */}

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-50 mt-[-40px] top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 bg-white p-8">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => onChangeDate(dates, close)}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
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

export default ResultDateRange;
