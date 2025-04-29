import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundDown } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { setReturnSelectedFlight } from "../../Redux/returnSelectedFlight/actionReturnSelectedFlight";
import {
  findAirlineByCode,
  findAirportByCode,
} from "../../utility/flightUtility/BookwarperUtility";
import FlightResultCard from "./FlightResultCard";
import NoResult from "./NoResult";

const OnewayFlightResult = ({
  jornyFlights,
  handleClearAllFilter,
  activeFilterLabels,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChepest, setIsChepest] = useState(true);
  const [selectedFlights, setSelectedFlights] = useState({
    onward: jornyFlights[0],
    // return: retrunFlights[0],
  });
  const [selectedIndex, setSelectedIndex] = useState({
    onward: 0,
    return: 0,
  });
  useEffect(() => {
    setSelectedFlights({
      onward: jornyFlights[0],
      // return: retrunFlights[0],
    });
  }, [jornyFlights]);
  // console.log(selectedFlights, "selected flights");
  function handleSelectedFlightChange(type, flight, index) {
    setSelectedFlights((pre) => {
      const newObj = { ...pre };
      newObj[type] = flight;

      return newObj;
    });
    setSelectedIndex((pre) => {
      const newObj = { ...pre };
      newObj[type] = index;

      return newObj;
    });
  }
  const CardTop = ({ isOnward }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from");
    const to = queryParams.get("to");
    const dDate = queryParams.get("date");
    // const rDate = queryParams.get("retrunDate");
    const Adult = queryParams.get("Adult");
    const Child = queryParams.get("Child");
    const Infant = queryParams.get("Infant");
    const Class = queryParams.get("FlightCabinClass");
    // const Class1 = JSON.parse(queryParams.get("class"));
    const formatDate = (date) => {
      const options = { day: "2-digit", month: "short", year: "2-digit" };
      return date.toLocaleDateString("en-US", options);
    };

    // Initialize with a default date
    const [currentDate, setCurrentDate] = useState(new Date(dDate));
    // console.log(currentDate, "currentdate");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for comparison
    const navigationFun = (pre, next) => {
      // console.log(pre, "preDate");
      const params = {
        from: from,
        to: to,
        date: isOnward ? formatDate(pre) : dDate,
        // retrunDate: isOnward ? rDate : formatDate(pre),
        Adult: Adult,
        Child: Child,
        Infant: Infant,
        class: Class,
        FlightCabinClass: 1,
      };
      const queryString = new URLSearchParams(params).toString();

      navigate(
        `/flight-details/one-way/${from}-${to}/adt${Adult}chd${Child}inf${Infant}?${queryString}`
      );
    };

    const handlePrev = () => {
      const newDate = new Date(dDate);
      newDate.setDate(newDate.getDate() - 1); // Subtract one day

      navigationFun(newDate);
    };

    const handleNext = () => {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 1); // Add one day
        navigationFun(newDate);
        return newDate;
      });
    };

    return (
      <div
        className="flex px-[8px] py-[10px] border-1 border-gray-300 bg-white rounded-md w-full justify-between items-center
      "
      >
        <div className="flex flex-row gap-3 items-center">
          <div className="sm:text-sm md:text-md  xl:text-sm font-semibold ">
            {`${findAirportByCode(from)?.name} → ${
              findAirportByCode(to)?.name
            }`}
          </div>
          <div className="text-[14px] font-semibold">
            ({formatDate(currentDate)})
          </div>
        </div>
        <div className="flex bg-white shadow-md rounded-full items-center justify-center p-1 border-1">
          <button
            onClick={() => handlePrev()}
            disabled={formatDate(currentDate) === formatDate(today)}
            className={`border-r-2 border-r-dashed border-gray-300  text-sm font-semibold px-2 text-center hover:text-primary-6000 cursor-pointer disabled:hover:text-gray-500 disabled:text-gray-500`}
          >
            Previous
          </button>
          <p
            onClick={() => handleNext()}
            className="  text-sm px-2 text-center hover:text-primary-6000 font-semibold cursor-pointer"
          >
            Next
          </p>
        </div>
      </div>
    );
  };
  const MainCard = ({
    data,
    chepest,
    isOnward,
    handleSelectedChange,
    selectedIndex,
  }) => {
    const [sortedData, setSortedData] = useState(data);

    const filterType = {
      flightName: "airlines",
      departureTime: "departure",
      layover: "duration",
      arrivalTime: "arrival",
      price: "price",
    };

    const [selectedType, setSelectedType] = useState("price");

    const handleFilter = (key) => {
      setSelectedType(key);

      const filterAirline = sortedData.sort((a, b) => {
        let sortItem1;
        let sortItem2;
        function parseLayover(layover) {
          const [hours, minutes] = layover.split(/[hm]/).map(Number);
          return hours * 60 + minutes;
        }

        sortItem1 = a?.[key];
        sortItem2 = b?.[key];
        switch (key) {
          case "price":
            return a?.price - b?.price;
          case "flightName":
            return a?.flightName.localeCompare(b?.flightName);
          case "layover":
            return parseLayover(a?.layover) - parseLayover(b?.layover);
          case "departureTime":
            const timeA = a.departureTime.split(":").map(Number);
            const timeB = b.departureTime.split(":").map(Number);

            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
          case "arrivalTime":
            const timeC = a.arrivalTime.split(":").map(Number);
            const timeD = b.arrivalTime.split(":").map(Number);

            return timeC[0] * 60 + timeC[1] - (timeD[0] * 60 + timeD[1]);
        }
      });

      setSortedData(filterAirline);
    };
    return (
      <div className="w-full">
        <CardTop isOnward={isOnward} />

        <div className="flex justify-between items-center text-sm mt-2 p-2">
          {Object.keys(filterType).map((key, index) => {
            return (
              <p
                className={`flex flex-1 gap-1 items-center ${
                  index == 0
                    ? "justify-start"
                    : index == 4
                    ? "justify-end"
                    : "justify-center"
                } capitalize font-medium text-base cursor-pointer hover:text-primary-6000 ${
                  selectedType == key && "text-primary-6000"
                }`}
                onClick={() => handleFilter(key)}
              >
                {filterType?.[key]}{" "}
                {selectedType == key ? <IoIosArrowRoundDown size={15} /> : " "}
              </p>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {data?.map((item, index) => {
            return (
              <FlightResultCard
                handleSelectedChange={handleSelectedChange}
                item={item}
                key={index}
                isOnward={isOnward}
                index={index}
                selectedIndex={selectedIndex}
              />
            );
          })}
        </div>
      </div>
    );
  };
  const handleBook = () => {
    dispatch(setReturnSelectedFlight(selectedFlights));
    navigate("/flight/review-details");
  };

  return (
    <>
      {selectedFlights?.onward?.flightName ? (
        <div className="flex w-full gap-2 flex-col h-full">
          <div className="flex gap-2 w-full h-full">
            <MainCard
              data={jornyFlights}
              chepest={isChepest}
              isOnward={true}
              handleSelectedChange={handleSelectedFlightChange}
              selectedIndex={selectedIndex}
            />
          </div>
        </div>
      ) : (
        <NoResult
          handleClearAllFilter={handleClearAllFilter}
          activeFilterLabels={activeFilterLabels}
        />
      )}
    </>
  );
};

export default OnewayFlightResult;
