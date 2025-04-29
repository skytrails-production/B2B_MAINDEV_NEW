import React, { useState } from "react";
import StaySearchForm from "./staySearchForm/StaySearchForm";
import HolidaySearchForm from "./holidayForm/HolidaySearchForm";
import BusSearchForm from "./busSearchForm/BusSearchForm";
import FlightSearchForm from "./flightSearchForm/FlightSearchForm";
const HeroSearchForm = ({ className = "", currentTab = "Stays", currentPage }) => {
    const tabs = ["Flights", "Stays", "Holidays", "Bus" ];
    const [tabActive, setTabActive] = useState(currentTab);

    const renderTab = () => {
        return (
            <ul className="ml-2 sm:ml-6 md:ml-12 flex space-x-5 sm:space-x-8 lg:space-x-11 overflow-x-auto hiddenScrollbar">
                {tabs.map((tab) => {
                    const active = tab === tabActive;
                    return (
                        <li
                            onClick={() => setTabActive(tab)}
                            className={`flex-shrink-0 flex items-center cursor-pointer text-sm lg:text-lg font-medium ${active
                                ? ""
                                : "text-neutral-500 hover:text-neutral-700 "
                                } `}
                            key={tab}
                        >
                            {active && (
                                <span className="block w-2.5 h-2.5 rounded-full bg-neutral-800 mr-2" />
                            )}
                            <span>{tab}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderForm = () => {
        switch (tabActive) {
            case "Stays":
                return <StaySearchForm />;
            case "Holidays":
                return <HolidaySearchForm />;
            case "Bus":
                return <BusSearchForm />;
            case "Flights":
                return <FlightSearchForm />;
            default:
                return null;
        }
    };

    return (
        <div className={`nc-HeroSearchForm w-full max-w-6xl md:py-2 lg:py-0 ${className}`}>
            {renderTab()}
            {renderForm()}
        </div>
    );
};

export default HeroSearchForm;
