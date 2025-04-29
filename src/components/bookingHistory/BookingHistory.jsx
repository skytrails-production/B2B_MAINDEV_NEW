import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import FlightHistory from "./FlightHistory";
import BusHistory from "./BusHistory";
import GrnHotelHistory from "./GrnHotelHistory";
import VisaHistory from "./VisaHistory";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("FLIGHT");
  const tabs = ["FLIGHT", "HOTEL", "BUS", "VISA"];

  const getComponent = () => {
    switch (activeTab) {
      case "FLIGHT":
        return <FlightHistory />;
      case "HOTEL":
        return <GrnHotelHistory />;
      case "BUS":
        return <BusHistory />;
      case "VISA":
        return <VisaHistory />;
      default:
        return <div className="text-gray-500 p-6">No bookings found</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-all
              ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            {activeTab === tab && (
              <FiArrowRight className="ml-2 inline-block w-4 h-4 animate-bounce-x" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {getComponent()}
      </div>
    </div>
  );
};

export default BookingHistory;
