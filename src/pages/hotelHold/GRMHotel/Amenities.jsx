import { ScissorsLineDashed, Vault } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Amenities = () => {
  const reducerState = useSelector((state) => state);
  const hotelinfoGRN =
    reducerState?.hotelSearchResultGRN?.hotelRoom?.hotel ||
    reducerState?.hotelSearchResultGRN?.hotelDetails?.data?.data?.hotel;
  const [showAll, setShowAll] = useState(false);
  const facilities =
    hotelinfoGRN?.facilities?.split(";")?.map((item) => item.trim()) || [];
  const initialDisplayCount = 10;
  const facilitiesToShow = showAll
    ? facilities
    : facilities.slice(0, initialDisplayCount);

  return (
    <div className="col-lg-12 mt-3 mb-3">
      <div className="border-b border-gray-300  pb-4 ">
        <h2 class="mb-3 text-lg font-semibold text-gray-900 ">Amenities</h2>
        <div className="" id="topAmenities">
          <div className="grid grid-cols-3 gap-y-5">
            {[
              ...new Set(facilitiesToShow.map((item) => item?.toLowerCase())),
            ].map((item) => {
              return (
                <>
                  {item?.toLowerCase() === "air conditioning" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-regular fa-snowflake"></i> Air Condition
                    </p>
                  )}
                  {item?.toLowerCase() === "roof terrace" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-people-roof"></i>
                      Roof terrace
                    </p>
                  )}
                  {item?.toLowerCase() === "grocery store" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-basket-shopping"></i>Grocery store
                    </p>
                  )}
                  {item?.toLowerCase() === "tennis court" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-table-tennis-paddle-ball"></i>
                      Tennis court
                    </p>
                  )}
                  {item?.toLowerCase() === "lounges/bars" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-wine-bottle"></i> Lounges/bars
                    </p>
                  )}
                  {item?.toLowerCase() === "elevators" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-elevator"></i> Elevators
                    </p>
                  )}
                  {item?.toLowerCase() === "indoor pool" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-water-ladder"></i> Indoor Pool
                    </p>
                  )}
                  {item?.toLowerCase() === "concierge desk" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-inbox"></i> Concierge desk
                    </p>
                  )}
                  {item?.toLowerCase() === "indoor pool" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-water-ladder"></i> Indoor Pool
                    </p>
                  )}
                  {item?.toLowerCase() === "outdoor pool" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-water-ladder"></i> Outdoor Pool
                    </p>
                  )}
                  {item?.toLowerCase() === "shopping mall" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-cart-shopping"></i> Shopping mall
                    </p>
                  )}
                  {item?.toLowerCase() === "conference facilities" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-person-chalkboard"></i>
                      Conference facilities
                    </p>
                  )}

                  {item?.toLowerCase() ===
                    "complimentary newspaper delivered to room" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-regular fa-newspaper"></i>Newspaper in room
                    </p>
                  )}
                  {item?.toLowerCase() ===
                    "complimentary in-room coffee or tea" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-mug-hot"></i>in-room coffee or tea
                    </p>
                  )}
                  {item?.toLowerCase() === "housekeeping - daily" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-broom"></i>
                      House Keeping
                    </p>
                  )}

                  {item?.toLowerCase() === "hair dryer" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-wind"></i>
                      Hair Dryer
                    </p>
                  )}
                  {item?.toLowerCase() === "safe deposit box" && (
                    <p className="flex flex-row items-center gap-2">
                      <Vault className="w-6 h-6 " />
                      Safe Deposit Box
                    </p>
                  )}

                  {item?.toLowerCase() === "laundry/valet service" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-jug-detergent"></i> Laundry
                    </p>
                  )}
                  {item?.toLowerCase() === "poolside snack bar" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-water-ladder"></i> Poolside snack
                      bar
                    </p>
                  )}
                  {item?.toLowerCase() === "spa" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-spa"></i> Spa
                    </p>
                  )}
                  {item?.toLowerCase() ===
                    "complimentary newspaper in lobby" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-regular fa-newspaper"></i>Newspaper in lobby
                    </p>
                  )}

                  {item?.toLowerCase() === "bell staff/porter" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-bell-concierge"></i> Bell
                      staff/porter
                    </p>
                  )}
                  {item?.toLowerCase() === "express check-out" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-regular fa-credit-card"></i> Express Check
                      out
                    </p>
                  )}
                  {item?.toLowerCase() === "wedding services" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-gift"></i> Wedding services
                    </p>
                  )}
                  {item?.toLowerCase() === "express check-in" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-calendar-check"></i> Express
                      Check-in
                    </p>
                  )}
                  {item?.toLowerCase() === "guestroom wired internet" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-globe"></i>wired Internet
                    </p>
                  )}
                  {item?.toLowerCase() ===
                    "complimentary wireless internet" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-globe"></i> wireless internet
                    </p>
                  )}
                  {item?.toLowerCase() === "24-hour security" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-person-military-rifle"></i>
                      24-hour security
                    </p>
                  )}
                  {item?.toLowerCase() === "room service" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-person-booth"></i>
                      Room service
                    </p>
                  )}
                  {item?.toLowerCase() === "guestroom wireless internet" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-globe"></i> wireless internet
                    </p>
                  )}
                  {item?.toLowerCase() ===
                    "complimentary wireless internet" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-wifi"></i> Wifi
                    </p>
                  )}
                  {item?.toLowerCase() === "restaurant" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-utensils"></i> Restaurant
                    </p>
                  )}
                  {item?.toLowerCase() === "business center" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-business-time"></i> Business Center
                    </p>
                  )}
                  {item?.toLowerCase() === "snack bar" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-cookie-bite"></i>Snack bar
                    </p>
                  )}
                  {item?.toLowerCase() === "valet parking" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-square-parking"></i>Valet parking
                    </p>
                  )}
                  {item?.toLowerCase() === "fitness center" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-dumbbell"></i>Gym/Fitness Room
                    </p>
                  )}
                  {item?.toLowerCase() === "phone services" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-phone-volume"></i>Phone services
                    </p>
                  )}
                  {item?.toLowerCase() === "health club" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-dumbbell"></i>Health club
                    </p>
                  )}
                  {item?.toLowerCase() === "multilingual staff" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-language"></i>Multilingual staff
                    </p>
                  )}
                  {item?.toLowerCase() === "steam bath" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-soap"></i>
                      Steam bath
                    </p>
                  )}
                  {item?.toLowerCase() === "sauna" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-soap"></i>
                      Sauna
                    </p>
                  )}
                  {item?.toLowerCase() === "game room" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-gamepad"></i>
                      Game room
                    </p>
                  )}
                  {item?.toLowerCase() === "shuttle to local attractions" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-bus"></i>
                      Shuttle to local attractions
                    </p>
                  )}
                  {item?.toLowerCase() === "free parking" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-square-parking"></i>
                      Free Parking
                    </p>
                  )}
                  {item?.toLowerCase() === "coffee shop" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-mug-hot"></i>
                      Coffee shop
                    </p>
                  )}
                  {item?.toLowerCase() === "meeting rooms" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-person-chalkboard"></i>
                      Meeting Rooms
                    </p>
                  )}
                  {item?.toLowerCase() === "beauty shop/salon" && (
                    <p className="flex flex-row items-center gap-2">
                      <ScissorsLineDashed className="w-6 h-6" />
                      Beauty shop/salon
                    </p>
                  )}
                  {item?.toLowerCase() === "Wheelchair access" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-wheelchair"></i> Wheelchair access
                    </p>
                  )}
                  {item?.toLowerCase() === "atm/cash machine" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-cash-register"></i> ATM/Cash machine
                    </p>
                  )}
                  {item?.toLowerCase() === "smoke-free property" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-ban-smoking"></i>
                      Smoke-free property
                    </p>
                  )}
                  {item?.toLowerCase() === "ballroom" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-golf-ball-tee"></i>
                      Ball Room
                    </p>
                  )}
                  {item?.toLowerCase() === "pets allowed" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-paw"></i>
                      Pets Allowed
                    </p>
                  )}
                  {item?.toLowerCase() === "cloakroom service" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-fingerprint"></i>
                      Cloakroom service
                    </p>
                  )}
                  {item?.toLowerCase() === "adjoining rooms" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-restroom"></i>
                      Adjoining rooms
                    </p>
                  )}
                  {item?.toLowerCase() === "tour/sightseeing desk" && (
                    <p className="flex flex-row items-center gap-2">
                      <i class="fa-solid fa-binoculars"></i>
                      Tour/sightseeing desk
                    </p>
                  )}
                </>
              );
            })}
          </div>

          {facilities.length > initialDisplayCount && (
            <p
              onClick={() => {
                setShowAll(!showAll);
                const element = document.getElementById("topAmenities");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="mt-3 text-purple font-semibold cursor-pointer"
            >
              {showAll ? "Show Less" : "Show More"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Amenities;
