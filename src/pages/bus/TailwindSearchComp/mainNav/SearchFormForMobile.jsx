import React, { Fragment, useRef, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import StaySearchForm from "./staySearchForm/StaySearchFormMobile";
import HolidaySearchFormMobile from "./holidayForm/HolidaySearchFormMobile";
import BusSearchFormMobile from "./busSearchForm/BusSearchFormMobile";
import OnewayformMobile from "./flightSearchForm/onewayMobile/OnewayformMobile";
import ReturnFormMobile from "./flightSearchForm/returnMobile/ReturnFormMobile";


const SearchFormForMobile = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDialog, setShowDialog] = useState(true);
    const staySearchFormRef = useRef();
    const holidaySearchFormRef = useRef();
    const busSearchFormRef = useRef();
    const onewaySearchFormRef = useRef();
    const returnSearchFormRef = useRef();


    const [flightType, setFlightType] = useState("oneway"); 


    const renderFlightTypeButtons = () => {
      return (
        <div className=" py-5 flex items-center justify-center flex-wrap flex-row border-b border-neutral-100 ">
          <div
            className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
              flightType === "oneway"
                ? "bg-black text-white shadow-black/10 shadow-lg"
                : "border border-neutral-300 "
            }`}
            onClick={() => setFlightType("oneway")}
          >
            Oneway
          </div>
          <div
            className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer mr-2 my-1 sm:mr-3 ${
              flightType === "return"
                ? "bg-black text-white shadow-black/10 shadow-lg"
                : "border border-neutral-300 "
            }`}
            onClick={() => setFlightType("return")}
          >
            Return
          </div>
        </div>
      );
    };


    const closeModal = () => {
        setShowModal(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const renderButtonOpenModal = () => {
        return (
            <button
                onClick={openModal}
                className="relative flex items-center w-full border border-neutral-200 px-4 py-2 pr-11 rounded-full shadow-lg"
            >
                <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

                <div className="ml-3 flex-1 text-left overflow-hidden">
                    <span className="block font-medium text-sm">Where to?</span>
                    <span className="block mt-0.5 text-xs font-light text-neutral-500">
                        <span className="line-clamp-1">Anywhere • Any week • Add guests</span>
                    </span>
                </div>

                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200">
                    <svg
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        role="presentation"
                        focusable="false"
                        className="block w-4 h-4"
                        fill="currentColor"
                    >
                        <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                    </svg>
                </span>
            </button>
        );
    };


    const handleSearch = () => {
        // Call the handleSubmit function in the child component
        if (staySearchFormRef.current) {
            staySearchFormRef.current.handleSubmit();
        }
        if (holidaySearchFormRef.current) {
            holidaySearchFormRef.current.handleSubmit();
        }
        if (busSearchFormRef.current) {
            busSearchFormRef.current.handleSubmit();
        }
        if(onewaySearchFormRef.current) {
            onewaySearchFormRef.current.handleSubmit();
        }
        if(returnSearchFormRef.current) {
            returnSearchFormRef.current.handleSubmit();
        }
    };

    return (
        <div className="HeroSearchForm2Mobile">
            {renderButtonOpenModal()}
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" className="HeroSearchFormMobile__Dialog relative z-max" onClose={closeModal}>
                    <div className="fixed inset-0 bg-neutral-100 ">
                        <div className="flex h-full">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out transition-transform"
                                enterFrom="opacity-0 translate-y-52"
                                enterTo="opacity-100 translate-y-0"
                                leave="ease-in transition-transform"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-52"
                            >
                                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col justify-between">
                                    {showDialog && (
                                        <Tab.Group manual className="relative h-full overflow-hidden flex-1 flex flex-col justify-between">
                                            <div className="absolute left-4 top-4">
                                                <button className="" onClick={closeModal}>
                                                    <XMarkIcon className="w-5 h-5 text-black " />
                                                </button>
                                            </div>

                                            <Tab.List className="pt-12 flex w-full justify-center font-semibold text-sm sm:text-base text-neutral-500  space-x-6 sm:space-x-8">
                                                {["Stay", "Holiday", "Bus", "Flights"].map((item, index) => (
                                                    <Tab key={index} as={Fragment}>
                                                        {({ selected }) => (
                                                            <div className="relative focus:outline-none focus-visible:ring-0 outline-none select-none">
                                                                <div className={`${selected ? "text-black " : ""}`}>
                                                                    {item}
                                                                </div>
                                                                {selected && (
                                                                    <span className="absolute inset-x-0 top-full border-b-2 border-black "></span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </Tab>
                                                ))}
                                            </Tab.List>

                                            <div className="flex-1 pt-3 px-1.5 sm:px-4 flex overflow-hidden">
                                                <Tab.Panels className="flex-1 overflow-y-auto hiddenScrollbar py-4">
                                                    <Tab.Panel>
                                                        <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                                                            <StaySearchForm ref={staySearchFormRef} />
                                                        </div>
                                                    </Tab.Panel>
                                                    <Tab.Panel>
                                                        <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                                                            <HolidaySearchFormMobile ref={holidaySearchFormRef} />
                                                        </div>
                                                    </Tab.Panel>
                                                    <Tab.Panel>
                                                        <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                                                            <BusSearchFormMobile ref={busSearchFormRef} />
                                                        </div>
                                                    </Tab.Panel>
                                                    <Tab.Panel>
                                                        <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                                                            {/* <OnewayformMobile  /> */}
                                                            {/* <FlightSearchFormMobile  /> */}

                                                            {renderFlightTypeButtons()} 
      
                                                        {flightType === "oneway" ? <OnewayformMobile ref={onewaySearchFormRef} /> : <ReturnFormMobile ref={returnSearchFormRef} />}
                                                        </div>
                                                    </Tab.Panel>
                                                </Tab.Panels>
                                            </div>

                                            <div className="px-4 py-3 bg-white border-t border-neutral-200 flex justify-between">
                                                <button
                                                    type="button"
                                                    className="underline font-semibold flex-shrink-0"
                                                    onClick={() => {
                                                        setShowDialog(false);
                                                    }}
                                                >
                                                    Clear all
                                                </button>


                                                <button
                                                    type="submit"
                                                    onClick={() => {
                                                        handleSearch()
                                                        // closeModal();
                                                    }}
                                                    className={`flex-shrink-0 px-4 py-2.5 cursor-pointer rounded-xl bg-primary-6000 flex items-center justify-center text-neutral-50 focus:outline-none relative z-20`}
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
                                                    <span className="ml-2">Search</span>
                                                </button>
                                            </div>
                                        </Tab.Group>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default SearchFormForMobile;
