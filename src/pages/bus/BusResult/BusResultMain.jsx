import React, { useState, useEffect } from "react";
import BusResult from "./BusResult";
import "./busresult.scss";
import { EditOutlined } from "@ant-design/icons";
import { FaPen } from "react-icons/fa";
import BusFormInner from "../BusFormInner";
import BusFilterBig from "./BusFilterBig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { swalModal } from "../../../utility/swal";
import BusResultSkeleton from "./BusResultSkeleton";
import BusFilterSmall from "./BusFilterSmall";

const BusResultMain = () => {
  const reducerState = useSelector((state) => state);
  const navigate = useNavigate();
  const busData =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
      ?.BusResults;
  const [filteredData, setFilteredData] = useState(busData);
  const [loader, setLoader] = useState(true);
  const [errors, setErrors] = useState(false);
  const busSessionData = JSON.parse(sessionStorage.getItem("busOnewayData"));

  useEffect(() => {
    if (
      reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
        ?.ErrorMessage === "No Result Found."
    ) {
      swalModal("bus", "No Result Found", true);
      navigate("/bus");
    }
  });

  useEffect(() => {
    if (
      reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
        ?.BusResults?.length > 0
    ) {
      setFilteredData(
        reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
          ?.BusResults
      );
      setLoader(false);
    }
  }, [
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
      ?.BusResults,
  ]);

  const handleFilter = (filters) => {
    let filtered = busData;

    // Filter by bus type
    if (filters?.busType?.length > 0) {
      console.log(filters?.busType);
      filtered = filtered.filter((bus) => {
        return filters.busType.some((type) => {
          if (type === "A/C") {
            return !bus.BusType.toLowerCase().includes("non a/c");
          } else {
            return bus.BusType.toLowerCase().includes(type.toLowerCase());
          }
        });
      });
    }

    // Filter by departure time
    if (filters?.departureTime?.length > 0) {
      filtered = filtered.filter((bus) => {
        const departureHour = new Date(bus.DepartureTime).getHours();
        return filters.departureTime.some((time) => {
          if (time === "before6am") return departureHour < 6;
          if (time === "6amTo12pm")
            return departureHour >= 6 && departureHour < 12;
          if (time === "12pmTo6pm")
            return departureHour >= 12 && departureHour < 18;
          if (time === "after6pm") return departureHour >= 18;
          return false;
        });
      });
    }

    // Filter by arrival time
    if (filters?.arrivalTime?.length > 0) {
      filtered = filtered.filter((bus) => {
        const arrivalHour = new Date(bus.ArrivalTime).getHours();
        return filters.arrivalTime.some((time) => {
          if (time === "before6am") return arrivalHour < 6;
          if (time === "6amTo12pm") return arrivalHour >= 6 && arrivalHour < 12;
          if (time === "12pmTo6pm")
            return arrivalHour >= 12 && arrivalHour < 18;
          if (time === "after6pm") return arrivalHour >= 18;
          return false;
        });
      });
    }

    // Filter by price range
    if (filters?.priceRange) {
      filtered = filtered.filter(
        (bus) =>
          bus.BusPrice.PublishedPriceRoundedOff >= filters.priceRange[0] &&
          bus.BusPrice.PublishedPriceRoundedOff <= filters.priceRange[1]
      );
    }

    // Filter by Travel Name
    if (filters?.travelName?.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.travelName.includes(bus.TravelName)
      );
    }

    // Filter by Boarding Location
    if (filters?.boardingLocation?.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.boardingLocation.some((location) =>
          bus.BoardingPointsDetails.some(
            (point) =>
              point.CityPointLocation.toLowerCase() === location.toLowerCase()
          )
        )
      );
    }

    // Filter by Dropping Location
    if (filters?.droppingLocation?.length > 0) {
      filtered = filtered.filter((bus) =>
        filters.droppingLocation.some((location) =>
          bus.DroppingPointsDetails.some(
            (point) =>
              point.CityPointLocation.toLowerCase() === location.toLowerCase()
          )
        )
      );
    }

    // Sort by price
    if (filters?.sortPrice) {
      filtered = filtered.sort((a, b) =>
        filters.sortPrice === "lowToHigh"
          ? a.BusPrice.PublishedPriceRoundedOff -
            b.BusPrice.PublishedPriceRoundedOff
          : b.BusPrice.PublishedPriceRoundedOff -
            a.BusPrice.PublishedPriceRoundedOff
      );
    }

    setFilteredData(filtered);
  };

  if (loader) {
    return <BusResultSkeleton />;
  }

  return (
    <div className="bg-indigo-50">
      <div className="mainimgHotelSearchResult visibleBigHotel  ">
        <BusFormInner setLoader={setLoader} loader={loader} />
      </div>

      {/* <div className=" visibleSmall stickyHotelDetails">
        <section
          style={{ borderTop: "1px solid lightgray", background: "white" }}
        >
          <div className="container ">
            <div className="smallHotelEditBox">
              <div className="smallHotelEditDetails">
                <p>
                  {busSessionData?.[0]?.CityName}-
                  {busSessionData?.[1]?.CityName}{" "}
                </p>
                <p>{busSessionData?.[2]}</p>
              </div>
              <div
                onClick={() => {
                  navigate("/bus");
                }}
              >
                <EditOutlined />
              </div>
            </div>
          </div>
        </section>
      </div> */}

      <div className="container mt-3">
        {errors ? (
          <div className="row">
            <div className="noHotels">
              <h3>No result found for the requested search criteria !</h3>
              <p>
                Please Modify Your search <FaPen />
              </p>
            </div>
          </div>
        ) : (
          <div className="row paddingCustom">
            <div className="p-0 col-lg-3 visibleBig">
              <BusFilterBig
                onFilter={handleFilter}
                busData={busData}
                // minPrice={minPrice}
                // maxPrice={maxPrice}
              />
            </div>
            {/* <div className="col-lg-12 visibleSmall stikcyHotelFilter">
                                <BusFilterSmall
                                    onFilter={handleFilter}
                                    busData={busData}
                                
                                />
                            </div> */}
            <div className=" col-lg-9 col-md-12">
              <BusResult filteredData={filteredData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusResultMain;
