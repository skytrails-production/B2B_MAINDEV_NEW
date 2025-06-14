import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiURL } from "../../Constants/constant";
import { Button } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { Divider } from "@mui/material";
import hotelNotFound from "../../images/hotelNotFound.jpg";
import starsvg from "../../images/star.svg";
import { useReactToPrint } from "react-to-print";

const ItenaryPdfDownloader = () => {
  const reducerState = useSelector((state) => state);
  const { id } = useParams();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  console.log(itineraryData, "itineraryData");

  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        const token = "your-token-here"; // Replace with your actual token
        const res = await axios.get(
          `${apiURL.baseURL}/skyTrails/api/itinerary/getProposalById`,
          {
            params: { proposalId: id },
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        setItineraryData(res?.data?.result);
      } catch (error) {
        console.error("Error fetching itinerary data:", error);
      }
    };

    fetchItineraryData();
  }, [id]);

  if (!itineraryData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Helper functions
  const getLatestDate = (dates) => {
    return dates.reduce((latest, current) => {
      return dayjs(latest).isAfter(dayjs(current)) ? latest : current;
    });
  };

  const getDateForDay = (startDate, dayIndex) => {
    return dayjs(startDate).add(dayIndex, "days").format("ddd, D MMM, YYYY");
  };

  // Calculate adults and children
  let adults = 0;
  let children = 0;
  itineraryData?.ItenaryPayloadData?.RoomGuests?.forEach((data) => {
    adults += data.NoOfAdults;
    children += data.NoOfChild;
  });

  // Extracting relevant dates
  const initialDate = itineraryData?.ItenaryPayloadData?.leavingDate;
  const leavingDate = dayjs(initialDate);
  const arrivalDateInternational = dayjs(
    itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.[0]?.[
      itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.length - 1
    ]?.Destination?.ArrTime
  );
  const initialStartDate = getLatestDate([
    leavingDate,
    arrivalDateInternational,
  ]);

  console.log(reducerState, "reducerState");
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Download Button */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={handlePrint}
        >
          Download PDF
        </Button>

        {/* <Button
          type="default"
          icon={<PrinterOutlined />}
          size="large"
          onClick={() => window.print()}
        >
          Print
        </Button> */}
      </div>

      {/* Content to be printed */}
      <div
        ref={componentRef}
        className="print-container"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        }}
      >
        {/* Combined Cover & Summary Page */}

        <div
          className="print-section"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            color: "white",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-100px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.03)",
              zIndex: 0,
            }}
          ></div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "800px",
            }}
          >
            {/* Cover Section */}
            <div style={{ marginBottom: "40px" }}>
              <h1
                className="text-3xl font-bold mb-6"
                style={{
                  background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: "1.2",
                }}
              >
                Travel Itinerary
              </h1>
              {/* Prepared For Section */}
              <div className="mt-2">
                <p className="text-lg mb-2" style={{ color: "#bbb" }}>
                  Prepared exclusively for:
                </p>
                <p
                  className="text-2xl font-medium"
                  style={{ color: "#feb47b" }}
                >
                  {itineraryData?.ItenaryPayloadData?.clientName}
                </p>
              </div>
            </div>

            {/* Trip Details Card */}
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
                margin: "0 auto",
                textAlign: "left",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-2xl font-semibold"
                  style={{ color: "#667eea" }}
                >
                  Your Journey Details
                </h3>

                <div className="text-lg ">
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "8px 20px",
                      borderRadius: "30px",
                    }}
                  >
                    {dayjs(
                      itineraryData?.ItenaryPayloadData?.leavingDate
                    ).format("dddd, MMMM D, YYYY")}
                  </div>
                </div>
              </div>

              <div className="space-y-4" style={{ fontSize: "18px" }}>
                {/* Travelers */}
                <div className="flex">
                  <span
                    className="inline-block w-40 font-medium"
                    style={{ color: "#bbb" }}
                  >
                    Travelers:
                  </span>
                  <span>
                    {adults} adult{adults !== 1 ? "s" : ""}
                    {children > 0
                      ? ` & ${children} child${children > 1 ? "ren" : ""}`
                      : ""}
                  </span>
                </div>

                {/* Trip Description */}
                <div className="mt-8 mb-6">
                  <h4
                    className="text-xl font-semibold mb-4"
                    style={{ color: "#feb47b" }}
                  >
                    ✨ Your Trip Plan:
                  </h4>

                  {itineraryData?.ItenaryPayloadData?.cityAndNight?.map(
                    (item, index, array) => {
                      const startDate =
                        index === 0
                          ? dayjs(
                              itineraryData?.ItenaryPayloadData?.leavingDate
                            )
                          : dayjs(
                              itineraryData?.ItenaryPayloadData?.leavingDate
                            ).add(
                              array
                                .slice(0, index)
                                .reduce((sum, x) => sum + x.night, 0),
                              "day"
                            );

                      const endDate = startDate.add(item.night, "day");

                      return (
                        <div
                          key={index}
                          className="mb-6"
                          style={{
                            borderLeft: "3px solid #667eea",
                            paddingLeft: "20px",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: "-10px",
                              top: "0",
                              width: "20px",
                              height: "20px",
                              background: "#667eea",
                              borderRadius: "50%",
                            }}
                          ></div>

                          <p className="text-lg font-medium mb-2">
                            {index === 0 ? (
                              <>
                                <span style={{ color: "#feb47b" }}>Day 1:</span>{" "}
                                Depart from{" "}
                                {itineraryData?.ItenaryPayloadData?.leavingFrom}{" "}
                                to{" "}
                                <span style={{ fontWeight: "600" }}>
                                  {item.destination}
                                </span>
                              </>
                            ) : (
                              <>
                                <span style={{ color: "#feb47b" }}>
                                  Day{" "}
                                  {array
                                    .slice(0, index)
                                    .reduce((sum, x) => sum + x.night, 0) + 1}
                                  :
                                </span>{" "}
                                Travel to{" "}
                                <span style={{ fontWeight: "600" }}>
                                  {item.destination}
                                </span>
                              </>
                            )}
                          </p>

                          <p className="mb-2" style={{ color: "#bbb" }}>
                            📅 {startDate.format("dddd, MMMM D")} to{" "}
                            {endDate.format("dddd, MMMM D")}
                          </p>

                          <p style={{ color: "#ddd" }}>
                            You'll stay in {item.destination} for {item.night}{" "}
                            night{item.night !== 1 ? "s" : ""}{" "}
                            {index < array.length - 1 ? (
                              <>
                                before continuing to{" "}
                                <span style={{ fontWeight: "500" }}>
                                  {array[index + 1].destination}
                                </span>
                              </>
                            ) : (
                              <>before returning home</>
                            )}
                          </p>
                        </div>
                      );
                    }
                  )}

                  {/* Return Information */}
                  <div
                    style={{
                      borderLeft: "3px solid #667eea",
                      paddingLeft: "20px",
                      position: "relative",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "-10px",
                        top: "0",
                        width: "20px",
                        height: "20px",
                        background: "#667eea",
                        borderRadius: "50%",
                      }}
                    ></div>

                    <p className="text-lg font-medium mb-2">
                      <span style={{ color: "#feb47b" }}>
                        Day{" "}
                        {itineraryData?.ItenaryPayloadData?.cityAndNight?.reduce(
                          (sum, x) => sum + x.night,
                          0
                        ) + 1}
                        :
                      </span>{" "}
                      Return to{" "}
                      <span style={{ fontWeight: "600" }}>
                        {itineraryData?.ItenaryPayloadData?.leavingFrom}
                      </span>
                    </p>

                    <p style={{ color: "#bbb" }}>
                      📅{" "}
                      {dayjs(itineraryData?.ItenaryPayloadData?.leavingDate)
                        .add(
                          itineraryData?.ItenaryPayloadData?.cityAndNight?.reduce(
                            (sum, x) => sum + x.night,
                            0
                          ),
                          "day"
                        )
                        .format("dddd, MMMM D, YYYY")}
                    </p>
                  </div>
                </div>

                {/* Total Trip Duration */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <p className="flex items-center">
                    <span
                      className="inline-block w-40 font-medium"
                      style={{ color: "#bbb" }}
                    >
                      Total Duration:
                    </span>
                    <span className="text-lg">
                      {itineraryData?.ItenaryPayloadData?.cityAndNight?.reduce(
                        (sum, x) => sum + x.night,
                        0
                      ) + 1}{" "}
                      days /{" "}
                      {itineraryData?.ItenaryPayloadData?.cityAndNight?.reduce(
                        (sum, x) => sum + x.night,
                        0
                      )}{" "}
                      nights
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Flight Details */}

        {itineraryData?.flightData.length > 0 && (
          <div
            className="print-section"
            style={{
              // pageBreakBefore: "always",
              // minHeight: "100vh",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              color: "white",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                zIndex: 0,
              }}
            ></div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                className="text-3xl font-bold mb-8 text-center"
                style={{
                  color: "#fff",
                  position: "relative",
                  paddingBottom: "15px",
                  marginBottom: "30px",
                }}
              >
                ✈️ Your Flight Itinerary
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "3px",
                    background: "linear-gradient(90deg, #4facfe, #00f2fe)",
                    borderRadius: "3px",
                  }}
                ></span>
              </h2>

              <div className="max-w-4xl mx-auto">
                {itineraryData?.flightData
                  ?.sort((a, b) => a.id - b.id)
                  .map((flight) => {
                    const departureCity =
                      flight.id == 0
                        ? itineraryData?.ItenaryPayloadData?.leavingFrom
                        : itineraryData?.ItenaryPayloadData?.cityAndNight[
                            flight.id - 1
                          ].destination;

                    const arrivalCity =
                      itineraryData?.flightData.length - 1
                        ? flight?.flightDetails?.[0]?.Segments[0][
                            flight?.flightDetails?.[0]?.Segments[0].length - 1
                          ]?.Destination?.Airport?.AirportName
                        : itineraryData?.ItenaryPayloadData?.cityAndNight[
                            flight.id
                          ]?.destination;

                    return (
                      <div key={flight._id} className="mb-12">
                        {/* Flight Route Header */}
                        <div
                          className="p-4 rounded-t-xl flex items-center"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(254, 180, 123, 0.2) 0%, rgba(254, 180, 123, 0.2) 100%)",
                            borderBottom: "2px solid rgba(254, 180, 123, 0.5)",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              background:
                                "linear-gradient(135deg, #4facfe, #00f2fe)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "15px",
                              flexShrink: 0,
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 2L11 13"></path>
                              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold">
                            {departureCity} → {arrivalCity}
                          </h3>
                        </div>

                        {/* Flight Details */}
                        <div className="space-y-6 mt-2">
                          {flight.flightDetails.map((detail) => (
                            <div key={detail._id}>
                              {/* Outbound Flight */}
                              {detail.Segments[0] && (
                                <div
                                  className="rounded-lg overflow-hidden"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                  }}
                                >
                                  <div
                                    className="p-4 flex items-center"
                                    style={{
                                      background: "rgba(79, 172, 254, 0.1)",
                                      borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                  >
                                    <img
                                      src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${detail?.ValidatingAirline}.png`}
                                      alt="airline"
                                      className="h-10 w-10 mr-3"
                                    />
                                    <div>
                                      <h5 className="font-medium">
                                        {
                                          detail?.Segments[0][0]?.Airline
                                            ?.AirlineName
                                        }{" "}
                                        (
                                        {
                                          detail?.Segments[0][0]?.Airline
                                            ?.AirlineCode
                                        }
                                        {
                                          detail?.Segments[0][0]?.Airline
                                            ?.FlightNumber
                                        }
                                        )
                                      </h5>
                                      <div className="flex items-center mt-1">
                                        <span
                                          className="text-xs px-2 py-1 rounded"
                                          style={{
                                            background:
                                              "rgba(79, 172, 254, 0.3)",
                                            color: "#4facfe",
                                          }}
                                        >
                                          Departure Flight
                                        </span>
                                        {detail?.Segments[0].length > 1 && (
                                          <span
                                            className="text-xs px-2 py-1 rounded ml-2"
                                            style={{
                                              background:
                                                "rgba(255, 255, 255, 0.1)",
                                            }}
                                          >
                                            {detail?.Segments[0].length - 1}{" "}
                                            Stop
                                            {detail?.Segments[0].length > 2
                                              ? "s"
                                              : ""}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <div className="flex flex-row md:flex-row justify-between items-center mb-4">
                                      <div className="text-center mb-4 md:mb-0">
                                        <p className="text-lg font-medium">
                                          {departureCity}
                                        </p>
                                        <p className="text-gray-400">
                                          {dayjs(
                                            detail?.Segments[0][0]?.Origin
                                              ?.DepTime
                                          ).format("ddd, MMM D, YYYY")}
                                        </p>
                                        <p className="text-xl mt-1">
                                          {dayjs(
                                            detail?.Segments[0][0]?.Origin
                                              ?.DepTime
                                          ).format("h:mm A")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {
                                            detail?.Segments[0][0]?.Origin
                                              ?.Airport?.AirportName
                                          }{" "}
                                          (
                                          {
                                            detail?.Segments[0][0]?.Origin
                                              ?.Airport?.AirportCode
                                          }
                                          )
                                        </p>
                                      </div>

                                      <div className="text-center mb-4 md:mb-0">
                                        <div className="relative">
                                          <div className="h-px w-32 bg-gray-600 absolute top-1/2 left-0 transform -translate-y-1/2"></div>
                                          <div
                                            className="w-8 h-8 mx-auto relative z-10 flex items-center justify-center"
                                            style={{
                                              background:
                                                "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                                              border:
                                                "1px solid rgba(255, 255, 255, 0.2)",
                                              borderRadius: "50%",
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M22 2L11 13"></path>
                                              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                                            </svg>
                                          </div>
                                        </div>
                                        <p className="text-sm mt-2">
                                          {`${Math.floor(
                                            detail?.Segments[0][0]?.Duration /
                                              60
                                          )}h ${
                                            detail?.Segments[0][0]?.Duration %
                                            60
                                          }m`}{" "}
                                          flight
                                        </p>
                                        {detail?.Segments[0].length > 1 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            via{" "}
                                            {
                                              detail?.Segments[0][0]
                                                ?.Destination?.Airport?.CityName
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="text-center">
                                        <p className="text-lg font-medium">
                                          {arrivalCity}
                                        </p>
                                        <p className="text-gray-400">
                                          {dayjs(
                                            detail?.Segments[0][
                                              detail?.Segments[0].length - 1
                                            ]?.Destination?.ArrTime
                                          ).format("ddd, MMM D, YYYY")}
                                        </p>
                                        <p className="text-xl mt-1">
                                          {dayjs(
                                            detail?.Segments[0][
                                              detail?.Segments[0].length - 1
                                            ]?.Destination?.ArrTime
                                          ).format("h:mm A")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {
                                            detail?.Segments[0][
                                              detail?.Segments[0].length - 1
                                            ]?.Destination?.Airport?.AirportName
                                          }{" "}
                                          (
                                          {
                                            detail?.Segments[0][
                                              detail?.Segments[0].length - 1
                                            ]?.Destination?.Airport?.AirportCode
                                          }
                                          )
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Return Flight */}
                              {detail.Segments[1] && (
                                <div
                                  className="rounded-lg overflow-hidden mt-6"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                  }}
                                >
                                  <div
                                    className="p-4 flex items-center"
                                    style={{
                                      background: "rgba(255, 107, 107, 0.1)",
                                      borderBottom:
                                        "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                  >
                                    <img
                                      src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${detail?.ValidatingAirline}.png`}
                                      alt="airline"
                                      className="h-10 w-10 mr-3"
                                    />
                                    <div>
                                      <h4 className="font-medium">
                                        {
                                          detail?.Segments[1][0]?.Airline
                                            ?.AirlineName
                                        }{" "}
                                        (
                                        {
                                          detail?.Segments[1][0]?.Airline
                                            ?.AirlineCode
                                        }
                                        {
                                          detail?.Segments[1][0]?.Airline
                                            ?.FlightNumber
                                        }
                                        )
                                      </h4>
                                      <div className="flex items-center mt-1">
                                        <span
                                          className="text-xs px-2 py-1 rounded"
                                          style={{
                                            background:
                                              "rgba(255, 107, 107, 0.3)",
                                            color: "#ff6b6b",
                                          }}
                                        >
                                          Return Flight
                                        </span>
                                        {detail?.Segments[1].length > 1 && (
                                          <span
                                            className="text-xs px-2 py-1 rounded ml-2"
                                            style={{
                                              background:
                                                "rgba(255, 255, 255, 0.1)",
                                            }}
                                          >
                                            {detail?.Segments[1].length - 1}{" "}
                                            Stop
                                            {detail?.Segments[1].length > 2
                                              ? "s"
                                              : ""}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                                      <div className="text-center mb-4 md:mb-0">
                                        <p className="text-lg font-medium">
                                          {arrivalCity}
                                        </p>
                                        <p className="text-gray-400">
                                          {dayjs(
                                            detail?.Segments[1][0]?.Origin
                                              ?.DepTime
                                          ).format("ddd, MMM D, YYYY")}
                                        </p>
                                        <p className="text-xl mt-1">
                                          {dayjs(
                                            detail?.Segments[1][0]?.Origin
                                              ?.DepTime
                                          ).format("h:mm A")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {
                                            detail?.Segments[1][0]?.Origin
                                              ?.Airport?.AirportName
                                          }{" "}
                                          (
                                          {
                                            detail?.Segments[1][0]?.Origin
                                              ?.Airport?.AirportCode
                                          }
                                          )
                                        </p>
                                      </div>

                                      <div className="text-center mb-4 md:mb-0">
                                        <div className="relative">
                                          <div className="h-px w-32 bg-gray-600 absolute top-1/2 left-0 transform -translate-y-1/2"></div>
                                          <div
                                            className="w-8 h-8 mx-auto relative z-10 flex items-center justify-center"
                                            style={{
                                              background:
                                                "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                                              border:
                                                "1px solid rgba(255, 255, 255, 0.2)",
                                              borderRadius: "50%",
                                            }}
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M22 2L11 13"></path>
                                              <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                                            </svg>
                                          </div>
                                        </div>
                                        <p className="text-sm mt-2">
                                          {`${Math.floor(
                                            detail?.Segments[1][0]?.Duration /
                                              60
                                          )}h ${
                                            detail?.Segments[1][0]?.Duration %
                                            60
                                          }m`}{" "}
                                          flight
                                        </p>
                                        {detail?.Segments[1].length > 1 && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            via{" "}
                                            {
                                              detail?.Segments[1][0]
                                                ?.Destination?.Airport?.CityName
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="text-center">
                                        <p className="text-lg font-medium">
                                          {departureCity}
                                        </p>
                                        <p className="text-gray-400">
                                          {dayjs(
                                            detail?.Segments[1][
                                              detail?.Segments[1].length - 1
                                            ]?.Destination?.ArrTime
                                          ).format("ddd, MMM D, YYYY")}
                                        </p>
                                        <p className="text-xl mt-1">
                                          {dayjs(
                                            detail?.Segments[1][
                                              detail?.Segments[1].length - 1
                                            ]?.Destination?.ArrTime
                                          ).format("h:mm A")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {
                                            detail?.Segments[1][
                                              detail?.Segments[1].length - 1
                                            ]?.Destination?.Airport?.AirportName
                                          }{" "}
                                          (
                                          {
                                            detail?.Segments[1][
                                              detail?.Segments[1].length - 1
                                            ]?.Destination?.Airport?.AirportCode
                                          }
                                          )
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Connection Note */}
                        {flight.id < itineraryData.flightData.length - 1 && (
                          <div className="mt-6 text-center text-gray-400">
                            <p>
                              After your stay in {arrivalCity}, you'll continue
                              to your next destination
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Hotel Details */}
        {itineraryData?.hotelDetails.length > 0 && (
          <div
            className="print-section"
            style={{
              // pageBreakBefore: "always",
              // minHeight: "100vh",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              color: "white",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                zIndex: 0,
              }}
            ></div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                className="text-3xl font-bold mb-8 text-center"
                style={{
                  color: "#fff",
                  position: "relative",
                  paddingBottom: "15px",
                  marginBottom: "30px",
                }}
              >
                🏨 Hotel Accommodations
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "3px",
                    background: "linear-gradient(90deg, #fbc2eb, #a6c1ee)",
                    borderRadius: "3px",
                  }}
                ></span>
              </h2>

              <div className="max-w-4xl mx-auto space-y-8">
                {itineraryData?.hotelDetails?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="flex flex-row md:flex-row">
                      {/* Hotel Image */}
                      <div className="w-1/3 p-2 md:p-4">
                        <div className="relative rounded-xl overflow-hidden h-64 shadow-lg">
                          <img
                            src={
                              item?.HotelPicture ===
                              "https://b2b.tektravels.com/Images/HotelNA.jpg"
                                ? hotelNotFound
                                : item?.HotelPicture
                            }
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = hotelNotFound;
                            }}
                            alt={item?.HotelName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full flex items-center">
                            {Array.from(
                              { length: item?.StarRating },
                              (_, i) => (
                                <img
                                  key={i}
                                  src={starsvg}
                                  alt="star"
                                  className="h-3 w-3 mr-0.5"
                                />
                              )
                            )}
                            <span className="ml-1 text-sm">
                              {item?.StarRating}★
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hotel Details */}
                      <div className="w-2/3 p-2 md:p-4">
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{ color: "#fbc2eb" }}
                        >
                          {item?.HotelName}
                        </h3>

                        <div className="flex items-start mb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0 mt-1 mr-2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <p className="text-gray-300">{item?.HotelAddress}</p>
                        </div>

                        {item?.HotelLocation && (
                          <div className="flex items-start mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#ff6b6b"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="flex-shrink-0 mt-1 mr-2"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <p className="text-gray-300">
                              <span className="font-medium">Location:</span>{" "}
                              {item?.HotelLocation}
                            </p>
                          </div>
                        )}

                        <div
                          className="mb-4 p-4 rounded-lg"
                          style={{ background: "rgba(255, 255, 255, 0.07)" }}
                        >
                          <p className="font-medium mb-2">Booking Summary:</p>
                          <p className="text-gray-300">
                            {
                              itineraryData?.ItenaryPayloadData?.RoomGuests
                                ?.length
                            }{" "}
                            Room
                            {itineraryData?.ItenaryPayloadData?.RoomGuests
                              ?.length !== 1
                              ? "s"
                              : ""}
                            , {adults} Adult{adults !== 1 ? "s" : ""}
                            {children > 0
                              ? `, ${children} Child${
                                  children > 1 ? "ren" : ""
                                }`
                              : ""}
                          </p>
                        </div>

                        {/* Room Details - Kept exactly the same logic as original */}
                        {item.selectedRoom && (
                          <div className="border-t border-gray-700 pt-4 mt-4">
                            <h4
                              className="font-semibold mb-2 text-lg"
                              style={{ color: "#a6c1ee" }}
                            >
                              {item.selectedRoom?.RoomTypeName}
                            </h4>
                            {item.selectedRoom?.Amenities && (
                              <div>
                                <p className="text-sm font-medium mb-2">
                                  Room Amenities:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {/* {item.selectedRoom?.Amenities.split(',').map((amenity, i) => ( */}
                                  <span
                                    // key={i}
                                    className="text-xs px-3 py-1 rounded-full"
                                    style={{
                                      background: "rgba(166, 193, 238, 0.15)",
                                      border:
                                        "1px solid rgba(166, 193, 238, 0.3)",
                                    }}
                                  >
                                    {item.selectedRoom?.Amenities}
                                    {/* {amenity.trim()} */}
                                  </span>
                                  {/* ))} */}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Day-wise Itinerary - Dark Theme */}
        {itineraryData?.itenerieData?.[0]?.itenararyResult?.length > 0 && (
          <div
            className="print-section"
            style={{
              pageBreakBefore: "always",
              minHeight: "100vh",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              color: "white",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                zIndex: 0,
              }}
            ></div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <h2
                className="text-3xl font-bold mb-8 text-center"
                style={{
                  color: "#fff",
                  position: "relative",
                  paddingBottom: "15px",
                  marginBottom: "30px",
                }}
              >
                🌟 Daily Itinerary
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "3px",
                    background: "linear-gradient(90deg, #fbc2eb, #a6c1ee)",
                    borderRadius: "3px",
                  }}
                ></span>
              </h2>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* First we need to calculate the proper day numbering across cities */}
                {(() => {
                  let absoluteDayIndex = 0;
                  const cityAndNight =
                    itineraryData?.ItenaryPayloadData?.cityAndNight || [];
                  const itenaryResults =
                    itineraryData?.itenerieData?.[0]?.itenararyResult || [];
                  const activities =
                    itineraryData?.itenerieData?.[0]?.activities?.[0] || {};

                  return cityAndNight.map((cityNight, cityIndex) => {
                    // Find the matching itinerary for this city
                    const matchingItinerary = itenaryResults.find(
                      (itenary) =>
                        itenary?.[0]?.destination?.toLowerCase() ===
                        cityNight?.destination?.toLowerCase()
                    );

                    if (!matchingItinerary) return null;

                    const nights = parseInt(cityNight?.night) || 0;
                    const daysInCity = nights + 1;
                    const destination = matchingItinerary?.[0]?.destination;

                    // For cities after first one, adjust the day index for transfer day
                    if (cityIndex > 0) {
                      absoluteDayIndex--; // Adjust for transfer day
                    }

                    return (
                      <div key={cityIndex} className="space-y-8">
                        {matchingItinerary?.[0]?.dayAt?.map(
                          (item, dayItemIndex) => {
                            const currentAbsoluteDayIndex =
                              absoluteDayIndex + dayItemIndex;
                            const currentDate = getDateForDay(
                              initialStartDate,
                              currentAbsoluteDayIndex
                            );
                            const isTransferDay =
                              dayItemIndex === 0 && cityIndex > 0;
                            const dayActivities =
                              activities?.[cityIndex]?.[
                                currentAbsoluteDayIndex
                              ] || [];

                            return (
                              <div
                                key={dayItemIndex}
                                className="rounded-xl overflow-hidden"
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                {/* Day Header */}
                                <div
                                  className="p-6"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, rgba(251, 194, 235, 0.15) 0%, rgba(166, 193, 238, 0.15) 100%)",
                                    borderBottom:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <h3
                                      className="text-xl font-bold"
                                      style={{ color: "#fbc2eb" }}
                                    >
                                      Day {currentAbsoluteDayIndex + 1}:{" "}
                                      {destination}
                                      {isTransferDay && " (Transfer Day)"}
                                    </h3>
                                    <span
                                      className="px-3 py-1 rounded-full text-sm font-medium"
                                      style={{
                                        background: "rgba(255, 255, 255, 0.1)",
                                        color: "#a6c1ee",
                                      }}
                                    >
                                      {currentDate}
                                    </span>
                                  </div>
                                  <p className="mt-2 opacity-90">
                                    {item?.title ||
                                      "Exciting adventures await!"}
                                  </p>
                                </div>

                                {/* Main Content */}
                                <div className="p-6">
                                  {item?.description && (
                                    <div className="mb-6">
                                      <h4 className="text-lg font-semibold mb-2 flex items-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="#fbc2eb"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="mr-2"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                          ></circle>
                                          <line
                                            x1="12"
                                            y1="8"
                                            x2="12"
                                            y2="12"
                                          ></line>
                                          <line
                                            x1="12"
                                            y1="16"
                                            x2="12.01"
                                            y2="16"
                                          ></line>
                                        </svg>
                                        Today's Overview
                                      </h4>
                                      <p className="text-gray-300 pl-8">
                                        {item.description}
                                      </p>
                                    </div>
                                  )}

                                  {/* Activities Section */}
                                  {dayActivities.length > 0 && (
                                    <div>
                                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="#a6c1ee"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="mr-2"
                                        >
                                          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                          <line
                                            x1="6"
                                            y1="1"
                                            x2="6"
                                            y2="4"
                                          ></line>
                                          <line
                                            x1="10"
                                            y1="1"
                                            x2="10"
                                            y2="4"
                                          ></line>
                                          <line
                                            x1="14"
                                            y1="1"
                                            x2="14"
                                            y2="4"
                                          ></line>
                                        </svg>
                                        Today's Activities
                                      </h4>

                                      <div className="space-y-4 pl-8">
                                        {dayActivities.map(
                                          (activity, activityIndex) => (
                                            <div
                                              key={activityIndex}
                                              className="p-4 rounded-lg"
                                              style={{
                                                background:
                                                  "rgba(255, 255, 255, 0.07)",
                                                border:
                                                  "1px solid rgba(255, 255, 255, 0.1)",
                                              }}
                                            >
                                              <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-4">
                                                  <div
                                                    className="h-8 w-8 rounded-full flex items-center justify-center"
                                                    style={{
                                                      background:
                                                        "rgba(166, 193, 238, 0.15)",
                                                      border:
                                                        "1px solid rgba(166, 193, 238, 0.3)",
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        color: "#a6c1ee",
                                                      }}
                                                    >
                                                      {activityIndex + 1}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div>
                                                  <h5
                                                    className="font-semibold"
                                                    style={{ color: "#fbc2eb" }}
                                                  >
                                                    {activity.title}
                                                  </h5>
                                                  <p className="text-gray-300 mt-1">
                                                    {activity.description}
                                                  </p>
                                                  {/* <p className="text-sm text-gray-400 mt-1">
                                                    Price: ₹{activity.price}
                                                  </p> */}
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Travel Information */}
                                  <div
                                    className="mt-6 pt-4"
                                    style={{
                                      borderTop:
                                        "1px solid rgba(255, 255, 255, 0.1)",
                                    }}
                                  >
                                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#fbc2eb"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2"
                                      >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                      </svg>
                                      Travel Information
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pl-8">
                                      <div className="flex items-start">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="18"
                                          height="18"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="#a6c1ee"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="flex-shrink-0 mt-1 mr-3"
                                        >
                                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                          <circle
                                            cx="12"
                                            cy="10"
                                            r="3"
                                          ></circle>
                                        </svg>
                                        <div>
                                          <p className="text-sm font-medium text-gray-400">
                                            Current Location
                                          </p>
                                          <p className="text-gray-200">
                                            {destination}
                                          </p>
                                        </div>
                                      </div>
                                      {currentAbsoluteDayIndex === 0 && (
                                        <div className="flex items-start">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#a6c1ee"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="flex-shrink-0 mt-1 mr-3"
                                          >
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                          </svg>
                                          <div>
                                            <p className="text-sm font-medium text-gray-400">
                                              Departing From
                                            </p>
                                            <p className="text-gray-200">
                                              {
                                                itineraryData
                                                  ?.ItenaryPayloadData
                                                  ?.leavingFrom
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                      {isTransferDay && (
                                        <div className="flex items-start">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#a6c1ee"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="flex-shrink-0 mt-1 mr-3"
                                          >
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                          </svg>
                                          <div>
                                            <p className="text-sm font-medium text-gray-400">
                                              Transfer From
                                            </p>
                                            <p className="text-gray-200">
                                              {
                                                cityAndNight[cityIndex - 1]
                                                  ?.destination
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}

                        {/* Update the absolute day index for the next city */}
                        {(() => {
                          absoluteDayIndex += daysInCity;
                          return null;
                        })()}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Final Page - Dark Theme */}
        <div
          className="print-section"
          style={{
            pageBreakBefore: "always",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            color: "white",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(251, 194, 235, 0.1)",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(166, 193, 238, 0.1)",
              filter: "blur(20px)",
              zIndex: 0,
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Animated plane icon */}
            {/* <div
              className="mb-8 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fbc2eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div> */}

            <h2
              className="text-4xl font-bold mb-6"
              style={{
                background: "linear-gradient(90deg, #fbc2eb, #a6c1ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                display: "inline-block",
              }}
            >
              Good Luck!
              <span
                style={{
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  background: "linear-gradient(90deg, #fbc2eb, #a6c1ee)",
                  borderRadius: "3px",
                }}
              ></span>
            </h2>

            <div className="max-w-2xl mx-auto">
              <p className="text-xl mb-6 leading-relaxed">
                Your journey to{" "}
                <span className="font-medium" style={{ color: "#a6c1ee" }}>
                  {
                    itineraryData?.ItenaryPayloadData?.cityAndNight?.[0]
                      ?.destination
                  }
                </span>{" "}
                begins now! We're thrilled to be part of your travel experience
                and hope every moment brings you joy and unforgettable memories.
              </p>

              <div
                className="my-8 p-6 rounded-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#fbc2eb" }}
                >
                  Before You Go
                </h3>
                <ul className="text-left space-y-3 max-w-md mx-auto">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a6c1ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-0.5 flex-shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Double-check your travel documents and passport</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a6c1ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-0.5 flex-shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>
                      Confirm your flight times 24 hours before departure
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a6c1ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 mt-0.5 flex-shrink-0"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>
                      Pack appropriate clothing for your destination's climate
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-10">
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#fbc2eb" }}
                >
                  We're Here to Help
                </h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    For any questions or assistance during your trip:
                  </p>
                  <div className="flex justify-center space-x-6 mt-4">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a6c1ee"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span>holidays@theskytrails.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a6c1ee"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>+91-9209793097</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-6 text-sm">
                    Available 24/7 for emergency support during your travels
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-700">
                <p className="text-gray-400">
                  Thank you for choosing us for your travel needs. Wishing you
                  safe travels and wonderful adventures!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItenaryPdfDownloader;
