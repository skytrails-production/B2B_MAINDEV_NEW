import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "../../../../components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../../../components/DatePickerCustomDay";
import dayjs from "dayjs";
import ClearDataButton from "../../../../components/ClearDateButton";

// Helper function to format dates as "YYYY-MM-DD"
const convertToISOString = (dateString) => {
  // Parse the input date string
  const parsedDate = dayjs(dateString, "DD MMM, YY");

  const d = parsedDate.isValid() ? parsedDate.toDate().toString() : null;
  // console.log(d, "startDate enddate1");
  return d;
};

const formatDate = (date) => {
  console.log(date, date ? date.toISOString().split("T")[0] : null);
};

const ReturnDateBox = ({
  className = "[ lg:nc-flex-2 ]",
  fieldClassName = "[ nc-hero-field-padding ]",
  onDateChange,
  hasButtonSubmit = true,
  loader,
  onSubmit,
  StartDate,
  EndDate,
}) => {
  const today = convertToISOString(StartDate) || new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1); // Set default to tomorrow

  // const [startDate, setStartDate] = useState(tomorrow);
  const todayDefult = new Date();

  // console.log(today, "startDate enddate");
  convertToISOString(StartDate);

  const twoDays = new Date(todayDefult);
  twoDays.setDate(todayDefult.getDate() + 3);
  const twoDaysLater = convertToISOString(EndDate) || twoDays;

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(twoDaysLater);

  const onChangeDate = (dates, closePopover) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      // console.log({
      //   checkin: formatDate(start),
      //   checkout: formatDate(end),
      // });
      closePopover(); // Close the popover when both start and end dates are selected
    }
  };

  useEffect(() => {
    if (onDateChange) {
      onDateChange({ startDate, endDate });
    }
  }, [startDate, endDate, onDateChange]);

  const renderInput = () => {
    return (
      <>
        <div className="text-neutral-300">
          <CalendarIcon className="w-5 h-5 lg:w-7 lg:h-7" />
        </div>
        <div className="flex-grow text-left">
          <span className="block text-base md:text-2xl text-white font-bold">
            {typeof startDate == "object"
              ? startDate?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                }) || "Add dates"
              : new Date(startDate)?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                }) || "Add dates"}
            -
            {endDate
              ? " - " + typeof endDate == "object"
                ? endDate?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })
                : new Date(endDate)?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  })
              : ""}
          </span>
          <span className="block mt-1 text-[0.8rem] text-neutral-400 leading-none font-light">
            {"Check in - Check out"}
          </span>
        </div>
      </>
    );
  };

  return (
    <Popover className={`StayDatesRangeInput z-10 relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <div
            className={`flex-1 z-10 flex items-center focus:outline-none ${
              open ? "nc-hero-field-focused" : ""
            }`}
          >
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

            {hasButtonSubmit && (
              <div className="pr-2 xl:pr-4">
                <a
                  onClick={onSubmit}
                  type="button"
                  className="h-14 md:h-16 w-14 md:w-16 rounded-full bg-primary-6000 hover:bg-primary-700 flex items-center justify-center text-neutral-50 focus:outline-none"
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
            <Popover.Panel className="absolute left-1/2 md:left-0 z-30 mt-[-40px] top-full w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5 border-1 border-gray-500 bg-background-6000 p-8">
                <DatePicker
                  selected={
                    typeof startDate == "object"
                      ? startDate
                      : new Date(startDate)
                  }
                  onChange={(dates) => onChangeDate(dates, close)}
                  startDate={
                    typeof startDate == "object"
                      ? startDate
                      : new Date(startDate)
                  }
                  endDate={
                    typeof endDate == "object" ? endDate : new Date(endDate)
                  }
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

export default ReturnDateBox;
