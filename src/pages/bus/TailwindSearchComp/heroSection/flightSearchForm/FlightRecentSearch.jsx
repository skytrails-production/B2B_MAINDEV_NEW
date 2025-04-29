import { MoveRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFlight } from "../../../../Redux/SearchFlight/actionSearchFlight";
import { useNavigate } from "react-router-dom";
import {
  findAirlineByCode,
  findAirportByCode,
} from "../../../../utility/flightUtility/BookwarperUtility";

import dayjs from "dayjs";

const RecentSearches = () => {
  const [searches, setSearches] = useState([]);

  const flightClass = [
    { id: 2, value: "Y", label: "Economy" },
    { id: 3, value: "W", label: "Premium Economy" },
    { id: 4, value: "C", label: "Business class" },
    { id: 6, value: "F", label: "First class" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  let storedSearches =
    JSON.parse(localStorage.getItem("homeRecentSearch")) || [];

  const [recentSearchesFrom, setRecentSearchesFrom] = useState(
    JSON.parse(localStorage.getItem("FlightRecentSearchesFrom")) || []
  );

  const [recentSearchesTo, setRecentSearchesTo] = useState(
    JSON.parse(localStorage.getItem("FlightRecentSearchesTo")) || []
  );
  function updateToCurrentDate(inputDate) {
    const parsedDate = dayjs(inputDate, "DD MMM, YY");
    const today = dayjs().startOf("day");
    if (parsedDate.isBefore(today)) {
      return today.format("DD MMM, YY");
    }

    return inputDate;
  }

  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("homeRecentSearch")) || [];
    setSearches(storedSearches);
  }, []);

  const handleSubmit = async (search) => {
    sessionStorage.setItem("SessionExpireTime", new Date());
    // const parsedDate = new Date(search?.newDepartDate);
    // const formattedDate = parsedDate.toISOString();
    // for from

    const updatedRecentSearchesFrom = [
      search.fromDetails,
      ...recentSearchesFrom.filter(
        (item) => item._id !== search.fromDetails._id
      ),
    ].slice(0, 5);

    // setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "FlightRecentSearchesFrom",
      JSON.stringify(updatedRecentSearchesFrom)
    );
    // for from

    const updatedRecentSearchesTo = [
      search.toDetails,
      ...recentSearchesTo.filter((item) => item._id !== search?.toDetails?._id),
    ].slice(0, 5);

    localStorage.setItem(
      "FlightRecentSearchesTo",
      JSON.stringify(updatedRecentSearchesTo)
    );
    // const searchpy = {
    //   from: { ...search?.selectedFrom },
    //   to: { ...search?.selectedTo },
    //   FlightCabinClass: "Y",
    //   date: formattedDate,
    // };

    // dispatch(searchFlight(searchpy));

    sessionStorage.setItem("adults", search?.Adult);
    sessionStorage.setItem("childs", search?.Child);
    sessionStorage.setItem("infants", search?.Infant);
    const params = {
      from: search?.from,
      to: search?.to,

      date: updateToCurrentDate(search?.date),
      // retrunDate: returnDate,
      Adult: search?.Adult,
      Child: search?.Child,
      Infant: search?.Infant,

      class: search?.class,
      FlightCabinClass: search?.FlightCabinClass,
    };

    // const isDuplicate = storedSearches.some(
    //   (search) => search.date === params.date
    // );
    // if (!isDuplicate) {
    //   storedSearches.push(params);
    //   if (storedSearches.length > 5) {
    //     storedSearches.shift();
    //   }
    //   localStorage.setItem("homeRecentSearch", JSON.stringify(storedSearches));
    // }
    const queryString = new URLSearchParams(params).toString();

    navigate(`/flightlist?${queryString}`);

    // dispatch(returnAction(payload));
  };
  // console.log(searches, "searches");
  return (
    <div className="container mx-auto mt-10">
      <div className="flex flex-row gap-4 py-2 overflow-x-auto">
        {searches
          .slice()
          .reverse()
          .slice(0, 4)
          .map((search, index) => {
            return (
              <div
                key={index}
                className="bg-white p-2 rounded-lg border shadow-md flex gap-2 justify-between items-center cursor-pointer hover:bg-blue-100 transition duration-200"
                onClick={() => handleSubmit(search)}
              >
                <div>
                  <h3 className="text-sm flex flex-nowrap whitespace-nowrap gap-2  items-center mb-0 font-semibold">
                    {findAirportByCode(search?.from)?.name}
                    <MoveRight className="w-4 h-4" />
                    {findAirportByCode(search?.to)?.name}
                  </h3>
                  <p className="text-gray-600 text-sm ">
                    {updateToCurrentDate(search?.date)}
                  </p>
                  <p className="text-gray-500 text-xs ">
                    {search?.Adult} Adult, {search?.Child} Child,{" "}
                    {search?.Infant} Infant
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <span className="bg-primary-6000 hover:bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    →
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default RecentSearches;
