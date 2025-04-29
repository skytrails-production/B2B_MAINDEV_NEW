import { Cctv, ScissorsLineDashed, Vault } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const TboAmenities = () => {
  const reducerState = useSelector((state) => state);
  const hotelInfo = reducerState?.hotelSearchResult?.hotelInfo?.HotelInfoResult;

  const [showAll, setShowAll] = useState(false);

  // Handle both scenarios: facilities as an array of strings or a comma-separated string in the first index
  const facilities = Array.isArray(hotelInfo?.HotelDetails?.HotelFacilities)
    ? hotelInfo?.HotelDetails?.HotelFacilities.length === 1 &&
      hotelInfo?.HotelDetails?.HotelFacilities[0].includes(",")
      ? hotelInfo?.HotelDetails?.HotelFacilities[0]
          ?.split(",")
          ?.map((item) => item.trim())
      : hotelInfo?.HotelDetails?.HotelFacilities
    : [];

  const initialDisplayCount = 10;
  const facilitiesToShow = showAll
    ? facilities
    : facilities.slice(0, initialDisplayCount);

  const amenitiesMap = {
    "Dry cleaning/laundry service": {
      icon: <i className="fa-solid fa-jug-detergent"></i>,
      label: "Dry cleaning Service",
    },
    "Dry cleaning": {
      icon: <i className="fa-solid fa-jug-detergent"></i>,
      label: "Dry cleaning Service",
    },
    "Laundry facilities": {
      icon: <i className="fa-solid fa-jug-detergent"></i>,
      label: "Laundry facilities",
    },
    "Designated smoking areas": {
      icon: <i className="fa-solid fa-smoking"></i>,
      label: "Smoking Area",
    },
    "Wheelchair accessible (may have limitations)": {
      icon: <i className="fa-solid fa-wheelchair"></i>,
      label: "Wheelchair accessible",
    },
    "Free newspapers in lobby": {
      icon: <i className="fa-regular fa-newspaper"></i>,
      label: "Newspapers in lobby",
    },
    "Luggage storage": {
      icon: <i className="fa-solid fa-person-walking-luggage"></i>,
      label: "Luggage storage",
    },
    "Tours/ticket assistance": {
      icon: <i className="fa-solid fa-handshake-angle"></i>,
      label: "Tours/ticket assistance",
    },
    "Free self parking": {
      icon: <i className="fa-solid fa-square-parking"></i>,
      label: "Free self parking",
    },
    "Valet parking": {
      icon: <i className="fa-solid fa-square-parking"></i>,
      label: "Valet Parking",
    },
    Elevator: {
      icon: <i className="fa-solid fa-elevator"></i>,
      label: "Elevator",
    },
    "lift/ Elevator": {
      icon: <i className="fa-solid fa-elevator"></i>,
      label: "Elevator",
    },
    "Breakfast available (surcharge)": {
      icon: <i className="fa-solid fa-utensils"></i>,
      label: "Breakfast available",
    },
    "Breakfast services": {
      icon: <i className="fa-solid fa-utensils"></i>,
      label: "Breakfast available",
    },
    "Free WiFi": {
      icon: <i className="fa-solid fa-wifi"></i>,
      label: "Free WiFi",
    },
    " WiFi services": {
      icon: <i className="fa-solid fa-wifi"></i>,
      label: "Free WiFi",
    },
    "Number of bars/lounges - 1": {
      icon: <i className="fa-solid fa-wine-bottle"></i>,
      label: "Lounges/bars",
    },
    CCTV: {
      icon: <Cctv className="w-6 h-6" />,
      label: "CCTV",
    },
    Bar: {
      icon: <i className="fa-solid fa-wine-bottle"></i>,
      label: "Lounges/bars",
    },
    "Smoke-free property": {
      icon: <i className="fa-solid fa-ban-smoking"></i>,
      label: "No Smoking",
    },
    "Express check-in": {
      icon: <i className="fa-solid fa-calendar-check"></i>,
      label: "Express check-in",
    },
    "Express check-out": {
      icon: <i className="fa-regular fa-credit-card"></i>,
      label: "Express check-out",
    },
    "Television in common areas": {
      icon: <i className="fa-solid fa-tv"></i>,
      label: "Television (Common Room)",
    },
    "Shared TV Area": {
      icon: <i className="fa-solid fa-tv"></i>,
      label: "Television (Common Room)",
    },
    "Swimming Pool": {
      icon: <i class="fa-solid fa-water-ladder"></i>,
      label: "Swimming Pool",
    },
    "Mosquito nets": {
      icon: <i className="fa-solid fa-mosquito-net"></i>,
      label: "Mosquito nets",
    },
    Library: {
      icon: <i className="fa-solid fa-book"></i>,
      label: "Library",
    },
    "Number of coffee shops/cafes - 1": {
      icon: <i className="fa-solid fa-mug-saucer"></i>,
      label: "Coffee shop/Cafes",
    },
    "Business center": {
      icon: <i className="fa-solid fa-business-time"></i>,
      label: "Business center",
    },
    "Beauty Shop/Salon": {
      icon: <ScissorsLineDashed className="w-6 h-6" />,
      label: "Beauty Shop/Salon",
    },
    Gym: {
      icon: <i class="fa-solid fa-dumbbell"></i>,
      label: "Gym",
    },
    "Wedding services": {
      icon: <i class="fa-solid fa-gift"></i>,
      label: "Wedding Service",
    },
    "Hair dryer": {
      icon: <i class="fa-solid fa-wind"></i>,
      label: "Hair dryer",
    },
    "Locker Room": {
      icon: <Vault className="w-6 h-6 " />,
      label: "Locker Room",
    },
    Spa: {
      icon: <i class="fa-solid fa-spa"></i>,
      label: "Spa",
    },

    "Air conditioning": {
      icon: <i className="fa-regular fa-snowflake"></i>,
      label: "Air Condition",
    },
    "Housekeeping services": {
      icon: <i class="fa-solid fa-broom"></i>,
      label: "Housekeeping services",
    },
    "Meeting rooms": {
      icon: <i class="fa-solid fa-person-chalkboard"></i>,
      label: "Meeting rooms",
    },
    "Conference Center": {
      icon: <i class="fa-solid fa-person-chalkboard"></i>,
      label: "Conference",
    },
    "24-hour security": {
      icon: <i class="fa-solid fa-person-military-rifle"></i>,
      label: "24-hour security",
    },
    Sauna: {
      icon: <i class="fa-solid fa-soap"></i>,
      label: "24-hour security",
    },
  };

  return (
    <div className="col-lg-12 mt-3 mb-3">
      <div className="border-b border-gray-300 pb-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Amenities</h2>
        <div id="topAmenities">
          <div className="grid grid-cols-3 gap-y-5">
            {facilitiesToShow.map((item, index) => {
              const amenity = amenitiesMap[item];
              return (
                amenity && (
                  <p key={index} className="flex flex-row items-center gap-2">
                    {amenity.icon} {amenity.label}
                  </p>
                )
              );
            })}
          </div>
          {facilities.length > initialDisplayCount && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-blue-500 hover:underline"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TboAmenities;
