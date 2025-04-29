import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { apiURL } from "../../../Constants/constant";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Skeleton } from "@mui/material";
import Loadingbus from "../Busloading/Loadingbus";
import "./seatLayout.css";
import { Button, Select } from "antd";
import BusResultSke from "./BusResultSke";
import { colors } from "../../../colors";
import "../oneway2.scss";
const { Option } = Select;

const variants = {
  initial: {
    clipPath: "circle(1524px at 50% 50px)",
    transition: {
      type: "spring",
      stiffness: 20,
    },
  },
  animate: {
    clipPath: "circle(0px at 50% 50px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

// const variants2 = {
//     initial: {
//         y: 50,
//         opacity: 0,
//     },
//     animate: {
//         y: 0,
//         opacity: 1,
//         transition: {
//             duration: 0.5,
//             staggerChildren: 0.1,
//         },
//     },
// };

function BusResult({ filteredData }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  // const [openAccordian, setOpenAccordian] = useState(false);
  const [resultIndex, setResultIndex] = useState("");
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [resulttIndex, setResulttIndex] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedDropPoint, setSelectedDropPoint] = useState("");
  const [openSeatLayout, setOpenSeatLayout] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const upperArray = [];
  const lowerArray = [];
  const [blockedSeatArray, setBlockedSeatArray] = useState([]);
  const [flatArray, setFlatArray] = useState([]);

  const [layout, setLayout] = useState([]);
  const [loadingLayout, setLoadingLayout] = useState(false);

  const [loader, setLoader] = useState(true);
  const [tooManyFilter, setToomanyFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const busFullData =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult;
  const busDataResult =
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
      ?.BusResults;

  useEffect(() => {
    if (busDataResult?.length !== 0 && filteredData?.length === 0) {
      setToomanyFilter(true);
    } else {
      setToomanyFilter(false);
    }
  }, [busDataResult, filteredData]);

  useEffect(() => {
    if (filteredData.length > 0) {
      setLoader(false);
    }
  }, [filteredData]);

  useEffect(() => {
    if (origin.length > 0) {
      setSelectedOrigin(origin[0]);
      setSelectedDropPoint(destination[0]);
    }
  }, [origin]);
  const dispatch = useDispatch();

  function handleclick(resultIndexPara) {
    setBlockedSeatArray([]);
    setResultIndex(resultIndexPara);
    setLoadingLayout(true);
    setOpenSeatLayout(true);
    const requestData = {
      EndUserIp: reducerState?.ip?.ipData,
      ResultIndex: resultIndexPara,
      TraceId: busFullData?.TraceId,
      TokenId: reducerState?.ip?.tokenData,
    };

    try {
      axios
        .post(`${apiURL.baseURL}/skyTrails/bus/seatlayout`, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const finalLayout = handleSeatLayoutStringTwo(
            response.data?.data?.GetBusSeatLayOutResult?.SeatLayoutDetails
              ?.HTMLLayout
          );

          setLayout((prev) => finalLayout);
          const SeatDetailsArray =
            response.data?.data?.GetBusSeatLayOutResult?.SeatLayoutDetails
              ?.SeatLayout?.SeatDetails;
          let singleArray = SeatDetailsArray?.reduce(
            (acc, currentArray) => [...acc, ...currentArray],
            []
          );
          setFlatArray(singleArray);
          busDataResult.map((item, index) => {
            if (item?.ResultIndex === resultIndexPara) {
              setOrigin(item?.BoardingPointsDetails);
              setDestination(item?.DroppingPointsDetails);
            }
          });
          setResulttIndex(resultIndexPara);
          setLoadingLayout(false);
        });
    } catch (error) {
      console.error("Try-Catch Error:", error);
    }

    // setOpen(true);
  }

  useEffect(() => {
    if (
      0 ===
      reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult.length
    ) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult
      ?.BusResults,
  ]);

  flatArray?.forEach((obj) => {
    if (obj?.IsUpper === true) {
      upperArray.push(obj);
    } else if (obj?.IsUpper === false) {
      lowerArray.push(obj);
    }
  });

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const [activeSort, setActiveSort] = useState("Relevance");

  function handleSeatLayoutStringTwo(inputString) {
    let busSeatLayoutString = `${inputString}`;

    let seatObjects = [];

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = busSeatLayoutString;

    let seatDivs = tempDiv.querySelectorAll(
      ".hseat, .bhseat, .vhseat, .bhseat, .bseat, .vseat, .nseat, .rhseat"
    );

    seatDivs.forEach((seatDiv) => {
      // Check if the seat div is inside the upper part of the bus
      if (seatDiv.closest(".outerseat")) {
        const upperCheck = seatDiv.closest(".outerseat");
        const lowerDivCheck = upperCheck.querySelector(".lower");
        if (lowerDivCheck) {
          seatObjects.push({
            type: "lower",
            id: seatDiv.id,
            class: seatDiv.getAttribute("class"),
            top: seatDiv.style.top,
            left: seatDiv.style.left,
            onclick: seatDiv.getAttribute("onclick"),
          });
        }

        // Conditionally check for SeatType 2 and add sleeper seat
        else {
          seatObjects.push({
            type: "upper",
            id: seatDiv.id,
            class: seatDiv.getAttribute("class"),
            top: seatDiv.style.top,
            left: seatDiv.style.left,
            onclick: seatDiv.getAttribute("onclick"),
          });
        }
      }
      // Check if the seat div is inside the lower part of the bus
      else if (seatDiv.closest(".outerlowerseat")) {
        seatObjects.push({
          type: "lower",
          id: seatDiv.id,
          class: seatDiv.getAttribute("class"),
          top: seatDiv.style.top,
          left: seatDiv.style.left,
          onclick: seatDiv.getAttribute("onclick"),
        });
      }
    });

    return seatObjects;
  }

  function addOrRemoveSeat(e, object) {
    if (object.SeatStatus === false) {
      return;
    }

    const isSeatSelected = blockedSeatArray.includes(object);
    if (isSeatSelected) {
      const updatedBlockedSeatArray = blockedSeatArray.filter(
        (seatObject) => seatObject !== object
      );
      setBlockedSeatArray(updatedBlockedSeatArray);
    } else {
      setBlockedSeatArray([...blockedSeatArray, object]);
    }
  }

  function handleClose() {
    setBlockedSeatArray([]);
    setSelectedDropPoint("");
    setSelectedOrigin("");
    setOrigin([]);
    setDestination([]);
    setOpenSeatLayout(false);
    //  setModal((prev) => !prev);
  }
  function handleContinue() {
    if (
      blockedSeatArray.length === 0 ||
      selectedOrigin === "" ||
      destination.length === 0 ||
      selectedDropPoint === "" ||
      origin === ""
    ) {
      toast.error("Select the Seat!");
      return;
    }
    const dataToSave = {
      blockedSeatArray: blockedSeatArray,
      selectedOrigin: selectedOrigin.CityPointIndex,
      selectedDropPoint: selectedDropPoint.CityPointIndex,
      resultIndex: resulttIndex,
    };

    // Save the combined state object to session storage
    sessionStorage.setItem("seatData", JSON.stringify(dataToSave));
    navigate("/BusPassengerDetail");
  }

  if (
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
      ?.ErrorCode !== 0 ||
    reducerState?.getBusResult?.busResult?.data?.data?.BusSearchResult?.Error
      ?.ErrorCode === undefined
  ) {
    // toast.error("Select the Seat!");
    return (
      <>
        <Loadingbus />{" "}
      </>
    );
  }

  const hasUpperSeats = layout.some((item) => item?.type === "upper");

  return (
    <>
      {loader ? (
        <BusResultSke />
      ) : (
        <>
          {tooManyFilter ? (
            <div className="col-lg-9">
              <div className="noHotels">
                <h3>Too many filter Applied !</h3>
                <p>
                  Please remove some <FaPen />
                </p>
              </div>
            </div>
          ) : (
            <>
              <ToastContainer />

              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="row">
                    {filteredData &&
                      filteredData?.map((busDetails) => {
                        const departureTime = new Date(
                          busDetails?.DepartureTime
                        ).getTime();
                        const arrivalTime = new Date(
                          busDetails?.ArrivalTime
                        ).getTime();
                        const timeDifference = arrivalTime - departureTime;
                        const hours = Math.floor(
                          timeDifference / (1000 * 60 * 60)
                        );
                        const minutes = Math.floor(
                          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        const duration = `${hours}hr ${minutes}min`;

                        return (
                          <div
                            className=" col-lg-12"
                            Key={busDetails?.ResultIndex}
                          >
                            <div className="text-black singlebusMain bg-white shadow-sm  ">
                              <h3 className="text-[14px] md:text-[16px] font-medium mb-0 px-4 py-2 rounded-t-lg from-indigo-400 to-indigo-100 bg-gradient-to-r text-white">
                                {busDetails?.TravelName?.toUpperCase()}
                              </h3>

                              <div className="singleBusResultBox border-none border-0">
                                <div className="sbsb1">
                                  <p className="!text-xl text-gray-600">
                                    {busDetails?.BusType}
                                  </p>
                                </div>
                                <div className="sbsb2">
                                  <div>
                                    <h3 className=" text-xl text-gray-600">
                                      {busFullData?.Origin}
                                    </h3>
                                    <h4 className=" text-xl text-gray-600">
                                      {dayjs(busDetails?.DepartureTime).format(
                                        "DD MMM, YY"
                                      )}
                                    </h4>
                                    <p className="text-gray-600">
                                      {dayjs(busDetails?.DepartureTime).format(
                                        "h:mm A"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    {/* <p>{duration}</p> */}

                                    {/* <div className="busDistance">
                                                                                        <span className="busCircle1"></span>
                                                                                        <span className="busLine2"></span>
                                                                                        <span className="busCircle2"></span>
                                                                                    </div> */}
                                    <div className="flex items-center justify-center px-2 py-2 busDistance">
                                      {/* Left Dot */}
                                      <div className="flex items-center">
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="flex-grow w-10 border-[1px] border-gray-300 spansborder"></span>
                                      </div>

                                      {/* Duration */}
                                      <div className="flex items-center justify-center border-[1px] border-gray-300 rounded-l-full rounded-r-full busDistance1 w-auto min-w-[90px]">
                                        <p className="font-medium text-center text-gray-700">
                                          {duration}
                                        </p>
                                      </div>

                                      {/* Right Dot */}
                                      <div className="flex items-center">
                                        <span className="flex-grow w-10 border-[1px] border-gray-300 spansborder"></span>

                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                      </div>
                                    </div>

                                    {/* <p>
                                      {busDetails?.AvailableSeats} Seats Left
                                    </p> */}
                                  </div>
                                  <div>
                                    <h3 className=" text-xl text-gray-600">
                                      {busFullData?.Destination}
                                    </h3>
                                    <h4 className=" text-xl text-gray-600">
                                      {dayjs(busDetails?.ArrivalTime).format(
                                        "DD MMM, YY"
                                      )}
                                    </h4>
                                    <p className="text-gray-600">
                                      {dayjs(busDetails?.ArrivalTime).format(
                                        "h:mm A"
                                      )}
                                    </p>
                                  </div>
                                  <div className="pt-1">
                                    <h3>
                                      From ₹{" "}
                                      {
                                        busDetails?.BusPrice
                                          ?.PublishedPriceRoundedOff
                                      }
                                    </h3>

                                    {/* <button>
                                                                                        Show Seats →
                                                                                    </button> */}
                                    <div className="p-1 border-red-500 bg-[#F9EBE9] rounded-md ">
                                      <button
                                        onClick={() =>
                                          handleclick(busDetails?.ResultIndex)
                                        }
                                        loading={loader}
                                        className={`text-white ${colors.primary6000} border ${colors.primary6000}  hover:${colors.primary700} rounded-lg !hover:text-white font-montserrat `}
                                      >
                                        Select Seats
                                      </button>
                                      <p className="text-center text-black">
                                        {" "}
                                        {busDetails?.AvailableSeats} Seats Left
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {resultIndex == busDetails?.ResultIndex &&
                                openSeatLayout && (
                                  <motion.div
                                    variants={variants}
                                    initial="animate"
                                    animate="initial"
                                    className="sealLayoutDiv"
                                  >
                                    {!loadingLayout ? (
                                      <div className="layOutParent">
                                        <div className="seatTypeDetails">
                                          <div>
                                            <p>Available</p>
                                            <span></span>
                                          </div>
                                          <div>
                                            <p>Ladies Seat</p>
                                            <span
                                              style={{
                                                backgroundColor: "pink",
                                              }}
                                            ></span>
                                          </div>
                                          <div>
                                            <p>Unavailable</p>
                                            <span
                                              style={{
                                                backgroundColor: "#a9a9a9",
                                              }}
                                            ></span>
                                          </div>
                                        </div>
                                        <div className="layOutParentInner seatBoxCustom">
                                          <div className="customBusBox">
                                            {hasUpperSeats && (
                                              <div class="outerseat rott">
                                                <div className="">
                                                  <p>Upper</p>
                                                </div>

                                                <div class="busSeatlft">
                                                  <div class="upper"></div>
                                                </div>
                                                <div class="busSeatrgt">
                                                  <div class="busSeat upperBoxCustom">
                                                    <div class="seatcontainer clearfix">
                                                      {layout?.map(
                                                        (item, index) => {
                                                          if (
                                                            item?.type ===
                                                            "upper"
                                                          ) {
                                                            const divStyle = {
                                                              top:
                                                                item?.top || 0,
                                                              left:
                                                                item?.left || 0,
                                                            };
                                                            return (
                                                              <Box
                                                                class={
                                                                  item?.class
                                                                }
                                                                id={item?.id}
                                                                style={{
                                                                  ...divStyle,
                                                                  position:
                                                                    "absolute",
                                                                }}
                                                              >
                                                                <svg
                                                                  onClick={(
                                                                    e
                                                                  ) =>
                                                                    addOrRemoveSeat(
                                                                      e,
                                                                      upperArray?.[
                                                                        index
                                                                      ]
                                                                    )
                                                                  }
                                                                  width="40"
                                                                  height="29"
                                                                  viewBox="0 0 60 30"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                  <rect
                                                                    x="0.5"
                                                                    y="0.5"
                                                                    width="59"
                                                                    height="29"
                                                                    rx="3.5"
                                                                    fill={
                                                                      blockedSeatArray.includes(
                                                                        upperArray?.[
                                                                          index
                                                                        ]
                                                                      )
                                                                        ? "#21325d"
                                                                        : upperArray?.[
                                                                            index
                                                                          ]
                                                                            ?.IsLadiesSeat ===
                                                                          true
                                                                        ? "pink"
                                                                        : upperArray?.[
                                                                            index
                                                                          ]
                                                                            ?.SeatStatus ===
                                                                          false
                                                                        ? "#A9A9A9"
                                                                        : "#fff"
                                                                    }
                                                                    stroke="#21325d"
                                                                  ></rect>
                                                                  <rect
                                                                    x="56.5"
                                                                    y="5.5"
                                                                    width="3"
                                                                    height="19"
                                                                    rx="1.5"
                                                                    fill="white"
                                                                    stroke="#21325d"
                                                                  ></rect>
                                                                </svg>
                                                              </Box>
                                                            );
                                                          }
                                                        }
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <div className="customBusBox">
                                            <div class="outerlowerseat steeringBoxLower">
                                              <p>Lower</p>
                                              <div className="svgStreering">
                                                <svg
                                                  x="0px"
                                                  y="0px"
                                                  viewBox="0 0 24 24"
                                                  width="1.3rem"
                                                  height="1.3rem"
                                                  fill="currentColor"
                                                  style={{
                                                    color: "rgb(122, 122, 122)",
                                                  }}
                                                >
                                                  <g transform="matrix(0.022438, 0, 0, 0.022438, 0.781086, 0.781028)">
                                                    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
                                                      <path d="M4456.6,4992.6c-1186-146.8-2204.3-655.9-3009.9-1500.5C757.8,2770.3,335.5,1928.7,152.8,922.4c-68.9-392.3-71.9-1230.9,0-1617.3c128.8-715.8,437.3-1458.6,835.6-2021.6c242.6-344.4,829.6-934.4,1171-1174c937.4-661.9,2126.4-985.3,3234.6-883.5c694.8,65.9,1144.1,191.7,1773,497.2c518.1,254.5,853.6,497.1,1287.8,931.4c197.7,197.7,446.3,482.2,551.1,628.9C9221.6-2411,9539-1782,9652.8-1431.7c335.4,1009.3,329.4,2129.4-18,3141.7c-122.8,365.4-404.3,913.5-634.9,1239.9c-239.6,341.4-829.6,928.4-1174,1171c-560.1,395.3-1317.8,709.8-2006.6,832.6C5492.8,5010.5,4765,5031.5,4456.6,4992.6z M5585.7,4019.2c1233.9-182.7,2330.1-964.4,2914.1-2081.5l152.7-296.5H4998.7H1341.8l107.8,218.6c380.4,760.7,1000.3,1389.7,1755.1,1773C3947.4,4010.2,4762.1,4142,5585.7,4019.2z M5352,997.3c545.1-191.7,691.9-904.5,266.6-1290.8c-161.7-143.8-302.5-197.7-518.1-200.6c-212.6,0-356.4,53.9-518.1,203.7c-173.7,155.8-245.6,320.5-245.6,560.1C4336.8,805.6,4848.9,1174,5352,997.3z M1955.8,23.9c290.5-74.9,679.9-254.6,928.4-434.3c275.5-197.7,637.9-596,802.6-886.5c263.6-464.2,407.3-1078.2,365.4-1554.4c-21-239.6-119.8-703.8-164.7-775.7c-32.9-56.9-188.7-12-566,164.7c-425.3,200.7-760.7,437.3-1111.1,790.7c-622.9,620-994.3,1350.7-1123.1,2216.3c-24,155.7-44.9,350.4-44.9,431.3v146.8l338.4-18C1563.4,95.8,1824,59.9,1955.8,23.9z M8949-27c0-80.9-21-272.5-44.9-428.3c-128.8-865.6-500.2-1599.3-1123.1-2216.3c-353.4-353.4-691.8-593-1111.1-790.7c-425.3-197.7-404.3-197.7-461.2-12c-128.8,440.2-137.8,1132.1-18,1536.4c74.9,245.6,263.6,649.9,392.3,838.6c488.2,709.8,1371.7,1198,2195.3,1210l170.7,3V-27z"></path>
                                                    </g>
                                                  </g>
                                                </svg>
                                              </div>
                                              <div class="busSeatlft">
                                                <div class="lower"></div>
                                              </div>
                                              <div class="busSeatrgt">
                                                <div class="busSeat upperBoxCustom">
                                                  <div class="seatcontainer seatContTwo clearfix">
                                                    {layout?.map(
                                                      (item, index) => {
                                                        if (
                                                          item?.type === "lower"
                                                        ) {
                                                          const divStyle = {
                                                            top: item?.top || 0,
                                                            left:
                                                              item?.left || 0,
                                                          };

                                                          return (
                                                            <Box
                                                              class={
                                                                item?.class
                                                              }
                                                              id={item?.id}
                                                              style={{
                                                                ...divStyle,
                                                                position:
                                                                  "absolute",
                                                              }}
                                                            >
                                                              {lowerArray?.[
                                                                index -
                                                                  upperArray.length
                                                              ]?.SeatType ==
                                                              2 ? (
                                                                <div>
                                                                  <svg
                                                                    onClick={(
                                                                      e
                                                                    ) =>
                                                                      addOrRemoveSeat(
                                                                        e,
                                                                        lowerArray?.[
                                                                          index -
                                                                            upperArray.length
                                                                        ]
                                                                      )
                                                                    }
                                                                    width="40"
                                                                    height="29"
                                                                    viewBox="0 0 60 30"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <rect
                                                                      x="0.5"
                                                                      y="0.5"
                                                                      width="59"
                                                                      height="29"
                                                                      rx="3.5"
                                                                      fill={
                                                                        blockedSeatArray.includes(
                                                                          lowerArray?.[
                                                                            index -
                                                                              upperArray.length
                                                                          ]
                                                                        )
                                                                          ? "#21325d"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.IsLadiesSeat ===
                                                                            true
                                                                          ? "pink"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.SeatStatus ===
                                                                            false
                                                                          ? "#A9A9A9"
                                                                          : "#fff"
                                                                      }
                                                                      stroke="#21325d"
                                                                    ></rect>
                                                                    <rect
                                                                      x="56.5"
                                                                      y="5.5"
                                                                      width="3"
                                                                      height="19"
                                                                      rx="1.5"
                                                                      fill="white"
                                                                      stroke={
                                                                        lowerArray?.[
                                                                          index -
                                                                            upperArray.length
                                                                        ]
                                                                          ?.isLadiesSeat ===
                                                                        true
                                                                          ? "pink"
                                                                          : "#21325d"
                                                                      }
                                                                    ></rect>
                                                                  </svg>
                                                                </div>
                                                              ) : (
                                                                <div>
                                                                  <svg
                                                                    onClick={(
                                                                      e
                                                                    ) =>
                                                                      addOrRemoveSeat(
                                                                        e,
                                                                        lowerArray?.[
                                                                          index -
                                                                            upperArray.length
                                                                        ]
                                                                      )
                                                                    }
                                                                    width="21"
                                                                    height="21"
                                                                    viewBox="0 0 31 31"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                  >
                                                                    <path
                                                                      d="M21.7568 5.58197H15.5946C15.0811 5.58197 12 5.58197 12 3.04098C12 1.0082 13.7117 0.5 14.5676 0.5H24.3243C29.6649 0.906557 30.5 5.41257 30.5 7.61475V23.8852C30.5 29.5 24.8378 30.5 23.8108 30.5H14.5676C13.027 30.5 12 30.4918 12 27.9508C12 25.918 13.7117 25 14.5676 25H20.2162C22 25 25 24.9016 25 22.8689V8.5C25 6.06066 22.955 5.58197 21.7568 5.58197Z"
                                                                      fill={
                                                                        blockedSeatArray.includes(
                                                                          lowerArray?.[
                                                                            index -
                                                                              upperArray.length
                                                                          ]
                                                                        )
                                                                          ? "#21325d"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.IsLadiesSeat ===
                                                                            true
                                                                          ? "pink"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.SeatStatus ===
                                                                            false
                                                                          ? "#A9A9A9"
                                                                          : "#fff"
                                                                      }
                                                                    ></path>
                                                                    <rect
                                                                      y="3"
                                                                      width="25"
                                                                      height="25"
                                                                      rx="4"
                                                                      fill={
                                                                        blockedSeatArray.includes(
                                                                          lowerArray?.[
                                                                            index -
                                                                              upperArray.length
                                                                          ]
                                                                        )
                                                                          ? "#21325d"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.IsLadiesSeat ===
                                                                            true
                                                                          ? "pink"
                                                                          : lowerArray?.[
                                                                              index -
                                                                                upperArray.length
                                                                            ]
                                                                              ?.SeatStatus ===
                                                                            false
                                                                          ? "#A9A9A9"
                                                                          : "#fff"
                                                                      }
                                                                    ></rect>
                                                                    <path
                                                                      fill-rule="evenodd"
                                                                      clip-rule="evenodd"
                                                                      d="M12.6453 0.584801C13.2694 0.142591 14.0033 0 14.5 0H24.0192L24.0383 0.00144939C26.7974 0.210319 28.557 1.48384 29.613 3.00722C30.6547 4.50993 31 6.23503 31 7.38095V23.619C31 27.0066 29.3925 28.8849 27.6249 29.8885C25.8951 30.8706 24.0471 31 23.5 31H14.5C13.7143 31 12.9166 30.8758 12.3339 30.3023C11.7554 29.7329 11.5 28.8309 11.5 27.5556C11.5 26.4111 11.9958 25.6483 12.6453 25.188C13.2694 24.7458 14.0033 24.6032 14.5 24.6032H20C21.8074 24.6032 22.9511 24.4744 23.6378 24.1576C23.9623 24.0079 24.1634 23.8251 24.2909 23.6056C24.4219 23.3799 24.5 23.0722 24.5 22.6349V8.36508C24.5 7.37872 24.0285 6.78849 23.4249 6.42192C22.7947 6.03916 22.0173 5.90476 21.5 5.90476H15.4937C15.2321 5.90479 14.2825 5.90487 13.383 5.56442C12.9242 5.39078 12.4507 5.11854 12.0903 4.68726C11.7232 4.24785 11.5 3.6743 11.5 2.95238C11.5 1.80788 11.9958 1.04508 12.6453 0.584801ZM13.2297 1.38345C12.8376 1.66127 12.5 2.12863 12.5 2.95238C12.5 3.46062 12.6518 3.80969 12.8628 4.06224C13.0806 4.32292 13.3883 4.512 13.742 4.64589C14.4602 4.91773 15.2523 4.92063 15.5 4.92063H21.5C22.1493 4.92063 23.122 5.08148 23.9501 5.58443C24.8049 6.10357 25.5 6.98953 25.5 8.36508V22.6349C25.5 23.1818 25.4031 23.6737 25.1591 24.0938C24.9116 24.5202 24.5377 24.8294 24.0622 25.0487C23.1489 25.47 21.7926 25.5873 20 25.5873H14.5C14.1633 25.5873 13.6472 25.6907 13.2297 25.9866C12.8376 26.2644 12.5 26.7318 12.5 27.5556C12.5 28.7405 12.7446 29.3147 13.0411 29.6064C13.3334 29.8941 13.7857 30.0159 14.5 30.0159H23.5C23.9529 30.0159 25.6049 29.8992 27.1251 29.0361C28.6075 28.1945 30 26.6283 30 23.619V7.38095C30 6.3946 29.6952 4.87208 28.787 3.56183C27.8953 2.27557 26.4102 1.17316 23.9805 0.984127H14.5C14.1633 0.984127 13.6472 1.08757 13.2297 1.38345Z"
                                                                      fill={
                                                                        blockedSeatArray.includes(
                                                                          lowerArray?.[
                                                                            index -
                                                                              upperArray.length
                                                                          ]
                                                                        )
                                                                          ? "#fff"
                                                                          : "#21325d"
                                                                      }
                                                                    ></path>
                                                                    <path
                                                                      fill-rule="evenodd"
                                                                      clip-rule="evenodd"
                                                                      d="M1.73348 3.71775C2.66649 3.13928 3.76564 2.95312 4.5 2.95312H12.5V3.93725H4.5C3.90103 3.93725 3.00018 4.09554 2.26652 4.55041C1.55974 4.98861 1 5.70162 1 6.88963V24.1119C0.999994 24.8094 1.12107 25.6617 1.64631 26.3337C2.15222 26.9809 3.11019 27.5563 5 27.5563H12.5V28.5404H5C2.88981 28.5404 1.59777 27.8857 0.853684 26.9337C0.128916 26.0065 -6.67546e-06 24.8905 2.59235e-10 24.1119V6.88963C2.59235e-10 5.32209 0.773597 4.31287 1.73348 3.71775Z"
                                                                      fill="#21325d"
                                                                    ></path>
                                                                  </svg>
                                                                </div>
                                                              )}
                                                            </Box>
                                                          );
                                                        }
                                                      }
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="busSeatAndPrice">
                                          <div>
                                            <div className="origin">
                                              <label>Origin</label>
                                              <Select
                                                className=""
                                                value={
                                                  selectedOrigin?.CityPointIndex
                                                }
                                                onChange={(value) => {
                                                  setSelectedOrigin(
                                                    origin.find(
                                                      (item) =>
                                                        item.CityPointIndex ===
                                                        value
                                                    )
                                                  );
                                                }}
                                              >
                                                {origin.map((name, index) => (
                                                  <Option
                                                    key={index}
                                                    value={name?.CityPointIndex}
                                                  >
                                                    {name?.CityPointName}
                                                  </Option>
                                                ))}
                                              </Select>
                                            </div>
                                            <div className="origin">
                                              <label>Destination</label>
                                              <Select
                                                className=""
                                                value={
                                                  selectedDropPoint?.CityPointIndex
                                                }
                                                onChange={(value) => {
                                                  setSelectedDropPoint(
                                                    destination.find(
                                                      (item) =>
                                                        item.CityPointIndex ===
                                                        value
                                                    )
                                                  );
                                                }}
                                              >
                                                {destination.map(
                                                  (name, index) => (
                                                    <Option
                                                      key={index}
                                                      value={
                                                        name?.CityPointIndex
                                                      }
                                                    >
                                                      {name?.CityPointName}
                                                    </Option>
                                                  )
                                                )}
                                              </Select>
                                            </div>
                                          </div>
                                          <div className="w-100">
                                            <div className="priceAndSeatInner">
                                              <div className="busSeats">
                                                <p>Seats:</p>
                                                {blockedSeatArray?.map(
                                                  (seat, index) => {
                                                    return (
                                                      <span>
                                                        {seat?.SeatName}
                                                      </span>
                                                      // <p>{seat?.Seatname}</p>
                                                    );
                                                  }
                                                )}
                                              </div>

                                              <div className="totPriceAndContinue">
                                                <div>
                                                  {(() => {
                                                    const totalSeatPrice =
                                                      blockedSeatArray.reduce(
                                                        (totalPrice, seat) => {
                                                          return (
                                                            totalPrice +
                                                            (seat?.SeatFare ||
                                                              0)
                                                          );
                                                        },
                                                        0
                                                      );
                                                    return (
                                                      <>
                                                        <p>Price:</p>
                                                        <h2>
                                                          ₹{" "}
                                                          {totalSeatPrice.toFixed(
                                                            2
                                                          )}
                                                        </h2>
                                                      </>
                                                    );
                                                  })()}
                                                </div>

                                                <div>
                                                  <button
                                                    onClick={handleClose}
                                                    className={` text-white ${colors.primary6000} border${colors.primary6000} hover:${colors.primary700} p-1 rounded-lg`}
                                                  >
                                                    Close
                                                  </button>
                                                  <button
                                                    onClick={handleContinue}
                                                    className={` text-white ${colors.primary6000} border${colors.primary6000} hover:${colors.primary700} p-1 rounded-lg`}
                                                  >
                                                    Continue
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="loadingSeat">
                                        {/* <img src={busGif} alt="busgif" /> */}
                                        <img
                                          // src={busNew}
                                          src="https://raw.githubusercontent.com/The-SkyTrails/Images/main/busLoad.gif"
                                          alt="loading"
                                          className=""
                                        />
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default BusResult;
