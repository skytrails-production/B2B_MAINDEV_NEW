import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import {
  findAirlineByCode,
  findAirportByCode,
} from "../../utility/flightUtility/BookwarperUtility";
import lineimg from "../../images/line-01.png";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
const BookWarpaerDetailsAmd = ({
  sesstioResultIndex,
  isSeatMapopen,
  setIsDropdown,
  setIsSeatMapOpen,
}) => {
  const variants = {
    initial: {
      y: 50,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };
  function formatDateString(dateString) {
    // Parse the date assuming it's in DDMMYY format
    const parsedDate = dayjs(dateString, "DDMMYY");

    // Format the date to 'dddd, MMMM D'
    return parsedDate.format("dddd, MMMM D");
  }
  function convertTo24HourFormat(timeStr) {
    // Parse the time string as HHmm
    const parsedTime = dayjs(timeStr, "HHmm");

    // Convert to 24-hour format
    return parsedTime.format("HH:mm");
  }

  function convertTime(timeString) {
    // Extract hours and minutes from the time string
    let hours = parseInt(timeString.substring(0, 2));
    let minutes = parseInt(timeString.substring(2));

    // Determine if it's AM or PM
    let period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // Handle midnight (0 hours)

    // Add leading zero to minutes if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Construct the final formatted time string
    let formattedTime = hours + ":" + minutes + " " + period;

    return formattedTime;
  }
  //   return <div>{JSON.stringify(useFindAirportByCode("BOM"))}</div>;
  // console.log(sesstioResultIndex, "sesstioResultIndex?.flightDetails?.s");

  return (
    <>
      {isSeatMapopen ? (
        <div
          // variants={variants}
          onClick={() => {
            setIsDropdown(false);
            setIsSeatMapOpen(false);
          }}
          className="col-lg-12 mt-3"
        >
          <div className="bookflightPassenger">
            <div
              className="headingBookFlight-new"
              style={{
                padding: "12px",
                color: "#E73C34",
                backgroundColor: "#FFFBFB",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Flights Summary</h3>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <p>
                {
                  findAirportByCode(
                    sesstioResultIndex?.flightDetails?.flightInformation
                      ?.location?.[0]?.locationId ||
                      sesstioResultIndex?.flightDetails?.[0]?.flightInformation
                        ?.location?.[0]?.locationId
                  )?.name
                }{" "}
                →{" "}
                {
                  findAirportByCode(
                    sesstioResultIndex?.flightDetails?.flightInformation
                      ?.location[1]?.locationId ||
                      sesstioResultIndex?.flightDetails?.[
                        sesstioResultIndex?.flightDetails?.length - 1
                      ]?.flightInformation?.location[1]?.locationId
                  )?.name
                }{" "}
                {`${formatDateString(
                  sesstioResultIndex?.flightDetails?.flightInformation
                    ?.productDateTime?.dateOfDeparture ||
                    sesstioResultIndex?.flightDetails?.[0]?.flightInformation
                      ?.productDateTime?.dateOfDeparture
                )}· ${convertTo24HourFormat(
                  sesstioResultIndex?.flightDetails?.flightInformation
                    ?.productDateTime?.timeOfDeparture ||
                    sesstioResultIndex?.flightDetails?.[
                      sesstioResultIndex?.flightDetails?.length - 1
                    ]?.flightInformation?.productDateTime?.timeOfDeparture
                )}`}{" "}
                ·{" "}
                {sesstioResultIndex?.flightDetails?.flightInformation
                  ? "Non Stop"
                  : `${
                      sesstioResultIndex?.flightDetails?.length - 1
                    } stop via ${
                      sesstioResultIndex?.flightDetails?.[0]?.flightInformation
                        ?.location?.[1]?.locationId
                    }`}
                · 2h 45m
              </p>
              <EditOutlined />
            </div>
          </div>
        </div>
      ) : (
        <div className=" col-lg-12 ">
          {
            // TicketDetails?.Segments[0].length == 2 ?

            <div className="booknowFlight">
              <div className="bookaboveBox">
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* {TicketDetails?.AirlineRemark !== null &&
                                TicketDetails?.AirlineRemark !== "--." ? (
                                  <p className="text-center w-100 mandaField">
                                    {TicketDetails?.AirlineRemark}
                                  </p>
                                ) : (
                                  ""
                                )} */}

                    <p className="flightdestination-right-para">
                      {
                        //"sesstioResultIndex?.flightDetails"
                        sesstioResultIndex?.flightDetails?.flightInformation
                          ? sesstioResultIndex?.flightDetails?.flightInformation
                              ?.location[0]?.locationId
                          : sesstioResultIndex?.flightDetails[0]
                              .flightInformation?.location[0]?.locationId
                      }
                      <FiArrowRight style={{ margin: "5px" }} />{" "}
                      {sesstioResultIndex?.flightDetails?.flightInformation
                        ? sesstioResultIndex?.flightDetails?.flightInformation
                            ?.location[1]?.locationId
                        : sesstioResultIndex?.flightDetails[
                            sesstioResultIndex?.flightDetails.length - 1
                          ].flightInformation?.location[1]?.locationId}
                    </p>
                  </div>
                </div>
              </div>
              {sesstioResultIndex?.flightDetails?.flightInformation ? (
                <>
                  <div className="bookcenteredBox ">
                    <div>
                      <div>
                        <img
                          src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${sesstioResultIndex?.flightDetails?.flightInformation?.companyId?.marketingCarrier}.png`}
                        />{" "}
                        <p
                          style={{
                            marginTop: "1px",
                            color: "#E73C34",
                          }}
                        >
                          {" "}
                          {
                            sesstioResultIndex?.flightDetails?.flightInformation
                              ?.companyId?.marketingCarrier
                          }
                          {
                            sesstioResultIndex?.flightDetails?.flightInformation
                              ?.flightOrtrainNumber
                          }
                        </p>
                      </div>
                    </div>
                    <p
                      style={{
                        color: "#E73C34",
                        textAlign: "center",
                      }}
                    >
                      {/* {findAirlineByCode(
                                      sesstioResultIndex?.flightDetails
                                        ?.flightInformation?.companyId
                                        ?.marketingCarrier
                                    )} */}
                      {sesstioResultIndex?.flightDetails?.flightInformation
                        ? convertTime(
                            sesstioResultIndex?.flightDetails?.flightInformation
                              ?.productDateTime?.timeOfDeparture
                          )
                        : convertTime(
                            sesstioResultIndex?.flightDetails[0]
                              ?.flightInformation?.productDateTime
                              ?.timeOfDeparture
                          )}
                    </p>
                    <p style={{ color: "#E73C34", fontSize: "14px" }}>
                      {sesstioResultIndex?.flightDetails.length < 1
                        ? `${
                            sesstioResultIndex?.flightDetails.length - 1
                          } stop via ${
                            sesstioResultIndex?.flightDetails
                              ?.flightInformation[0]?.location[1]?.locationId
                          }`
                        : "Non Stop"}
                    </p>
                  </div>
                  <div
                    style={{
                      background: "rgb(247, 241, 255",
                      borderRadius: "10px",
                      padding: "8px",
                    }}
                  >
                    <div
                      className="container flightdestination mb-4"
                      style={{
                        paddingTop: "13px",
                      }}
                    >
                      <div>
                        <div className="row  w-100 flight-detailss">
                          <div className="col-6 col-md-5 align-items-center mb-3 mb-md-0 flightdestination-right">
                            <p className="flightdestination-right-para">
                              {
                                findAirportByCode(
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[0]?.locationId
                                )?.name
                              }
                            </p>
                            <p className="flightdestination-right-para">
                              {convertTime(
                                sesstioResultIndex?.flightDetails
                                  ?.flightInformation?.productDateTime
                                  ?.timeOfDeparture
                              )}
                            </p>
                            <p className="flightdestination-right-para1">
                              {
                                findAirportByCode(
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[0]?.locationId
                                )?.code
                              }
                            </p>

                            <p className="flightdestination-right-para1">
                              Terminal-
                              {
                                sesstioResultIndex?.flightDetails
                                  ?.flightInformation?.location[0]?.terminal
                              }
                            </p>
                            {/* </p> */}
                          </div>
                          {/* </p> */}
                          <div
                            className="col-12 col-md-2  mb-3 mb-md-0"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ fontSize: "12px" }}>
                              {" "}
                              {`${parseInt(
                                sesstioResultIndex?.flightDetails?.flightInformation?.attributeDetails?.attributeDescription?.slice(
                                  0,
                                  2
                                ),
                                10
                              )}h
                                       ${parseInt(
                                         sesstioResultIndex?.flightDetails?.flightInformation?.attributeDetails?.attributeDescription?.slice(
                                           2,
                                           4
                                         ),
                                         10
                                       )}m`}
                            </div>
                            <div className="d-flex flex-column align-items-center">
                              {/* <img src={lineimg} alt="" style={{ width: "100%" }} /> */}
                            </div>
                          </div>

                          <div className="col-6 col-md-5 align-items-center flightdestination-right">
                            <p className="flightdestination-right-para">
                              {" "}
                              {
                                findAirportByCode(
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[1]?.locationId
                                )?.name
                              }
                            </p>

                            <p className="flightdestination-right-para">
                              {" "}
                              {convertTime(
                                sesstioResultIndex?.flightDetails
                                  ?.flightInformation?.productDateTime
                                  ?.timeOfArrival
                              )}
                            </p>
                            <p className="flightdestination-right-para1">
                              {" "}
                              {
                                findAirportByCode(
                                  sesstioResultIndex?.flightDetails
                                    ?.flightInformation?.location[1]?.locationId
                                )?.code
                              }
                            </p>
                            <p>
                              {" "}
                              Terminal-
                              {
                                sesstioResultIndex?.flightDetails
                                  ?.flightInformation?.location[1]?.terminal
                              }
                            </p>
                          </div>
                          <p></p>
                        </div>
                      </div>
                    </div>
                    <hr style={{ opacity: "0.3" }} />
                    <p
                      style={{
                        fontSize: "15px",
                        color: "var(--black4)",
                        fontWeight: 500,
                        fontFamily: "Montserrat",
                        padding: "5px",
                      }}
                    >
                      <i
                        class="fa-solid fa-bag-shopping"
                        style={{ color: "black" }}
                      ></i>{" "}
                      Baggage (ADULT) check-in{" "}
                      <span>
                        {" "}
                        {sesstioResultIndex?.baggage?.freeBagAllownceInfo
                          ?.baggageDetails?.quantityCode === "N"
                          ? sesstioResultIndex?.baggage?.freeBagAllownceInfo
                              ?.baggageDetails?.freeAllowance * 23
                          : Number(
                              sesstioResultIndex?.baggage?.freeBagAllownceInfo
                                ?.baggageDetails?.freeAllowance
                            ) === 0
                          ? "No baggage"
                          : sesstioResultIndex?.baggage?.freeBagAllownceInfo
                              ?.baggageDetails?.freeAllowance}
                        {sesstioResultIndex?.baggage?.freeBagAllownceInfo
                          ?.baggageDetails?.quantityCode === "N"
                          ? sesstioResultIndex?.baggage?.freeBagAllownceInfo
                              ?.baggageDetails?.unitQualifier === "K"
                            ? "KG"
                            : "LB"
                          : Number(
                              sesstioResultIndex?.baggage?.freeBagAllownceInfo
                                ?.baggageDetails?.freeAllowance
                            ) !== 0 ||
                            sesstioResultIndex?.baggage?.freeBagAllownceInfo
                              ?.baggageDetails?.freeAllowance !== "0"
                          ? "KG"
                          : ""}
                      </span>{" "}
                      cabin Included
                    </p>
                  </div>
                </>
              ) : (
                sesstioResultIndex?.flightDetails?.map((item, index) => {
                  // console.log(item, "itemmmmmmm");

                  const timeString =
                    sesstioResultIndex?.flightDetails[index]?.flightInformation
                      ?.attributeDetails?.attributeDescription;
                  const hours = timeString
                    ? parseInt(timeString.slice(0, 2), 10)
                    : 0;
                  const minutes = timeString
                    ? parseInt(timeString.slice(2, 4), 10)
                    : 0;

                  const timetravel = `${hours}h : ${minutes}m`;
                  let layover;
                  if (index < sesstioResultIndex?.flightDetails?.length - 1) {
                    const prevDateOfArrival =
                      sesstioResultIndex?.flightDetails?.[index]
                        ?.flightInformation?.productDateTime?.dateOfArrival;
                    const nextDateOfDeparture =
                      sesstioResultIndex?.flightDetails?.[index + 1]
                        ?.flightInformation?.productDateTime?.dateOfDeparture;
                    const prevTimeOfArrival =
                      sesstioResultIndex?.flightDetails?.[index]
                        ?.flightInformation?.productDateTime?.timeOfArrival;
                    const nextTimeOfDeparture =
                      sesstioResultIndex?.flightDetails?.[index + 1]
                        ?.flightInformation?.productDateTime?.timeOfDeparture;

                    function calculateLayoverTime(
                      prevDateOfArrival,
                      prevTimeOfArrival,
                      nextDateOfDeparture,
                      nextTimeOfDeparture
                    ) {
                      // Parse the previous arrival datetime
                      const prevArrivalDateTime = new Date(
                        `20${prevDateOfArrival.slice(
                          4,
                          6
                        )}-${prevDateOfArrival.slice(
                          2,
                          4
                        )}-${prevDateOfArrival.slice(
                          0,
                          2
                        )}T${prevTimeOfArrival.slice(
                          0,
                          2
                        )}:${prevTimeOfArrival.slice(2, 4)}:00`
                      );

                      // Parse the next departure datetime
                      const nextDepartureDateTime = new Date(
                        `20${nextDateOfDeparture.slice(
                          4,
                          6
                        )}-${nextDateOfDeparture.slice(
                          2,
                          4
                        )}-${nextDateOfDeparture.slice(
                          0,
                          2
                        )}T${nextTimeOfDeparture.slice(
                          0,
                          2
                        )}:${nextTimeOfDeparture.slice(2, 4)}:00`
                      );

                      // Calculate the difference in milliseconds
                      const layoverDuration =
                        nextDepartureDateTime - prevArrivalDateTime;

                      // Convert the duration to total minutes
                      const totalMinutes = Math.floor(
                        layoverDuration / (1000 * 60)
                      );

                      // Calculate the hours and minutes from total minutes
                      const layoverHours = Math.floor(totalMinutes / 60);
                      const layoverMinutes = totalMinutes % 60;

                      return `${layoverHours} hours and ${layoverMinutes} minutes`;
                    }
                    layover = calculateLayoverTime(
                      prevDateOfArrival,
                      prevTimeOfArrival,
                      nextDateOfDeparture,
                      nextTimeOfDeparture
                    );
                  }

                  return (
                    <>
                      <div className="bookcenteredBox">
                        <div>
                          <div>
                            <img
                              src={`https://raw.githubusercontent.com/The-SkyTrails/Images/main/FlightImages/${sesstioResultIndex?.flightDetails[index]?.flightInformation?.companyId?.marketingCarrier}.png`}
                            />{" "}
                            <p
                              style={{
                                marginTop: "1px",
                                color: "#E73C34",
                              }}
                            >
                              {
                                sesstioResultIndex?.flightDetails[index]
                                  ?.flightInformation?.companyId
                                  ?.marketingCarrier
                              }
                              {
                                sesstioResultIndex?.flightDetails[index]
                                  ?.flightInformation?.flightOrtrainNumber
                              }
                            </p>
                          </div>
                        </div>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "14px",
                            color: "#E73C34",
                          }}
                        >
                          {convertTime(
                            sesstioResultIndex?.flightDetails[index]
                              ?.flightInformation?.productDateTime
                              ?.timeOfArrival
                          )}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            background: "rgb(247, 241, 255)",
                            borderRadius: "10px",
                            padding: "8px",
                          }}
                        >
                          <div
                            className="container flightdestination mb-4"
                            style={{
                              padding: " 13px",
                            }}
                          >
                            <div className="row  w-100">
                              <div className="col-6 col-md-5 align-items-center mb-3 mb-md-0 flightdestination-right">
                                <p className="flightdestination-right-para">
                                  {" "}
                                  {
                                    findAirportByCode(
                                      sesstioResultIndex?.flightDetails[index]
                                        ?.flightInformation?.location[0]
                                        ?.locationId
                                    )?.name
                                  }
                                </p>
                                <p className="flightdestination-right-para">
                                  {convertTime(
                                    sesstioResultIndex?.flightDetails[index]
                                      ?.flightInformation?.productDateTime
                                      ?.timeOfDeparture
                                  )}
                                </p>
                                <p className="flightdestination-right-para1">
                                  {" "}
                                  {
                                    findAirportByCode(
                                      sesstioResultIndex?.flightDetails[index]
                                        ?.flightInformation?.location[0]
                                        ?.locationId
                                    )?.code
                                  }
                                </p>
                                <p className="flightdestination-right-para1">
                                  {" "}
                                  Terminal-
                                  {
                                    sesstioResultIndex?.flightDetails[index]
                                      ?.flightInformation?.location[0]?.terminal
                                  }
                                </p>
                              </div>
                              <div
                                className="col-12 col-md-2  mb-3 mb-md-0"
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div style={{ fontSize: "12px" }}>
                                  {timetravel}
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                  <img
                                    src={lineimg}
                                    alt=""
                                    style={{ width: "100%" }}
                                  />
                                </div>
                              </div>
                              <div className="col-6 col-md-5 align-items-center flightdestination-right">
                                <p className="flightdestination-right-para">
                                  {" "}
                                  {
                                    findAirportByCode(
                                      sesstioResultIndex?.flightDetails[index]
                                        ?.flightInformation?.location[1]
                                        ?.locationId
                                    )?.name
                                  }
                                </p>

                                <p className="flightdestination-right-para">
                                  {convertTime(
                                    sesstioResultIndex?.flightDetails[index]
                                      ?.flightInformation?.productDateTime
                                      ?.timeOfArrival
                                  )}
                                </p>

                                <p className="flightdestination-right-para1">
                                  {" "}
                                  {
                                    findAirportByCode(
                                      sesstioResultIndex?.flightDetails[index]
                                        ?.flightInformation?.location[1]
                                        ?.locationId
                                    )?.code
                                  }
                                </p>
                                <p className="flightdestination-right-para1">
                                  {" "}
                                  Terminal-
                                  {
                                    sesstioResultIndex?.flightDetails[index]
                                      ?.flightInformation?.location[1]?.terminal
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <hr style={{ opacity: "0.3" }} />
                          <p
                            style={{
                              fontSize: "15px",
                              color: "var(--black4)",
                              fontWeight: 500,
                              fontFamily: "Montserrat",
                              padding: "5px",
                            }}
                          >
                            <i
                              class="fa-solid fa-bag-shopping"
                              style={{ color: "black" }}
                            ></i>{" "}
                            Baggage (ADULT) check-in{" "}
                            <span>
                              {sesstioResultIndex?.baggage?.freeBagAllownceInfo
                                ?.baggageDetails?.quantityCode === "N"
                                ? sesstioResultIndex?.baggage
                                    ?.freeBagAllownceInfo?.baggageDetails
                                    ?.freeAllowance * 23
                                : sesstioResultIndex?.baggage
                                    ?.freeBagAllownceInfo?.baggageDetails
                                    ?.freeAllowance}
                            </span>{" "}
                            cabin Included
                          </p>
                        </div>

                        {index <
                          sesstioResultIndex?.flightDetails?.length - 1 && (
                          <div className="flightLayoverOuter">
                            <div className="flightLayover">
                              <p className="text-bold">
                                Layover Time: {layover}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })
              )}
            </div>
          }
        </div>
      )}
    </>
  );
};

export default BookWarpaerDetailsAmd;
