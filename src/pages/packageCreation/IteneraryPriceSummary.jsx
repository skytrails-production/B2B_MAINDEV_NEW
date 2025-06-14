import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import "./itenary.css"
import { Modal, Input, Select, ConfigProvider, Button } from "antd";
import { CloudUploadOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { apiURL } from "../../Constants/constant";
import axios from "axios";

const IteneraryPriceSummary = () => {
  const reducerState = useSelector((state) => state);
  const [modalVisible, setModalVisible] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState("percentage");
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [grandTotalPrice, setGrandTotalPrice] = useState(0);
  const [withoutMarkup, setWithoutMarkup] = useState(0);
  const [isMarkupApplied, setIsMarkupApplied] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  console.log(reducerState, "reducerState");
  const markUpHotel =
    reducerState?.markup?.markUpData?.data?.result[0]?.hotelMarkup;

  const hotelTotal = reducerState?.Itenerary?.selectedHotelRoom?.reduce(
    (total, room) => {
      console.log(room, "room");
      const roomPrice = Number(
        room?.selectedRoom?.Price?.PublishedPriceRoundedOff
      );
      const markedUpPrice =
        Number(markUpHotel) * Number(roomPrice) + Number(roomPrice);
      console.log(roomPrice, room, "total room");
      return Number(total) + Number(markedUpPrice);
    },
    0
  );

  const markUpFlight =
    reducerState?.markup?.markUpData?.data?.result[0]?.flightMarkup;

  const hotelData = reducerState?.Itenerary;

  let adults = 0;
  let children = 0;
  // let infants = 0;

  hotelData?.itenaryPayload?.RoomGuests?.forEach((data) => {
    adults += data.NoOfAdults;
    children += data.NoOfChild;
  });

  const adultsFlight = sessionStorage.getItem("adults");
  const childrenFlight = sessionStorage.getItem("childs");
  const infants = sessionStorage.getItem("infants");

  const hotelFinalPrice =
    hotelData?.itenaryPayload?.RoomGuests?.length && hotelTotal
      ? Number(hotelData.itenaryPayload.RoomGuests.length * hotelTotal)
      : 0;

  // console.log(hotelTotal, "hotel final price")
  // flight domestic

  const selectedFlightsDomestic = Object.values(
    hotelData?.selectedFlight || {}
  ).flat();
  const totalDomesticPrice = selectedFlightsDomestic
    .filter((item) => item?.payloadReturn)
    .reduce((total, item) => {
      const goingFare = Number(item?.payloadGoing?.Fare?.PublishedFare || 0);
      const returnFare = Number(item?.payloadReturn?.Fare?.PublishedFare || 0);
      const totalFare = goingFare + returnFare;
      const totalFareWithMarkup = totalFare + totalFare * markUpFlight;
      return total + totalFareWithMarkup;
    }, 0);

  // flight domestic

  // flight international

  const selectedFlights = Object.values(hotelData?.selectedFlight || {});
  const totalInternationalPrice = selectedFlights
    .filter((item) => item?.payloadReturnInternational)
    .reduce((total, item) => {
      const publishedFare = Number(
        item?.payloadReturnInternational?.Fare?.PublishedFare || 0
      );
      const totalFare = publishedFare + publishedFare * markUpFlight;
      return total + totalFare;
    }, 0);

  // flight international

  // flight oneway

  const selectedFlightsOneway = Object.values(hotelData?.selectedFlight || {});
  const totalOnewayPrice = selectedFlightsOneway
    .filter((item) => item?.payloadOneway)
    .reduce((total, item) => {
      const publishedFare = Number(
        item?.payloadOneway?.Fare?.PublishedFare || 0
      );
      const totalFare = publishedFare + publishedFare * markUpFlight;
      return total + totalFare;
    }, 0);

  // flight oneway

  // Calculate total activities price and day-wise total
  // Calculate total activities price and day-wise total
  let totalActivitiesPrice = 0;
  const selectedActivities =
    reducerState?.Itenerary?.selectedActivities?.activities;
  const hasActivities =
    selectedActivities && Object.keys(selectedActivities).length > 0;
  const dayWiseTotal = {};

  // Calculate total price for each day
  if (hasActivities) {
    Object.keys(selectedActivities).forEach((cityIndex) => {
      const cityActivities = selectedActivities[cityIndex];
      if (cityActivities) {
        Object.keys(cityActivities).forEach((dayIndex) => {
          const activities = cityActivities[dayIndex];
          if (activities && activities.length > 0) {
            dayWiseTotal[`${cityIndex}-${dayIndex}`] = activities.reduce(
              (acc, activity) => {
                return acc + (activity.price || 0);
              },
              0
            );
            totalActivitiesPrice += dayWiseTotal[`${cityIndex}-${dayIndex}`];
          }
        });
      }
    });
  }
  // Calculate total activities price and day-wise total

  // saving as proposal logic here

  useEffect(() => {
    const initialGrandTotal =
      Number(hotelFinalPrice) +
      Number(totalOnewayPrice) +
      Number(totalDomesticPrice) +
      Number(totalInternationalPrice) +
      Number(totalActivitiesPrice);
    setGrandTotalPrice(initialGrandTotal.toFixed(0));
    setWithoutMarkup(initialGrandTotal.toFixed(0));

    setIsMarkupApplied(false);
  }, [
    hotelFinalPrice,
    totalDomesticPrice,
    totalOnewayPrice,
    totalInternationalPrice,
    totalActivitiesPrice,
    adjustmentValue,
  ]);

  // Function to calculate adjusted price here
  const calculateAdjustedPrice = () => {
    let adjustedPrice =
      Number(hotelFinalPrice) +
      Number(totalOnewayPrice) +
      Number(totalDomesticPrice) +
      Number(totalInternationalPrice) +
      Number(totalActivitiesPrice);

    if (adjustmentType == "percentage") {
      adjustedPrice *= 1 + Number(adjustmentValue) / 100;
    } else if (adjustmentType == "flat") {
      adjustedPrice = Number(adjustedPrice) + Number(adjustmentValue);
    }

    setGrandTotalPrice(adjustedPrice.toFixed(0));
    setIsMarkupApplied(true);
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleOk = () => {
    calculateAdjustedPrice();
    setModalVisible(false);
  };

  // saving as proposal logic here

  // payload logic starts from here

  const extractFlightData = (flight) => {
    const keysToExtract = ["AirlineCode", "Fare", "IsLCC", "ValidatingAirline"];

    const segmentKeysToExtract = [
      "Airline",
      "Destination",
      "Origin",
      "Duration",
    ];

    const fareKeyToExtract = ["PublishedFare"];

    const airlineKeysToExtract = [
      "AirlineCode",
      "AirlineName",
      "FareClass",
      "FlightNumber",
    ];

    const airportKeysToExtract = [
      "AirportName",
      "CityName",
      "CountryName",
      "Terminal",
    ];

    const extractedData = keysToExtract.reduce((obj, key) => {
      if (flight[key] !== undefined) {
        obj[key] = flight[key];
      }
      return obj;
    }, {});

    const extractNestedKeys = (object, keysToExtract) => {
      return keysToExtract.reduce((extracted, key) => {
        if (object[key] !== undefined) {
          extracted[key] = object[key];
        }
        return extracted;
      }, {});
    };

    if (flight.Fare) {
      extractedData.Fare = extractNestedKeys(flight.Fare, fareKeyToExtract);
    }

    if (flight.Segments) {
      extractedData.Segments = flight.Segments.map((segmentGroup) => {
        return segmentGroup.map((segment) => {
          const extractedSegment = segmentKeysToExtract.reduce(
            (segObj, key) => {
              if (segment[key] !== undefined) {
                if (key === "Airline") {
                  segObj[key] = extractNestedKeys(
                    segment[key],
                    airlineKeysToExtract
                  );
                }
                // else if (key === 'Destination' || key === 'Origin') {
                //     segObj[key] = extractNestedKeys(segment[key], segmentKeysToExtract);
                // }
                else {
                  segObj[key] = segment[key];
                }
              }
              return segObj;
            },
            {}
          );
          return extractedSegment;
        });
      });
    }

    return extractedData;
  };

  const extractItenaryPayloadData = (itenaryPayload) => {
    const extractedData = {
      RoomGuests: itenaryPayload.RoomGuests.map((guest) => ({
        NoOfAdults: guest.NoOfAdults,
        NoOfChild: guest.NoOfChild,
        ChildAge: guest.ChildAge,
      })),
      cityAndNight: itenaryPayload.cityAndNight.map((cityNight) => ({
        night: cityNight.night,
        destination: cityNight.from.Destination,
      })),
      leavingFrom: itenaryPayload.leavingFrom.Destination,
      nationality: itenaryPayload.nationality.countryName,
      clientName: itenaryPayload.clientName,
      leavingDate: itenaryPayload.leavingDate,
      interest: itenaryPayload.interest,
      whoisTravelling: itenaryPayload.whoisTravelling,
      ratingData: itenaryPayload.ratingData,
    };
    return extractedData;
  };

  // const createPayload = () => {

  //     console.log(payload, "database");
  // };

  // useEffect(() => {
  //     createPayload();
  // }, []);

  // payload logic starts from here

  const handlePayloadSave = async () => {
    setLoader(true);
    const flightData = [];
    const hotelData = [];
    const flights = reducerState?.Itenerary?.selectedFlight;
    const hotels = reducerState?.Itenerary?.selectedHotelRoom;
    const ItenaryData = reducerState?.Itenerary?.selectedActivities;
    const ItenaryPayloadData = reducerState?.Itenerary?.itenaryPayload;

    if (flights) {
      Object.keys(flights).forEach((key) => {
        const flight = flights[key];
        if (Array.isArray(flight)) {
          flight.forEach((f) => {
            let existingFlight = flightData.find((fd) => fd.id === key);
            if (!existingFlight) {
              existingFlight = { id: key, flightDetails: [] };
              flightData.push(existingFlight);
            }
            if (f.payloadGoing) {
              existingFlight.flightDetails.push(
                extractFlightData(f.payloadGoing)
              );
            }
            if (f.payloadOneway) {
              existingFlight.flightDetails.push(
                extractFlightData(f.payloadOneway)
              );
            }
            if (f.payloadReturn) {
              existingFlight.flightDetails.push(
                extractFlightData(f.payloadReturn)
              );
            }
            if (f.payloadReturnInternational) {
              existingFlight.flightDetails.push(
                extractFlightData(f.payloadReturnInternational)
              );
            }
          });
        } else {
          let existingFlight = flightData.find((fd) => fd.id === key);
          if (!existingFlight) {
            existingFlight = { id: key, flightDetails: [] };
            flightData.push(existingFlight);
          }
          if (flight.payloadGoing) {
            existingFlight.flightDetails.push(
              extractFlightData(flight.payloadGoing)
            );
          }
          if (flight.payloadOneway) {
            existingFlight.flightDetails.push(
              extractFlightData(flight.payloadOneway)
            );
          }
          if (flight.payloadReturn) {
            existingFlight.flightDetails.push(
              extractFlightData(flight.payloadReturn)
            );
          }
          if (flight.payloadReturnInternational) {
            existingFlight.flightDetails.push(
              extractFlightData(flight.payloadReturnInternational)
            );
          }
        }
      });
    }

    if (hotels) {
      hotels.forEach((hotel) => {
        const hotelInfo = {
          HotelAddress: hotel?.HotelAddress,
          Price: hotel?.Price?.PublishedPriceRoundedOff,
          HotelPicture: hotel?.HotelPicture,
          ResultIndex: hotel?.ResultIndex,
          HotelCode: hotel?.HotelCode,
          HotelName: hotel?.HotelName,
          StarRating: hotel?.StarRating,
          HotelLocation: hotel?.HotelLocation,
          HotelCategory: hotel?.HotelCategory,
          selectedRoom: {
            Amenities: hotel?.selectedRoom?.Amenities,
            Inclusion: hotel?.selectedRoom?.Inclusion,
            Amenities: hotel?.selectedRoom?.Amenities,
            RoomTypeName: hotel?.selectedRoom?.RoomTypeName,
            PublishedPriceRoundedOff:
              hotel?.selectedRoom?.Price?.PublishedPriceRoundedOff,
          },
        };
        hotelData.push(hotelInfo);
      });
    }

    const extractItenaryData = (itenararyResult) => {
      return itenararyResult?.map((item) => {
        return {
          _id: item._id,
          destination: item.destination,
          origin: item.origin,
          noOfDays: item.noOfDays,
          dayAt: item.dayAt,
          activities: item.activities,
        };
      });
    };
    const extractedItenaryResult = ItenaryData.itenararyResult
      ? ItenaryData.itenararyResult?.map((item) =>
          extractItenaryData(item.data.result)
        )
      : [];

    const extractedItenaryPayloadData = ItenaryPayloadData
      ? extractItenaryPayloadData(ItenaryPayloadData)
      : {};

    const payload = {
      flightData: flightData,
      hotelDetails: hotelData,
      itenerieData: [
        {
          activities: ItenaryData.activities,
          itenararyResult: extractedItenaryResult,
        },
      ],
      ItenaryPayloadData: extractedItenaryPayloadData,
      // pakageAmount: {
      //     currency: "INR",
      //     amount: Number(grandTotalPrice)
      // },
      priceData: {
        grandTotal: grandTotalPrice,
        markup: Number(grandTotalPrice) - Number(withoutMarkup),
        withoutMarkup: Number(withoutMarkup),
      },
    };

    console.log(payload, " payload");
    try {
      const res = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skyTrails/api/itinerary/proposal/createProposal`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setData(res);

      console.log(res, "res.data");
      if (res.data.statusCode && res.data.result._id) {
        navigate(`/itenaryresult/itenaryDownload/${res.data.result._id}`);
      }
    } catch (error) {}
  };

  // console.log(data, "data in itenary price summary");
  return (
    <div className="w-100 price-summary-container p-2 border-1 rounded-lg">
      <div className="hotelItenarySummary">
        <div className="">
          <h6
            style={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "center",
              padding: "8px",
            }}
          >
            Hotel Price Breakdown
          </h6>
        </div>

        {reducerState?.Itenerary?.selectedHotelRoom.map((item, index) => (
          <div>
            <p
              style={{ fontSize: "13px", fontWeight: "500", textAlign: "left" }}
              className="mb-2"
            >
              Stays in{" "}
              {
                reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[index]
                  ?.from?.Destination
              }
            </p>
            <p
              style={{ fontSize: "13px", fontWeight: "500", textAlign: "left" }}
              className="mb-2"
            >{`${
              hotelData?.itenaryPayload?.RoomGuests?.length
            } Rooms, ${adults} adults  ${
              children.length > 0
                ? `, ${children.length} child${
                    children.length > 1 ? "ren" : ""
                  }`
                : ""
            }`}</p>
            <div className="d-flex justify-content-between align-items-center ">
              <h6
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                Price per Room
              </h6>
              <h6
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                ₹{" "}
                {(
                  Number(
                    item?.selectedRoom?.Price?.PublishedPriceRoundedOff || 0
                  ) +
                  Number(markUpHotel) *
                    Number(
                      item?.selectedRoom?.Price?.PublishedPriceRoundedOff || 0
                    )
                ).toFixed(0) || 0}
              </h6>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h6
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                Total Price
              </h6>
              <h6
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                ₹{" "}
                {(
                  (hotelData?.itenaryPayload?.RoomGuests?.length || 0) *
                    Number(
                      item?.selectedRoom?.Price?.PublishedPriceRoundedOff || 0
                    ) +
                  Number(markUpHotel || 0) *
                    Number(
                      item?.selectedRoom?.Price?.PublishedPriceRoundedOff || 0
                    )
                ).toFixed(0) || 0}
              </h6>
            </div>
          </div>
        ))}
      </div>

      {/* domestic return flight  */}

      {hotelData?.selectedFlight && (
        <div>
          <h6
            style={{
              fontSize: "15px",
              fontWeight: "600",
              textAlign: "center",
              padding: "8px",
            }}
          >
            Flight Price Breakdown
          </h6>
        </div>
      )}

      <div>
        {selectedFlights
          .flatMap((item) => item)
          .filter((item) => item?.payloadGoing && item?.payloadReturn)
          .map((item, index) => (
            <div key={index} className="hotelItenarySummary">
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                  className="mb-2"
                >
                  {
                    item?.payloadGoing?.Segments?.[0]?.[0]?.Origin?.Airport
                      ?.CityName
                  }{" "}
                  to{" "}
                  {
                    item?.payloadGoing?.Segments?.[0]?.[
                      item?.payloadGoing?.Segments.length - 1
                    ]?.Destination?.Airport?.CityName
                  }{" "}
                  (Return Flight)
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                  className="mb-2"
                >{` ${adultsFlight} adults  ${
                  childrenFlight > 0
                    ? `, ${childrenFlight} child${
                        childrenFlight > 1 ? "ren" : ""
                      }`
                    : ""
                } ${infants > 0 ? `, ${infants} Infant` : ""}  `}</p>
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      Base Price
                    </h6>
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      ₹{" "}
                      {Number(item.payloadGoing.Fare?.PublishedFare) +
                        Number(item.payloadReturn.Fare?.PublishedFare)}
                    </h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      Total Tax
                    </h6>
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      ₹{" "}
                      {Number(
                        markUpFlight *
                          (item.payloadGoing.Fare?.PublishedFare +
                            item.payloadReturn.Fare?.PublishedFare)
                      ).toFixed(0)}
                    </h6>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      Total Price
                    </h6>
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      ₹{" "}
                      {Number(
                        item.payloadGoing.Fare?.PublishedFare +
                          item.payloadReturn?.Fare?.PublishedFare +
                          markUpFlight *
                            (item.payloadGoing.Fare?.PublishedFare +
                              item.payloadReturn?.Fare?.PublishedFare)
                      ).toFixed(0)}
                    </h6>
                  </div>
                </>
              </div>
            </div>
          ))}
      </div>

      {/* domestic return flight  */}

      {/* international return flight  */}
      <div className="hotelItenarySummary">
        {Object.values(hotelData?.selectedFlight || {})
          .filter((item) => item?.payloadReturnInternational)
          .map((item, index) => (
            <div key={index}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
                className="mb-2"
              >
                {
                  item?.payloadReturnInternational?.Segments?.[0]?.[0]?.Origin
                    ?.Airport?.CityName
                }{" "}
                to{" "}
                {
                  item?.payloadReturnInternational?.Segments?.[0]?.[
                    item?.payloadReturnInternational?.Segments.length - 1
                  ]?.Destination?.Airport?.CityName
                }{" "}
                (Return Flight)
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
                className="mb-2"
              >{` ${adultsFlight} adults  ${
                childrenFlight > 0
                  ? `, ${childrenFlight} child${
                      childrenFlight > 1 ? "ren" : ""
                    }`
                  : ""
              } ${infants > 0 ? `, ${infants} Infant` : ""}  `}</p>

              <>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Base Price
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹{" "}
                    {Number(
                      item.payloadReturnInternational?.Fare?.PublishedFare
                    )}
                  </h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Total Tax
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹{" "}
                    {Number(
                      markUpFlight *
                        item.payloadReturnInternational?.Fare?.PublishedFare
                    ).toFixed(0)}
                  </h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Total Price
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹{" "}
                    {Number(
                      item.payloadReturnInternational?.Fare?.PublishedFare +
                        markUpFlight *
                          item.payloadReturnInternational?.Fare?.PublishedFare
                    ).toFixed(0)}
                  </h6>
                </div>
              </>
            </div>
          ))}
      </div>

      {/* international return flight  */}

      {/* Oneway return flight  */}
      <div className="hotelItenarySummary">
        {Object.values(hotelData?.selectedFlight || {})
          .filter((item) => item?.payloadOneway)
          .map((item, index) => (
            <div key={index}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
                className="mb-2"
              >
                {
                  item?.payloadOneway?.Segments?.[0]?.[0]?.Origin?.Airport
                    ?.CityName
                }{" "}
                to{" "}
                {
                  item?.payloadOneway?.Segments?.[0]?.[
                    item?.payloadOneway?.Segments.length - 1
                  ]?.Destination?.Airport?.CityName
                }
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
                className="mb-2"
              >{` ${adultsFlight} adults  ${
                childrenFlight > 0
                  ? `, ${childrenFlight} child${
                      childrenFlight > 1 ? "ren" : ""
                    }`
                  : ""
              } ${infants > 0 ? `, ${infants} Infant` : ""}  `}</p>

              <>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Base Price
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹ {Number(item.payloadOneway?.Fare?.PublishedFare)}
                  </h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Total Tax
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹{" "}
                    {Number(
                      markUpFlight * item.payloadOneway?.Fare?.PublishedFare
                    ).toFixed(0)}
                  </h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    Total Price
                  </h6>
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      textAlign: "left",
                    }}
                  >
                    ₹{" "}
                    {Number(
                      item.payloadOneway?.Fare?.PublishedFare +
                        markUpFlight * item.payloadOneway?.Fare?.PublishedFare
                    ).toFixed(0)}
                  </h6>
                </div>
              </>
            </div>
          ))}
      </div>

      {/* international return flight  */}

      {hasActivities && (
        <div className="hotelItenarySummary">
          <div className="">
            <h6
              style={{
                fontSize: "15px",
                fontWeight: "600",
                textAlign: "center",
                padding: "8px",
              }}
            >
              Activities Price Breakdown
            </h6>
          </div>
          <div>
            {Object.keys(selectedActivities).map((cityIndex) => {
              const cityActivities = selectedActivities[cityIndex];
              if (!cityActivities) return null;

              return Object.keys(cityActivities).map((dayIndex) => {
                const activities = cityActivities[dayIndex];
                if (!activities || activities.length === 0) return null;

                const dayNumber = parseInt(dayIndex) + 1;
                const cityName =
                  reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[
                    cityIndex
                  ]?.from?.Destination || "Unknown City";

                return (
                  <div
                    className="d-flex justify-content-between align-items-center"
                    key={`${cityIndex}-${dayIndex}`}
                  >
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >{`Day ${dayNumber} in ${cityName}:`}</h6>
                    <h6
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      ₹{" "}
                      {dayWiseTotal[`${cityIndex}-${dayIndex}`]?.toFixed(0) ||
                        0}
                    </h6>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h6 style={{ fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
          Total Price
        </h6>

        {/* <h6 style={{ fontSize: "18px", fontWeight: "600", textAlign: "left" }}>₹ {(Number(hotelFinalPrice) + Number(returnDomesticFinalPrice) + Number(returnInternationalFinalPrice) + Number(totalActivitiesPrice)).toFixed(0)}</h6> */}
        <h6 style={{ fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
          ₹ {Number(withoutMarkup)}
        </h6>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h6 style={{ fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
          Markup
        </h6>
        {adjustmentType == "percentage" ? (
          <h6
            style={{ fontSize: "14px", fontWeight: "600", textAlign: "left" }}
          >
            {" "}
            {adjustmentValue} {adjustmentValue == "" ? 0 : "%"}
          </h6>
        ) : (
          <h6
            style={{ fontSize: "14px", fontWeight: "600", textAlign: "left" }}
          >
            ₹ {Number(grandTotalPrice) - Number(withoutMarkup)}
          </h6>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <h6 style={{ fontSize: "16px", fontWeight: "600", textAlign: "left" }}>
          Grand Total
        </h6>
        <h6 style={{ fontSize: "18px", fontWeight: "600", textAlign: "left" }}>
          ₹ {Number(grandTotalPrice)}
        </h6>
      </div>

      <div className="d-flex w-100 gap-2 mt-3">
        {isMarkupApplied ? (
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#333",
                borderRadius: 4,

                // Alias Token
                colorBgContainer: "#f6ffed",
              },
            }}
          >
            <Button
              // icon={<EditOutlined />}
              // onClick={() => setModalVisible(true)}
              onClick={handlePayloadSave}
              style={{ width: "100%" }}
              type="primary"
              // loading={loader}
            >
              Continue
            </Button>
          </ConfigProvider>
        ) : (
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#333",
                borderRadius: 4,

                // Alias Token
                colorBgContainer: "#f6ffed",
              },
            }}
          >
            <Button
              style={{ width: "100%" }}
              onClick={showModal}
              type="primary"
              icon={<CloudUploadOutlined />}
              primary
            >
              Save as Proposal
            </Button>
          </ConfigProvider>
        )}
        {isMarkupApplied && (
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#333",
                borderRadius: 4,

                // Alias Token
                colorBgContainer: "#f6ffed",
              },
            }}
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => setModalVisible(true)}
              style={{ width: "100%" }}
              type="primary"
            >
              Edit Markup
            </Button>
          </ConfigProvider>
        )}
      </div>

      <Modal
        title="Add Markup"
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAdjustmentValue(0);
              handleCancel();
            }}
          >
            Remove Markup
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        <div className="d-flex flex-row w-100 gap-2 py-4">
          <Input
            type="number"
            placeholder="Enter adjustment value"
            value={adjustmentValue}
            onChange={(e) => setAdjustmentValue(e.target.value)}
            min={0}
          />
          <Select defaultValue="percentage" onChange={setAdjustmentType}>
            <Select.Option value="percentage">Percentage</Select.Option>
            <Select.Option value="flat">Flat Price</Select.Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default IteneraryPriceSummary;
