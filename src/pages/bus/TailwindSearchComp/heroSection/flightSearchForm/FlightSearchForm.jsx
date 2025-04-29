import React, { useState, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import NcInputNumber from "../NcInputNumber";
import OnewaySearchForm from "./onewaySearchForm/OnewaySearchForm";
import ReturnSearchForm from "./returnSearchForm/ReturnSearchForm";
import MulticitySearchForm from "./multicitySearchForm/MulticitySearchForm";

const flightClass = [
  { id: 2, value: "Y", label: "Economy" },
  { id: 3, value: "W", label: "Premium Economy" },
  { id: 4, value: "C", label: "Business" },
  { id: 6, value: "F", label: "First" },
];

const FlightSearchForm = () => {
  const [dropOffLocationType, setDropOffLocationType] = useState("oneway");
  const [flightClassState, setFlightClassState] = useState(flightClass?.[0]);

  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(0);

  const handleChangeData = (value, type) => {
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
    }
    if (type === "guestInfants") {
      setGuestInfantsInputValue(value);
    }
  };

  const totalGuests =
    guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;

  const renderGuest = () => {
    return (
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`px-4 py-1.5 rounded-md inline-flex items-center font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-xs`}
            >
              <span>{`${totalGuests || ""} Travellers`}</span>
              <ChevronDownIcon
                className={`${
                  open ? "" : "text-opacity-70"
                } ml-2 h-4 w-4 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-20 w-full sm:min-w-[340px] max-w-sm bg-white  top-full mt-3 left-1/2 -translate-x-1/2 py-5 sm:py-6 px-4 sm:px-8 rounded-3xl shadow-xl ring-1 ring-black/5 ">
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
                <NcInputNumber
                  className="w-full mt-6"
                  defaultValue={guestInfantsInputValue}
                  onChange={(value) => handleChangeData(value, "guestInfants")}
                  max={4}
                  label="Infants"
                  desc="Ages 0–2"
                />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderSelectClass = () => {
    return (
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`px-4 py-1.5 rounded-md inline-flex items-center font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-xs`}
            >
              <span>{`${flightClassState.label}`}</span>
              <ChevronDownIcon
                className={`${
                  open ? "" : "text-opacity-70"
                } ml-2 h-4 w-4 group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-20 w-screen max-w-[350px] sm:max-w-[220px] xl:px-4 lg:px-4 md:px-4 top-full mt-3 transform -translate-x-1/2 left-1/2 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                  <div className="relative grid gap-8 bg-white  p-7">
                    {flightClass.map((item) => (
                      <a
                        key={item.value}
                        // href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setFlightClassState(item);
                          close();
                        }}
                        className="flex items-center text-gray-900 no-underline p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50  focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <p className="text-sm font-medium">{item.label}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    );
  };

  const renderRadioBtn = () => {
    return (
      <div className=" px-6 md:py-4 md:px-7 py-3 xl:py-6 xl:px-8 flex flex-row justify-center md:justify-start flex-wrap border-b-2 md:border-b-2 border-gray-200  md:border-gray-300">
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
            dropOffLocationType === "oneway"
              ? "bg-black text-white shadow-black/10 shadow-lg"
              : "border-2 border-slate-300 "
          }`}
          onClick={() => setDropOffLocationType("oneway")}
        >
          One-way
        </div>
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
            dropOffLocationType === "roundTrip"
              ? "bg-black shadow-black/10 shadow-lg text-white"
              : "border-2 border-slate-300 "
          }`}
          onClick={() => setDropOffLocationType("roundTrip")}
        >
          Round-trip
        </div>
        <div
          className={`py-1.5 px-4 hidden md:flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
            dropOffLocationType === "multicity"
              ? "bg-black shadow-black/10 shadow-lg text-white"
              : "border-2 border-slate-300 "
          }`}
          onClick={() => setDropOffLocationType("multicity")}
        >
          Multi-city
        </div>

        <div className="self-center border-r-2 border-slate-300 hidden md:flex  h-8 mr-2 my-1 sm:mr-3"></div>
        <div className="mr-2 my-1 sm:mr-3 border-2 border-slate-300  rounded-full">
          {renderSelectClass()}
        </div>
        <div className="my-1 border-2 border-slate-300   rounded-full">
          {renderGuest()}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <form className="w-full mx-2 md:mx-0  container relative rounded-[10px] shadow-2xl bg-white ">
        {renderRadioBtn()}

        {dropOffLocationType == "oneway" && (
          <div className="flex flex-1 rounded-full">
            <OnewaySearchForm
              adult={guestAdultsInputValue}
              child={guestChildrenInputValue}
              infant={guestInfantsInputValue}
              flightClass={flightClassState}
            />
          </div>
        )}
        {dropOffLocationType == "roundTrip" && (
          <div className="flex flex-1 rounded-full">
            <ReturnSearchForm
              adult={guestAdultsInputValue}
              child={guestChildrenInputValue}
              infant={guestInfantsInputValue}
              flightClass={flightClassState}
            />
          </div>
        )}
        {dropOffLocationType == "multicity" && (
          <div className="flex flex-1 rounded-full">
            <MulticitySearchForm
              adult={guestAdultsInputValue}
              child={guestChildrenInputValue}
              infant={guestInfantsInputValue}
              flightClass={flightClassState}
            />
          </div>
        )}
      </form>
    );
  };

  return renderForm();
};

export default FlightSearchForm;
