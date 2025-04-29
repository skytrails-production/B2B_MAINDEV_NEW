import {
  BedDouble,
  BookImage,
  Car,
  CheckCheck,
  CloudMoon,
  Coffee,
  CookingPot,
  HandPlatter,
  Image,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
} from "lucide-react";
import React, { useState } from "react";
import { Accordion, Carousel } from "flowbite-react";
import dayjs from "dayjs";

const HolidayDetTabsSection = ({ packageData, setIsOpen, stayType }) => {
  const [filterType, setFilterType] = useState("Itinerary");

  // Generate filterOptions dynamically based on the data

  // console.log(packageData, "packgea data");
  const filterOptions = ["Itinerary"];
  if (
    packageData?.detailed_ltinerary?.some(
      (day) => day.transferEvents.length > 0
    )
  ) {
    filterOptions.push("Transfers");
  }
  if (
    packageData?.detailed_ltinerary?.some(
      (day) => !day.flightEvents?.[0]?.from == ""
    )
  ) {
    filterOptions.push("Flights");
  }
  if (packageData?.images?.activities.length > 0) {
    filterOptions.push("Activities");
  }
  if (packageData?.images?.stays.length > 0) {
    filterOptions.push("Stay");
  }

  const renderContent = () => {
    const filteredDays = packageData?.detailed_ltinerary?.filter((day) => {
      if (filterType === "Transfers") {
        return day.transferEvents.length > 0;
      }
      if (filterType === "Flights") {
        return !day.flightEvents?.[0]?.from == "";
      }
      if (filterType === "Activities") {
        // Check if the day exists in packageData.images.activities
        return packageData?.images?.activities?.some(
          (activity) => activity.itineraryDay === day.dayNumber
        );
      }
      if (filterType === "Stay") {
        // Check if the day exists in packageData.images.stays
        return packageData?.images?.stays?.some(
          (stay) => stay.itineraryDay === day.dayNumber
        );
      }
      return true; // For "Itinerary", show all days
    });

    return (
      <Accordion className="divide-none border-0">
        {filteredDays?.map((item, index) => (
          <Accordion.Panel className="mb-2" key={index}>
            <Accordion.Title className="mb-2 focus:ring-0 flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-800 border border-gray-200 hover:bg-gray-100 gap-3 rounded-lg">
              <div className="flex flex-row gap-2 items-center">
                <span className="px-2 py-1 text-sm rounded-2xl bg-primary-6000 text-white font-semibold">
                  Day {item.dayNumber}
                </span>
                <span className="text-sm font-semibold">
                  {index === 0
                    ? `Arrival in ${item.title}`
                    : index === filteredDays.length - 1
                    ? `Departure from ${item.title}`
                    : item.title}
                </span>
              </div>
            </Accordion.Title>
            <Accordion.Content className="p-0">
              <div className="p-2 py-4 border border-gray-200 rounded-md mb-2">
                {filterType === "Itinerary" && (
                  <>
                    {item?.itineraryImages.length > 0 &&
                      renderIteneraryImageDetails(item.itineraryImages)}

                    <p className="text-gray-900 text-sm mb-4 leading-6">
                      {item.description.split(/({.*?})/).map((part, index) => {
                        if (part.startsWith("{") && part.endsWith("}")) {
                          const content = part.slice(1, -1); // Remove the curly braces
                          return (
                            <span key={index} className="relative ">
                              <a
                                href={`https://www.google.com/search?q=${content}`}
                                target="_blank"
                                className=" relative z-10 font-medium text-gray-900 no-underline"
                              >
                                {content}
                              </a>

                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                className="absolute left-0 -bottom-2"
                                viewBox="1.12 15.21 72.99 6.56"
                                // preserveAspectRatio="xMidYMid meet"
                                version="1.0"
                                style={{
                                  width: "80%",
                                }}
                              >
                                <defs>
                                  <clipPath id="clipPath2">
                                    <path
                                      d="M 1 15.21875 L 74.503906 15.21875 L 74.503906 21.878906 L 1 21.878906 Z M 1 15.21875"
                                      clipRule="nonzero"
                                    />
                                  </clipPath>
                                </defs>
                                <g clipPath="url(#clipPath2)">
                                  <path
                                    fill="#df6011"
                                    d="M 59.65625 15.210938 L 59.429688 15.210938 C 46.730469 15.238281 37.152344 15.472656 30.695312 15.910156 C 28.171875 16.070312 25.875 16.257812 23.796875 16.46875 C 17.363281 17.179688 12.765625 17.734375 10.003906 18.128906 C 8.371094 18.355469 6.941406 18.570312 5.71875 18.773438 C 4.851562 18.886719 3.484375 19.164062 1.617188 19.605469 C 0.894531 20.15625 0.964844 20.597656 1.828125 20.9375 C 4.601562 20.308594 7.410156 19.816406 10.25 19.464844 C 16.199219 18.664062 21.816406 18.019531 27.105469 17.527344 C 23.703125 17.925781 19.71875 18.484375 15.152344 19.203125 C 14.980469 19.234375 14.847656 19.3125 14.742188 19.433594 C 14.0625 19.558594 13.285156 19.734375 12.410156 19.957031 C 11.5625 20.167969 11.117188 20.457031 11.074219 20.828125 C 10.929688 21.328125 11.207031 21.644531 11.902344 21.773438 C 12.300781 21.773438 12.949219 21.710938 13.855469 21.59375 C 21.558594 20.460938 26.78125 19.707031 29.519531 19.332031 C 30.503906 19.179688 32.328125 18.964844 34.984375 18.679688 C 38.277344 18.492188 42.691406 18.375 48.226562 18.328125 C 56.664062 18.304688 64.195312 18.378906 70.816406 18.546875 C 71.773438 18.550781 72.519531 18.53125 73.054688 18.480469 C 74.011719 18.242188 74.316406 17.8125 73.976562 17.179688 C 73.878906 16.863281 73.125 16.648438 71.71875 16.539062 C 71.90625 16.003906 71.769531 15.664062 71.304688 15.515625 C 70.3125 15.40625 69.179688 15.339844 67.902344 15.3125 C 65.195312 15.269531 62.160156 15.242188 58.796875 15.210938 L 59.65625 15.210938"
                                    fillOpacity="1"
                                    fillRule="nonzero"
                                  />
                                </g>
                              </svg>
                            </span>
                          );
                        }
                        return <span key={index}>{part}</span>;
                      })}
                    </p>

                    {item.transferEvents.length > 0 &&
                      renderTransferDetails(item.transferEvents)}
                    {packageData?.images?.activities.length > 0 &&
                      renderActivityDetails(
                        packageData?.images?.activities,
                        item.dayNumber
                      )}
                    {packageData?.images?.stays.length > 0 &&
                      renderHotelDetails(
                        packageData?.images?.stays,
                        item.dayNumber
                      )}
                    {!item.flightEvents?.[0]?.from == "" &&
                      renderFlightDetails(item.flightEvents)}
                  </>
                )}
                {filterType === "Transfers" &&
                  renderTransferDetails(item.transferEvents)}
                {filterType === "Activities" &&
                  renderActivityDetails(
                    packageData?.images?.activities,
                    item.dayNumber
                  )}
                {filterType === "Stay" &&
                  renderHotelDetails(
                    packageData?.images?.stays,
                    item.dayNumber
                  )}
                {filterType === "Flights" &&
                  renderFlightDetails(item.flightEvents)}
              </div>
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    );
  };

  const renderTransferDetails = (transfers) => (
    <div className=" pt-3 border-b border-gray-300 pb-4">
      <div className="flex flex-row items-center gap-2">
        <Car className="h-6 w-6 text-purple" />
        <span className="text-sm"> Private Transfer</span>
      </div>
      {transfers?.map((name, i) => (
        <div key={i}>
          <div className="mt-2">
            <span className="text-sm font-semibold "> {name?.title}</span>
          </div>

          <div className="mx-auto mt-3 mb-2 relative">
            {/* From Input */}
            <div className="relative flex items-center space-x-4 mb-2">
              <MapPin className="text-gray-600 w-6 h-6" />
              <div className=" absolute -left-1 top-[2.5rem]  justify-center items-center">
                <div className="h-12 border-l border-dashed border-gray-500"></div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 font-semibold mb-1">
                  From
                </label>

                <div className="w-full border rounded-lg px-2 py-2 bg-violet-100  text-gray-900">
                  <p className="m-0 text-sm">
                    {name?.fromLocation.toLowerCase() == "hotel"
                      ? `${stayType} hotel`
                      : name?.fromLocation}
                  </p>
                </div>
              </div>
            </div>
            {/* To Input */}
            <div className="relative flex items-center space-x-4">
              <MapPin className="text-gray-600 w-6 h-6" />
              <div className="flex-1">
                <label className="block text-sm text-gray-500 font-semibold mb-1">
                  To
                </label>
                <div className="w-full border rounded-lg px-2 py-2 bg-violet-100  text-gray-900">
                  <p className="m-0 text-sm">
                    {name?.toLocation.toLowerCase() == "hotel"
                      ? `${stayType} hotel`
                      : name?.toLocation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlightDetails = (flights) => (
    <div className=" pt-3 border-b border-gray-300 pb-4">
      <div className="flex flex-row items-center gap-2">
        <Plane className="h-6 w-6 text-purple" />
        <span className="text-sm"> Flight Included</span>
      </div>
      {flights?.map((flgt, f) => (
        <div>
          <div className="mt-2">
            <span className="text-sm font-semibold ">
              {" "}
              {flgt?.fromAirPortCode} - {flgt?.toAirPortCode}
            </span>
          </div>

          <div className="mx-auto mt-3 relative">
            <div className="relative flex items-center space-x-4 mb-2">
              <PlaneTakeoff className="text-gray-600 w-6 h-6" />
              <div className=" absolute -left-1 top-[2.5rem]  justify-center items-center">
                <div className="h-12 border-l border-dashed border-gray-500"></div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 font-semibold mb-1">
                  From
                </label>

                <div className="w-full border rounded-lg px-2 py-2 bg-violet-100  text-gray-900">
                  <p className="m-0 text-sm">{flgt?.from}</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center space-x-4">
              <PlaneLanding className="text-gray-600 w-6 h-6" />
              <div className="flex-1">
                <label className="block text-sm text-gray-500 font-semibold mb-1">
                  To
                </label>
                <div className="w-full border rounded-lg px-2 py-2 bg-violet-100  text-gray-900">
                  <p className="m-0 text-sm">{flgt?.to}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivityDetails = (activities, dayNumber) => {
    const filteredActivities = activities.filter(
      (activity) => activity.itineraryDay === dayNumber
    );

    return (
      <div className=" pt-3">
        {filteredActivities?.length > 0 && (
          <div className="flex flex-row items-center gap-2">
            <BookImage className="h-6 w-6 text-purple" />
            <span className="text-sm"> Activity Details</span>
          </div>
        )}
        {filteredActivities?.map((act, ae) => (
          <div key={ae}>
            <div className="my-3">
              <span className="text-sm font-semibold ">{act?.title}</span>
            </div>

            {act?.Images.length > 0 && renderIteneraryImageDetails(act?.Images)}

            {/* <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="relative">
              <img
                src={act?.images?.[0]}
                alt="Eldorado Guest House"
                className="w-full h-96 object-cover rounded-md"
              />
              <span
                onClick={() => setIsOpen(true)}
                className=" cursor-pointer flex items-center gap-2 absolute bottom-4 right-4 rounded-lg bg-white text-gray-800 font-semibold p-2  text-sm"
              >
                <Image size={16} /> View all images
              </span>
            </div>
          </div> */}
          </div>
        ))}
      </div>
    );
  };
  const renderIteneraryImageDetails = (image) => (
    <div className=" py-3">
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <Carousel pauseOnHover>
          {image?.map((item, index) => (
            <img src={item} alt={index} key={index} />
          ))}
        </Carousel>
      </div>
    </div>
  );

  const renderHotelDetails = (hotels, dayNumber) => {
    const filteredHotels = hotels?.filter(
      (hotel) =>
        hotel.hotelType === stayType && hotel.itineraryDay === dayNumber
    );

    return (
      <>
        {filteredHotels?.length > 0 && (
          <div className="pt-3 border-b border-gray-300 pb-4">
            {filteredHotels?.length > 0 && (
              <div className="flex flex-row items-center gap-2">
                <BedDouble className="h-6 w-6 text-purple" />
                <span className="text-sm"> Your stay will be at</span>
              </div>
            )}
            {filteredHotels?.length > 0 &&
              filteredHotels.map((hotel, i) => {
                // Find the relevant stay from packageData
                return (
                  <div key={i}>
                    <div className="my-2">
                      <span className="text-sm font-semibold">
                        {hotel?.hotelName} - {hotel?.hotelType}
                      </span>
                    </div>

                    <div className="relative flex justify-between items-center border bg-violet-100 rounded-md p-4 mb-4">
                      <div className="absolute w-[30%] left-[35%] md:w-[70%] md:left-[15%] lg:w-[70%] lg:left-[15%] xl:w-[70%] xl:left-[15%] top-10 justify-center items-center">
                        <div className="w- border-t border-dashed border-gray-500"></div>
                      </div>
                      <div className="text-sm md:text-base">
                        <span>Check-In</span>
                        <p className="font-medium">
                          {dayjs(hotel.checkIn, "HH:mm").format("hh:mm A")}
                        </p>
                      </div>
                      <div className="text-sm md:text-base -top-3 text-center bg-violet-100 relative z-10 px-3 flex flex-row gap-2 items-center">
                        <span>{hotel?.numberOfNights}N</span>
                        <CloudMoon className="text-gray-600 w-[1.3rem] h-[1.3rem]" />
                      </div>
                      <div className="text-sm md:text-base">
                        <span>Check-Out</span>
                        <p className="font-medium">
                          {dayjs(hotel.checkOut, "HH:mm").format("hh:mm A")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-violet-100 p-3 rounded-md mb-3">
                      <h3 className="text-gray-800 text-sm font-semibold mb-4">
                        You will get
                      </h3>
                      <div className="flex justify-between space-x-4 text-sm md:text-base">
                        <div className="grow flex flex-col items-center space-x-1 border-r border-gray-500 last:border-r-0 pr-4">
                          <div className="flex items-center space-x-1">
                            <Coffee className="text-gray-600 w-[1.3rem] h-[1.3rem]" />
                            <span>Breakfast </span>
                          </div>
                          {hotel?.mealsIncluded?.[0]
                            .toLowerCase()
                            .includes("breakfast") ? (
                            <div className="flex flex-row items-center gap-2">
                              <CheckCheck className="text-green-400 w-[1.3rem] h-[1.3rem]" />
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                included
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-row items-center gap-2">
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                not included
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="grow flex flex-col items-center space-x-1 border-r border-gray-500 last:border-r-0 pr-4">
                          <div className="flex items-center space-x-1">
                            <CookingPot className="text-gray-600 w-[1.3rem] h-[1.3rem]" />
                            <span>Lunch</span>
                          </div>
                          {hotel?.mealsIncluded?.[0]
                            .toLowerCase()
                            .includes("lunch") ? (
                            <div className="flex flex-row items-center gap-2">
                              <CheckCheck className="text-green-400 w-[1.3rem] h-[1.3rem]" />
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                included
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-row items-center gap-2">
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                not included
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="grow flex flex-col items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            <HandPlatter className="text-gray-600 w-[1.3rem] h-[1.3rem]" />
                            <span>Dinner</span>
                          </div>
                          {hotel?.mealsIncluded?.[0]
                            .toLowerCase()
                            .includes("dinner") ? (
                            <div className="flex flex-row items-center gap-2">
                              <CheckCheck className="text-green-400 w-[1.3rem] h-[1.3rem]" />
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                included
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-row items-center gap-2">
                              <span className="text-xs sm:text-xs md:text-sm lg:text-sm">
                                not included
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {hotel?.Images.slice(0, 2).map((image, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={image}
                            alt={hotel.name}
                            className="w-full h-60 object-cover rounded-md"
                          />
                          {idx === 1 && ( // Show the button only on the second image
                            <span className="flex items-center gap-2 absolute bottom-4 right-4 rounded-lg bg-white text-gray-800 font-semibold p-2 text-sm">
                              <Image size={16} /> View all images
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <div className="flex justify-start space-x-4 mb-4 p-2 rounded-md bg-gray-200 overflow-auto sm:overflow-hidden sm:overflow-x-scroll">
        {filterOptions.map((type) => (
          <button
            key={type}
            className={`px-4 flex flex-row items-center gap-1 py-2 font-semibold text-sm md:text-md lg:text-md xl:text-md ${
              filterType === type
                ? "bg-primary-6000 hover:bg-primary-700 text-white border rounded-md"
                : "text-black"
            }`}
            onClick={() => setFilterType(type)}
          >
            {type}{" "}
            {type === "Flights" ? (
              <Plane
                className={`h-5 w-5  ${
                  filterType === type ? "text-white" : "text-black"
                }`}
              />
            ) : type === "Stay" ? (
              <BedDouble
                className={`h-5 w-5  ${
                  filterType === type ? "text-white" : "text-black"
                }`}
              />
            ) : type === "Transfers" ? (
              <Car
                className={`h-5 w-5  ${
                  filterType === type ? "text-white" : "text-black"
                }`}
              />
            ) : type === "Activities" ? (
              <BookImage
                className={`h-5 w-5  ${
                  filterType === type ? "text-white" : "text-black"
                }`}
              />
            ) : (
              ""
            )}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  );
};

export default HolidayDetTabsSection;
