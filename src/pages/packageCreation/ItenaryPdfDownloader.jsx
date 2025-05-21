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
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#34495e",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#2c3e50",
  },
  flightCard: {
    border: "1px solid #e0e0e0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  hotelCard: {
    border: "1px solid #e0e0e0",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  itineraryDay: {
    border: "1px solid #e0e0e0",
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexColumn: {
    flexDirection: "column",
  },
  starRating: {
    flexDirection: "row",
    marginBottom: 5,
  },
  amenity: {
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    padding: "3px 8px",
    marginRight: 5,
    marginBottom: 5,
    fontSize: 10,
  },
});

// PDF Document Component
const ItineraryPDF = ({ itineraryData }) => {
  const initialDate = itineraryData?.ItenaryPayloadData?.leavingDate;

  // Calculate adults and children
  let adults = 0;
  let children = 0;
  itineraryData?.ItenaryPayloadData?.RoomGuests?.forEach((data) => {
    adults += data.NoOfAdults;
    children += data.NoOfChild;
  });

  const getLatestDate = (dates) => {
    return dates.reduce((latest, current) => {
      return dayjs(latest).isAfter(dayjs(current)) ? latest : current;
    });
  };

  // Extracting relevant dates
  const leavingDate = dayjs(initialDate);
  const arrivalDateInternational = dayjs(
    itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.[0]?.[
      itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.length - 1
    ]?.Destination?.ArrTime
  );
  const arrivalDateDomesticReturn = dayjs(
    itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.[0]?.[
      itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.length - 1
    ]?.Destination?.ArrTime
  );
  const arrivalDateOneway = dayjs(
    itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.[0]?.[
      itineraryData?.flightData?.[0]?.flightDetails?.[0]?.Segments?.length - 1
    ]?.Destination?.ArrTime
  );

  const initialStartDate = getLatestDate([
    leavingDate,
    arrivalDateInternational,
    arrivalDateDomesticReturn,
    arrivalDateOneway,
  ]);

  const getDateForDay = (startDate, dayIndex) => {
    return dayjs(startDate).add(dayIndex, "days").format("ddd, D MMM, YYYY");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, styles.flexRow]}>
          <View style={styles.flexColumn}>
            <Text style={styles.title}>Travel Itinerary</Text>
            <Text style={styles.text}>
              Customer: {itineraryData?.ItenaryPayloadData?.clientName}
            </Text>
            <Text style={styles.text}>
              Journey Date: {itineraryData?.ItenaryPayloadData?.leavingDate}
            </Text>
          </View>
          <View style={styles.flexColumn}>
            <Text style={styles.text}>
              From: {itineraryData?.ItenaryPayloadData?.leavingFrom}
            </Text>
            <Text style={styles.text}>
              Nationality:{" "}
              {itineraryData?.ItenaryPayloadData?.nationality === "India"
                ? "Indian"
                : itineraryData?.ItenaryPayloadData?.nationality}
            </Text>
          </View>
        </View>

        {/* Flight Details */}
        {itineraryData?.flightData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Flight Details</Text>
            {itineraryData?.flightData
              ?.sort((a, b) => a.id - b.id)
              .map((flight) => (
                <View key={flight._id} style={{ marginBottom: 15 }}>
                  <Text style={styles.subtitle}>
                    {flight.id == 0
                      ? `${itineraryData?.ItenaryPayloadData?.leavingFrom} to ${itineraryData?.ItenaryPayloadData?.cityAndNight?.[0]?.destination}`
                      : `${
                          itineraryData?.ItenaryPayloadData?.cityAndNight[
                            flight.id - 1
                          ].destination
                        } to ${
                          itineraryData?.ItenaryPayloadData?.cityAndNight?.[
                            flight.id
                          ]?.destination
                        }`}
                  </Text>

                  {flight.flightDetails.map((detail, detailIndex) => (
                    <View key={detail._id} style={styles.flightCard}>
                      <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                        {detail?.Segments[0][0]?.Airline?.AirlineName} (
                        {detail?.Segments[0][0]?.Airline?.AirlineCode}
                        {detail?.Segments[0][0]?.Airline?.FlightNumber})
                      </Text>

                      <View style={[styles.flexRow, { marginBottom: 5 }]}>
                        <View>
                          <Text>
                            {detail?.Segments[0][0]?.Origin?.Airport?.CityName}
                          </Text>
                          <Text>
                            {dayjs(
                              detail?.Segments[0][0]?.Origin?.DepTime
                            ).format("DD MMM, YY h:mm A")}
                          </Text>
                        </View>

                        <View style={{ alignItems: "center" }}>
                          <Text>
                            {`${Math.floor(
                              detail?.Segments[0][0]?.Duration / 60
                            )}hr ${detail?.Segments[0][0]?.Duration % 60}min`}
                          </Text>
                          <Text>
                            {detail?.Segments[0].length > 1
                              ? `${detail?.Segments[0].length - 1} stop via ${
                                  detail?.Segments[0][0]?.Destination?.Airport
                                    ?.CityName
                                }`
                              : "Non Stop"}
                          </Text>
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                          <Text>
                            {
                              detail?.Segments[0][
                                detail?.Segments[0].length - 1
                              ]?.Destination?.Airport?.CityName
                            }
                          </Text>
                          <Text>
                            {dayjs(
                              detail?.Segments[0][
                                detail?.Segments[0].length - 1
                              ]?.Destination?.ArrTime
                            ).format("DD MMM, YY h:mm A")}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
          </View>
        )}

        {/* Hotel Details */}
        {itineraryData?.hotelDetails.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Hotel Details</Text>
            {itineraryData?.hotelDetails?.map((item, index) => (
              <View key={index} style={styles.hotelCard}>
                <Text style={styles.subtitle}>
                  {item?.HotelName} ({item?.StarRating} ★)
                </Text>
                <Text style={styles.text}>{item?.HotelAddress}</Text>
                {item?.HotelLocation && (
                  <Text style={styles.text}>
                    Location: {item?.HotelLocation}
                  </Text>
                )}

                <Text style={{ marginTop: 10, fontSize: 12 }}>
                  {itineraryData?.ItenaryPayloadData?.RoomGuests?.length} Rooms,{" "}
                  {adults} adults
                  {children > 0
                    ? `, ${children} child${children > 1 ? "ren" : ""}`
                    : ""}
                </Text>

                {item.selectedRoom && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>Selected Room:</Text>
                    <Text>{item.selectedRoom?.RoomTypeName}</Text>
                    {item.selectedRoom?.Amenities && (
                      <Text style={{ fontSize: 10, marginTop: 5 }}>
                        Amenities: {item.selectedRoom?.Amenities}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Day-wise Itinerary */}
        {itineraryData?.itenerieData?.[0]?.itenararyResult?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Day-wise Itinerary</Text>
            {itineraryData?.itenerieData?.[0]?.itenararyResult?.map(
              (itenary, itenaryIndex) => (
                <View key={itenaryIndex}>
                  {itenary?.[0]?.dayAt?.map((item, index) => {
                    const dayIndex =
                      itineraryData?.itenerieData?.[0]?.itenararyResult
                        ?.slice(0, itenaryIndex)
                        ?.reduce(
                          (acc, curr) => acc + curr?.[0]?.dayAt?.length,
                          0
                        ) + index;
                    const activity =
                      itineraryData?.itenerieData?.[0]?.activities?.[0]?.[
                        dayIndex
                      ];
                    const currentDate = getDateForDay(
                      initialStartDate,
                      dayIndex
                    );

                    return (
                      <View key={index} style={styles.itineraryDay}>
                        <Text style={styles.subtitle}>
                          Day {dayIndex + 1}: {itenary?.[0]?.destination} (
                          {currentDate})
                        </Text>
                        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                          {item?.title}
                        </Text>
                        <Text style={{ marginBottom: 10 }}>
                          {item?.description}
                        </Text>

                        {activity && activity.length > 0 && (
                          <View>
                            <Text
                              style={{ fontWeight: "bold", marginBottom: 5 }}
                            >
                              Activities:
                            </Text>
                            {activity.map((singleActivity, activityIndex) => (
                              <View
                                key={activityIndex}
                                style={{ marginBottom: 5 }}
                              >
                                <Text style={{ fontWeight: "bold" }}>
                                  {singleActivity.title}
                                </Text>
                                <Text>{singleActivity.description}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

const ItenaryPdfDownloader = () => {
  const reducerState = useSelector((state) => state);
  const { id } = useParams();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Preview Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Travel Itinerary
            </h1>
            <p className="text-gray-600">
              <span className="font-medium">Customer:</span>{" "}
              {itineraryData?.ItenaryPayloadData?.clientName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Journey Date:</span>{" "}
              {itineraryData?.ItenaryPayloadData?.leavingDate}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-600">
              <span className="font-medium">From:</span>{" "}
              {itineraryData?.ItenaryPayloadData?.leavingFrom}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Nationality:</span>{" "}
              {itineraryData?.ItenaryPayloadData?.nationality === "India"
                ? "Indian"
                : itineraryData?.ItenaryPayloadData?.nationality}
            </p>
          </div>
        </div>

        {/* Flight Details */}
        {itineraryData?.flightData.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Flight Details
            </h2>
            {itineraryData?.flightData
              ?.sort((a, b) => a.id - b.id)
              .map((flight) => (
                <div key={flight._id} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {flight.id == 0
                      ? `${itineraryData?.ItenaryPayloadData?.leavingFrom} to ${itineraryData?.ItenaryPayloadData?.cityAndNight?.[0]?.destination}`
                      : `${
                          itineraryData?.ItenaryPayloadData?.cityAndNight[
                            flight.id - 1
                          ].destination
                        } to ${
                          itineraryData?.ItenaryPayloadData?.cityAndNight?.[
                            flight.id
                          ]?.destination ||
                          itineraryData?.ItenaryPayloadData?.leavingFrom
                        }`}
                  </h3>

                  {flight.flightDetails.map((detail) => (
                    <div key={detail._id}>
                      {/* Outbound Flight */}
                      {detail.Segments[0] && (
                        <div className="border rounded-lg p-4 mb-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${detail?.ValidatingAirline}.png`}
                              alt="airline"
                              className="h-8 w-8 mr-3"
                            />
                            <div>
                              <h4 className="font-medium">
                                {detail?.Segments[0][0]?.Airline?.AirlineName} (
                                {detail?.Segments[0][0]?.Airline?.AirlineCode}
                                {detail?.Segments[0][0]?.Airline?.FlightNumber})
                              </h4>
                              <p className="text-sm text-gray-500">
                                Outbound Flight
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-center mb-3 md:mb-0">
                              <p className="font-medium">
                                {
                                  detail?.Segments[0][0]?.Origin?.Airport
                                    ?.CityName
                                }
                              </p>
                              <p className="text-gray-600">
                                {dayjs(
                                  detail?.Segments[0][0]?.Origin?.DepTime
                                ).format("DD MMM, YY h:mm A")}
                              </p>
                            </div>

                            <div className="text-center mb-3 md:mb-0">
                              <p className="text-sm text-gray-500">
                                {`${Math.floor(
                                  detail?.Segments[0][0]?.Duration / 60
                                )}h ${detail?.Segments[0][0]?.Duration % 60}m`}
                              </p>
                              <p className="text-sm">
                                {detail?.Segments[0].length > 1
                                  ? `${
                                      detail?.Segments[0].length - 1
                                    } stop via ${
                                      detail?.Segments[0][0]?.Destination
                                        ?.Airport?.CityName
                                    }`
                                  : "Non Stop"}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="font-medium">
                                {
                                  detail?.Segments[0][
                                    detail?.Segments[0].length - 1
                                  ]?.Destination?.Airport?.CityName
                                }
                              </p>
                              <p className="text-gray-600">
                                {dayjs(
                                  detail?.Segments[0][
                                    detail?.Segments[0].length - 1
                                  ]?.Destination?.ArrTime
                                ).format("DD MMM, YY h:mm A")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Return Flight */}
                      {detail.Segments[1] && (
                        <div className="border rounded-lg p-4 mb-4 shadow-sm">
                          <div className="flex items-center mb-3">
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${detail?.ValidatingAirline}.png`}
                              alt="airline"
                              className="h-8 w-8 mr-3"
                            />
                            <div>
                              <h4 className="font-medium">
                                {detail?.Segments[1][0]?.Airline?.AirlineName} (
                                {detail?.Segments[1][0]?.Airline?.AirlineCode}
                                {detail?.Segments[1][0]?.Airline?.FlightNumber})
                              </h4>
                              <p className="text-sm text-gray-500">
                                Return Flight
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-center mb-3 md:mb-0">
                              <p className="font-medium">
                                {
                                  detail?.Segments[1][0]?.Origin?.Airport
                                    ?.CityName
                                }
                              </p>
                              <p className="text-gray-600">
                                {dayjs(
                                  detail?.Segments[1][0]?.Origin?.DepTime
                                ).format("DD MMM, YY h:mm A")}
                              </p>
                            </div>

                            <div className="text-center mb-3 md:mb-0">
                              <p className="text-sm text-gray-500">
                                {`${Math.floor(
                                  detail?.Segments[1][0]?.Duration / 60
                                )}h ${detail?.Segments[1][0]?.Duration % 60}m`}
                              </p>
                              <p className="text-sm">
                                {detail?.Segments[1].length > 1
                                  ? `${
                                      detail?.Segments[1].length - 1
                                    } stop via ${
                                      detail?.Segments[1][0]?.Destination
                                        ?.Airport?.CityName
                                    }`
                                  : "Non Stop"}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="font-medium">
                                {
                                  detail?.Segments[1][
                                    detail?.Segments[1].length - 1
                                  ]?.Destination?.Airport?.CityName
                                }
                              </p>
                              <p className="text-gray-600">
                                {dayjs(
                                  detail?.Segments[1][
                                    detail?.Segments[1].length - 1
                                  ]?.Destination?.ArrTime
                                ).format("DD MMM, YY h:mm A")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        {/* Hotel Details */}
        {itineraryData?.hotelDetails.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Hotel Details
            </h2>
            {itineraryData?.hotelDetails?.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 mb-6 shadow-sm bg-gray-50"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4">
                    <div className="relative rounded-lg overflow-hidden h-48 shadow-md">
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
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md flex items-center">
                        {Array.from({ length: item?.StarRating }, (_, i) => (
                          <img
                            key={i}
                            src={starsvg}
                            alt="star"
                            className="h-3 w-3 mr-0.5"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {item?.HotelName}
                    </h3>
                    <p className="text-gray-600 mb-2">{item?.HotelAddress}</p>
                    {item?.HotelLocation && (
                      <p className="text-gray-600 mb-4">
                        <span className="text-red-500 mr-1">📍</span>
                        {item?.HotelLocation}
                      </p>
                    )}

                    {item.selectedRoom && (
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {item.selectedRoom?.RoomTypeName}
                        </h4>
                        {item.selectedRoom?.Amenities && (
                          <p className="text-sm text-gray-600">
                            Amenities: {item.selectedRoom?.Amenities}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Day-wise Itinerary */}
        {itineraryData?.itenerieData?.[0]?.itenararyResult?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Day-wise Itinerary
            </h2>
            {itineraryData?.itenerieData?.[0]?.itenararyResult?.map(
              (itenary, itenaryIndex) => (
                <div key={itenaryIndex}>
                  {itenary?.[0]?.dayAt?.map((item, index) => {
                    const initialDate =
                      itineraryData?.ItenaryPayloadData?.leavingDate;
                    const leavingDate = dayjs(initialDate);
                    const arrivalDateInternational = dayjs(
                      itineraryData?.flightData?.[0]?.flightDetails?.[0]
                        ?.Segments?.[0]?.[
                        itineraryData?.flightData?.[0]?.flightDetails?.[0]
                          ?.Segments?.length - 1
                      ]?.Destination?.ArrTime
                    );
                    const initialStartDate = getLatestDate([
                      leavingDate,
                      arrivalDateInternational,
                    ]);

                    const dayIndex =
                      itineraryData?.itenerieData?.[0]?.itenararyResult
                        ?.slice(0, itenaryIndex)
                        ?.reduce(
                          (acc, curr) => acc + curr?.[0]?.dayAt?.length,
                          0
                        ) + index;
                    const activity =
                      itineraryData?.itenerieData?.[0]?.activities?.[0]?.[
                        dayIndex
                      ];
                    const currentDate = getDateForDay(
                      initialStartDate,
                      dayIndex
                    );

                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-6 mb-6 shadow-sm"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Day {dayIndex + 1}: {itenary?.[0]?.destination} (
                          {currentDate})
                        </h3>
                        <h4 className="font-medium text-gray-700 mb-2">
                          {item?.title}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {item?.description}
                        </p>

                        {activity && activity.length > 0 && (
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">
                              Activities:
                            </h5>
                            {activity.map((singleActivity, activityIndex) => (
                              <div key={activityIndex} className="mb-3">
                                <Divider className="my-2" />
                                <h6 className="font-medium">
                                  {singleActivity.title}
                                </h6>
                                <p className="text-gray-600">
                                  {singleActivity.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="flex justify-center gap-4 mb-8">
        <PDFDownloadLink
          document={<ItineraryPDF itineraryData={itineraryData} />}
          fileName="travel-itinerary.pdf"
          className="ant-btn ant-btn-primary ant-btn-lg"
        >
          {({ loading }) => (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              loading={loading}
            >
              Download PDF
            </Button>
          )}
        </PDFDownloadLink>

        <Button
          type="default"
          icon={<PrinterOutlined />}
          size="large"
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>
    </div>
  );

  function getLatestDate(dates) {
    return dates.reduce((latest, current) => {
      return dayjs(latest).isAfter(dayjs(current)) ? latest : current;
    });
  }

  function getDateForDay(startDate, dayIndex) {
    return dayjs(startDate).add(dayIndex, "days").format("ddd, D MMM, YYYY");
  }
};

export default ItenaryPdfDownloader;
