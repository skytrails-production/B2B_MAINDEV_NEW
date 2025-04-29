import React, { useState, useEffect } from "react";
import WcIcon from "@mui/icons-material/Wc";
import "./FlightLayout.css"; // Import the CSS file for styling
import { Carousel, ConfigProvider, Result, Space, Tooltip } from "antd";
import { BsCupHotFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  number_of_seat_map,
  setAirlineSeat,
  setDefaultSeatOccupation,
  setAirlineAmount,
  setSeatMidAmount,
} from "../../Redux/AirlineSeatMap/actionAirlineSeatMap";
// import tailImg from "./tail.svg"
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useLocation } from "react-router-dom";
import planeHead from "./plane option 2.svg";
import planeTail from "./tale part 1-01 (2).svg";
import planeTail1 from "./tale part 2-01.svg";
import AirSeatMap from "../AirSeatMap/AirSeatMap";

const rowCharacteristic = {
  E: "exit-row",
  EC: "exit-row-cabin",
  EL: "exit-left",
  ER: "exit-right",
  Z: "not-exist",
  D: "exit-door",
  EX: "emergency-exit",
  // Z: "not-exist",
  A: "extra-lag-room",
};
const seatCharacteristics = {
  8: "aisle",
  E: "exit-row",
  D: "aisle",
  GN: "no-seat-galley",
  AR: "aisle",
  EX: "emargency-exit",
  LG: "aisle",
  SO: "aisle",
  ST: "aisle",
  TA: "aisle",
  Z: "aisle",
  "1D": "restricted-recline",
  2: "Leg-rest-available",
  701: "aisle",
  AR: "aisle",
};
const seatOccupations = {
  Z: "seat-occupied",
  F: "free-seat",
  M: "seat-occupied",
  O: "seat-occupied",
  Q: "aisle",
  T: "seat-occupied",
  C: "seat-occupied",
  D: "seat-occupied",
  H: "seat-occupied",
  P: "seat-occupied",
};
const seatOccupationsDef = {
  F: "free-seat-def",

  O: "seat-occupied-def",
};
const seatCharacteristicsHover = {
  9: "Center seat",
  A: "Aisle seat",
  W: "Window seat",
  WA: "Window and aisle together",
  2: "Leg rest available",
  L: "Leg space seat",
  W1: "Window seat without window",
  K: "Bulkhead seat",
  "1D": "Restricted recline seat",
  C: "Crew seat",
  CC: "Center section seat(s)",
};
const seatCharacteristicsHoverTitle = {
  9: "Center seat",
  A: "Aisle seat",
  W: "Window seat",
  WA: "Window and aisle together",
};

const Seat = ({
  className,
  children,
  res,
  seat,
  rowNumber,
  planeNo,
  // seatAmountlist,
}) => {
  const [isToolTip, setToolTip] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adultCount = queryParams.get("adult");
  const childCount = queryParams.get("child");

  const handleToolTip = (check) => {
    if (check === 1) {
      setToolTip(true);
    } else {
      setToolTip(false);
    }
  };
  let titleToolTip = "";

  function matchSeats(input) {
    let results = [];

    if (Array.isArray(input)) {
      input.forEach((item) => {
        if (seatCharacteristicsHover?.[item]) {
          if (seatCharacteristicsHoverTitle?.[item]) {
            titleToolTip = seatCharacteristicsHover?.[item];
          } else {
            results.push(seatCharacteristicsHover?.[item]);
          }
        }
      });
    } else {
      if (seatCharacteristicsHover?.[input]) {
        if (seatCharacteristicsHoverTitle?.[input]) {
          titleToolTip = seatCharacteristicsHover?.[input];
        } else {
          results.push(seatCharacteristicsHover?.[input]);
        }
      }
    }

    return results; // To remove the leading space
  }
  let outputArray = matchSeats(res?.[0]?.seatCharacteristic);
  const dispatch = useDispatch();

  const airlineSeatMap = useSelector((state) => state?.airlineSeatMap);
  const seatAmountlist = airlineSeatMap?.amountList[planeNo];
  // console.log(airlineSeatMap,"seatMapppppppp")
  const [SEATES, setSEATS] = useState(airlineSeatMap?.seatList);
  // console.log(airlineSeatMap, "seatAmountlist");
  const findSeat = (seatToFind) => {
    if (seatAmountlist) {
      return seatAmountlist?.find((obj) =>
        obj.seat.some((seat) => {
          return seat === seatToFind;
        })
      );
    } else {
      return false;
    }
  };

  const foundObject = findSeat(rowNumber + seat);
  // console.log(foundObject, "foundObject");

  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (
      airlineSeatMap?.seatList?.[planeNo]?.findIndex(
        (Seat) => Seat.seat == `${rowNumber + seat}`
      ) !== -1
    ) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
      // console.log(seat+rowNumber,"elseseeee")
    }
  }, [airlineSeatMap]);

  const [SelectedSeeat, setselectedSeat] = useState(false);
  const handleSeatClick = (seat, seatNumber, planeNo, seatOccupation) => {
    // console.log(planeNo, seatOccupation, "planeNo");
    setToolTip(true);

    let selectedSeat = [...SEATES];
    if (seat === "aisle" || seatOccupation) {
      return false;
    } else if (
      selectedSeat?.[planeNo]?.length === traveller &&
      selectedSeat?.[planeNo]?.findIndex(
        (Seat) => Seat?.seat == `${seatNumber + seat}`
      ) === -1
    ) {
      selectedSeat[planeNo].shift();

      selectedSeat[planeNo].push({
        seat: seatNumber + seat,
        amount: foundObject?.amount,
        currency: foundObject?.currency,
      });
    } else {
      const index = selectedSeat?.[planeNo]?.findIndex(
        (Seat) => Seat?.seat == `${seatNumber + seat}`
      );

      if (index !== -1) {
        selectedSeat?.[planeNo]?.splice(index, 1);
      } else {
        selectedSeat?.[planeNo]?.push({
          seat: seatNumber + seat,
          amount: foundObject?.amount || 0,
          currency: foundObject?.currency,
        });
      }
    }
    dispatch(setAirlineSeat(selectedSeat));
    // console.log(airlineSeatMap, "airlineSeatMap");
  };

  const seatOccupation =
    seatOccupations[res?.[0]?.seatOccupation] === "seat-occupied";
  const traveller = Number(adultCount) + Number(childCount);
  const defaultSeatOccupationType =
    airlineSeatMap?.defaultSeatOccupation?.[planeNo];
  const defaultSeatOccupation = seatOccupationsDef[defaultSeatOccupationType];

  return (
    <>
      {seat !== "aisle" && res?.[0]?.seatCharacteristic != 8 ? (
        <div
          onMouseOver={() => handleToolTip(1)}
          onMouseLeave={() => handleToolTip(2)}
          onClick={() => {
            handleSeatClick(seat, rowNumber, planeNo, seatOccupation);
          }}
          className={`seat ${defaultSeatOccupation}   ${className} ${
            res?.[0]?.seatCharacteristic
          } ${seatOccupations[res?.[0]?.seatOccupation]}  ${
            isChecked ? "seatSelected" : ""
          } 
                            ${
                              foundObject?.amount && foundObject?.amount !== 0
                                ? foundObject?.amount <
                                  airlineSeatMap?.midAmount
                                  ? "seat-price-low"
                                  : "seat-price-high"
                                : ""
                            }
                        `}
        >
          {seat + rowNumber}
          {isToolTip && res?.[0]?.seatCharacteristic != 8 && (
            <div className="tooltip-air">
              {seatOccupation ? (
                "Sorry! This seat is taken"
              ) : (
                <>
                  <div className="tooltip-title-box">
                    <p style={{ fontWeight: "700" }}>
                      {/* {`${res?.[0]?.seatColumn}${rowNumber}`} */}
                      {seat + rowNumber}
                    </p>
                    <p style={{ fontWeight: "700" }}>{titleToolTip}</p>
                    <p style={{ fontWeight: "700" }}>
                      ₹ {foundObject?.amount || 0}
                      {/* {foundObject?.currency} */}
                    </p>
                  </div>
                  {outputArray && (
                    <div className="tooltip-title-box">
                      {outputArray.map((item) => {
                        return <p>{item}</p>;
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`seat  ${className} ${res?.[0]?.seatCharacteristic} ${
            seatOccupations[res?.[0]?.seatOccupation]
          } ${res.length === 0 ? "seat-occupied" : ""} ${
            isChecked ? "seatSelected" : ""
          }`}
        >
          {seat + rowNumber}
        </div>
      )}
    </>
  );
};
const Exit = () => {
  return (
    <div className="exit">
      <div className="exit2">Exit</div>
      <div className="exit1">Exit</div>
      {/* <div className="exit-description">
                <div className="exit-description-text">Exit 1 - Main Entrance</div>
            </div> */}
    </div>
  );
};

const Row = ({
  rowNumber,
  classType,
  seats,
  row,
  type,
  planeNo,
  seatAmountlist,
}) => {
  // console.log(selectedSeat, "rooooeoeooeooeoieoierijkuerfijrnnvjfnvjhn")
  // useEffect(() => {
  //     console.log("fjksdfjikd")
  // }, [selectedSeat])

  return (
    <div
      // onMouseOver={() => console.log(seats, row, "mouseOver")}
      className="plane-row"
    >
      {seats?.map((seat, index) => {
        const result =
          seat === "aisle"
            ? //  || !row?.rowDetails?.seatOccupationDetails || row?.rowDetails?.seatOccupationDetails?.seatColumn
              []
            : Array.isArray(row?.rowDetails?.seatOccupationDetails) &&
              row?.rowDetails?.seatOccupationDetails?.filter(
                (data) => data?.seatColumn === seat
              );
        // console.log(result,"result")
        const isArray = Array?.isArray(result?.[0]?.seatCharacteristic);

        let seatClass = "";
        if (!isArray) {
          seatClass = seatCharacteristics?.[result?.[0]?.seatCharacteristic];
        } else {
          for (let i = 0; i < result?.[0]?.seatCharacteristic.length; i++) {
            seatClass +=
              " " + seatCharacteristics?.[result?.[0]?.seatCharacteristic?.[i]];
          }
        }
        // console.log(seatClass,"isArray")

        return (
          <Seat
            planeNo={planeNo}
            key={index}
            res={result}
            seat={seat}
            rowNumber={rowNumber}
            seatAmountlist={seatAmountlist}
            className={`${seat === "aisle" ? "aisle" : classType} ${
              rowCharacteristic[type]
            } ${seatClass}
        
              `}
          >
            {seat !== "aisle" ? `${seat}${rowNumber}` : ""}
          </Seat>
        );
      })}
    </div>
  );
};
const FlightTypes = ({ planeNo }) => {
  const Amount = useSelector((state) => state?.airlineSeatMap?.amountList);
  // console.log(Amount.flat(), "amountList", Amount);

  const [seatAmount, setSeatAmount] = useState([]);
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  let Mid;
  const typeFun = (data) => {
    let type = [
      { title: "Free", color: "#50E3C2", class: "free-seat" },
      {
        title: "Exit Row Seats",
        color: "red",
        class: "exit-row seat-occupied",
      },
      { title: "Occupied", color: "red", class: "seat-occupied" },
      {
        title: "Restricted Recline",
        color: "red",
        class: "restricted-recline seat-occupied",
      },
    ];

    if (!data) {
      return type;
    }
    let data1 = !Array.isArray(data) ? [data] : data;
    // console.log(data1, "flighTypesData");
    // console.log(data, "data");

    let data2 = Array.from(
      new Set(
        data1.map((item) => {
          return item.amount;
        })
      )
    );
    data2.sort((a, b) => b - a);
    // console.log(data2)
    // console.log(data, data2, "convertto set");

    if (data2?.length === 1) {
      type.push({
        title: `₹ ${data2?.[0]}`,
        color: "red",
        class: "seat-price-low",
      });
      Mid = data2?.[0] + 1;
    } else if (data2?.length === 2) {
      type.push({
        title: `₹ ${data2?.[0]}`,
        color: "red",
        class: "seat-price-high",
      });
      type.push({
        title: `₹ ${data2?.[1]}`,
        color: "red",
        class: "seat-price-low",
      });
      Mid = data2?.[0];
    } else if (data2?.length === 3) {
      type.push({
        title: `₹ ${data2?.[0]}`,
        color: "red",
        class: "seat-price-highhhh",
      });
      type.push({
        title: `₹ ${data2?.[1]}-${data2?.[2]}`,
        color: "red",
        class: "seat-price-low",
      });
      Mid = data2?.[0];
    } else if (3 < data2?.length) {
      let mid = (data2?.length / 2).toFixed();
      let maxHigh = data2[0];
      let minHigh = data2[mid - 1];
      let maxLow = data2[mid];
      let minLow = data2[data2?.length - 1];
      type.push({
        title: `₹ ${minHigh}-${maxHigh}`,
        color: "red",
        class: "seat-price-high",
      });
      type.push({
        title: `₹ ${minLow}-${maxLow}`,
        color: "red",
        class: "seat-price-low",
      });
      // console.log(maxHigh, minHigh, maxLow, minLow);
      Mid = minHigh;
    }
    // console.log(Mid, "type");

    return type;
  };
  const Type = typeFun(Amount?.[planeNo]);
  useEffect(() => {
    dispatch(setSeatMidAmount(Mid));
  }, [Amount, planeNo]);

  return (
    <div
      className="plane-type-container"
      onMouseOver={(e) => e.stopPropagation()}
    >
      {Type &&
        Type.map((item) => {
          return (
            <div className="plane-type-item">
              <div className={`seat ${item.class}`}></div>
              <div className="plane-type-item-title">{item.title}</div>
            </div>
          );
        })}
      {/* <button
        onClick={() => {
          console.log(reducerState, "reducer");
        }}
      >
        Reducerstate
      </button> */}
    </div>
  );
};
const Plane = ({ data, planeNo }) => {
  const [seatAmountlist, setSeatAmountList] = useState([]);
  const [seatPrice, setSeatProce] = useState(
    data?.Air_RetrieveSeatMapReply?.seatmapInformation?.customerCentricData
      ?.seatPrice
  );
  // console.log(data,planeNo,"datattt")

  const columnDetails =
    data?.Air_RetrieveSeatMapReply?.seatmapInformation?.cabin
      ?.compartmentDetails?.columnDetails ||
    data?.Air_RetrieveSeatMapReply?.seatmapInformation?.cabin?.[0]
      ?.compartmentDetails?.columnDetails;
  const Rows = data?.Air_RetrieveSeatMapReply?.seatmapInformation?.row;
  let start =
    data?.Air_RetrieveSeatMapReply?.seatmapInformation?.row?.[0]?.rowDetails
      ?.seatRowNumber;
  let end =
    data?.Air_RetrieveSeatMapReply?.seatmapInformation?.row?.[
      data?.Air_RetrieveSeatMapReply?.seatmapInformation?.row?.length - 1
    ]?.rowDetails?.seatRowNumber;

  // console.log(start, end, "start", "end")
  let seatLayout = [];
  if (columnDetails) {
    for (let i = 0; i < columnDetails?.length; i++) {
      seatLayout.push(columnDetails[i]?.seatColumn);
      if (
        columnDetails[i]?.description === "A" &&
        columnDetails[i + 1]?.description === "A"
      ) {
        seatLayout.push("aisle");
      }
    }
  }
  // console.log(seatLayout, "aisle")
  // console.log(data, "data", seatAmountlist, planeNo, "datattt");
  const createRows = (
    start,
    end,
    classType,
    seatConfig,
    Rows,
    planeNo,
    seatAmountlist
  ) => {
    const rowss = Rows?.map((row, i) => {
      // console.log(row, "lllllllll");
      if (
        row?.rowDetails?.rowCharacteristicDetails?.rowCharacteristic === "Z"
      ) {
        return <></>;
      } else if (row?.cabinFacility) {
        function extractTypeLocation(data) {
          const results = [];
          const locationOrder = { L: 0, LC: 1, C: 2, RC: 3, R: 4 };

          function extract(obj) {
            if (typeof obj === "object" && obj !== null) {
              if ("type" in obj && "location" in obj) {
                results.push({ type: obj.type, location: obj.location });
              }
              for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                  extract(obj[key]);
                }
              }
            } else if (Array.isArray(obj)) {
              for (const item of obj) {
                extract(item);
              }
            }
          }

          extract(data);
          return results.sort(
            (a, b) => locationOrder[a.location] - locationOrder[b.location]
          );
        }
        const result = extractTypeLocation(row);
        const removeDuplicates = (array) => {
          const seen = new Set();
          return array.filter((item) => {
            // Normalize location values
            const normalizedLocation =
              item.location === "LC"
                ? "L"
                : item.location === "RC"
                ? "R"
                : item.location;
            const key = `${item.type}-${normalizedLocation}`;
            return seen.has(key) ? false : seen.add(key);
          });
        };
        let result1 = removeDuplicates(result);
        // console.log(result,"result")
        return (
          <div>
            {/* <Exit /> */}
            <Row
              key={i}
              rowNumber={row?.rowDetails?.seatRowNumber}
              classType={classType}
              seats={seatConfig}
              row={row}
              planeNo={planeNo}
              seatAmountlist={seatAmountlist}
            />
            <div className="plane-row d-flex justify-content-between align-items-center">
              {result1.map((item, key) => {
                return (
                  <div key={key} className="lavatory">
                    {item.type === "LA" ? (
                      <WcIcon color="#fff" />
                    ) : (
                      <BsCupHotFill color="#fff" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      //    else if(row?.rowDetails?.rowCharacteristicDetails?.rowCharacteristic==="E") {
      //         return (<div>
      //             <Exit />
      //             <Row key={i} rowNumber={row?.rowDetails?.seatRowNumber} classType={classType} seats={seatConfig} row={row} />
      //         </div>)
      //     }
      else {
        return (
          <Row
            key={i}
            rowNumber={row?.rowDetails?.seatRowNumber}
            type={row?.rowDetails?.rowCharacteristicDetails?.rowCharacteristic}
            classType={classType}
            seats={seatConfig}
            row={row}
            planeNo={planeNo}
            seatAmountlist={seatAmountlist}
          />
        );
      }
    });
    // console.log(rowss, "rowssssssssssssssss")

    // let rows = [];
    // for (let i = start; i <= end; i++) {
    //     if (i == 13) {
    //         rows.push(<div>
    //             <Exit />
    //             <Row key={i} rowNumber={i} classType={classType} seats={seatConfig} />
    //         </div>)
    //     }
    //     else {

    //         rows.push(<Row key={i} rowNumber={i} classType={classType} seats={seatConfig} />);
    //     }
    // }
    return rowss;
  };

  function convertSeatPrice(seatPrice) {
    // console.log(seatPrice,"seatPrice");
    if (!seatPrice || seatPrice === undefined || seatPrice === null) {
      return [];
    } else if (Array.isArray(seatPrice)) {
      return seatPrice.map((priceObj) => {
        let result = {
          type: "",
          amount: "",
          currency: "",
          seat: [],
        };

        // Extracting seat details
        if (priceObj?.rowDetails) {
          const rowDetails = Array.isArray(priceObj.rowDetails)
            ? priceObj.rowDetails
            : [priceObj.rowDetails];
          rowDetails.forEach((row) => {
            if (Array.isArray(row?.seatOccupationDetails)) {
              row.seatOccupationDetails.forEach((seat) => {
                let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
                if (seat.seatOccupation) {
                  seatDetail += seat.seatOccupation;
                }
                result.seat.push(seatDetail);
              });
            }
          });
        }

        // Extracting monetary details
        if (priceObj?.seatPrice?.monetaryDetails) {
          // console.log(
          //   "Extracting monetary details",
          //   planeNo,
          //   priceObj?.seatPrice?.monetaryDetails?.amount
          // );
          if (String(priceObj?.seatPrice?.monetaryDetails?.amount)) {
            if (priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "TNB") {
              result.type = "offer";
              result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
              result.currency = priceObj?.seatPrice?.monetaryDetails.currency;
            } else if (
              priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "T"
            ) {
              result.type = "full";
              result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
              result.currency = priceObj?.seatPrice?.monetaryDetails?.currency;
            }
          } else {
            if (String(priceObj?.seatPrice?.monetaryDetails?.amount)) {
              // console.log("hiiii");
            }
            // console.log(
            //   "inelse block",
            //   typeof priceObj?.seatPrice?.monetaryDetails
            // );
            priceObj?.seatPrice?.monetaryDetails?.forEach((detail) => {
              if (detail?.typeQualifier === "TNB") {
                result.type = "offer";
                result.amount = detail.amount;
                result.currency = detail.currency;
              } else if (detail?.typeQualifier === "T") {
                result.type = "full";
                result.amount = detail.amount;
                result.currency = detail.currency;
              }
            });
          }
        }

        return result;
      });
    } else {
      let result = {
        type: "",
        amount: "",
        currency: "",
        seat: [],
      };
      const rowDetails = seatPrice.rowDetails;
      rowDetails.forEach((row) => {
        if (Array.isArray(row?.seatOccupationDetails)) {
          row.seatOccupationDetails.forEach((seat) => {
            let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
            if (seat.seatOccupation) {
              seatDetail += seat.seatOccupation;
            }
            result.seat.push(seatDetail);
          });
        }
      });
      // console.log(seatPrice, "Seat Price");
      if (Array.isArray(seatPrice?.seatPrice?.monetaryDetails)) {
        seatPrice?.seatPrice?.monetaryDetails?.forEach((detail) => {
          if (detail?.typeQualifier === "TNB") {
            result.type = "offer";
            result.amount = detail.amount;
            result.currency = detail.currency;
          } else if (detail?.typeQualifier === "T") {
            result.type = "full";
            result.amount = detail.amount;
            result.currency = detail.currency;
          }
        });
      }
      // console.log(result, "else conditionnnnnnn");
      return [result];
    }
  }

  useEffect(() => {
    // console.log(seatPrice, "seatPrice");
    if (seatPrice) {
      const result = convertSeatPrice(seatPrice);
      // console.log(result, planeNo, "result");
      setSeatAmountList(result);
      return;
    } else {
      setSeatAmountList([]);
    }
  }, [seatPrice]);

  return (
    <div className="plane-container">
      <div className="plane">
        <div className="plane-headd">
          {/* <div className="plane-head-div">

                    </div>
                    <div className="plane-head-div1"></div>
                    <div className="plane-head-div2"></div> */}
          <img src={planeHead} />
        </div>

        <div className="plane-body">
          {/* Business Class */}
          {/* {createRows(1, 3, 'business', ['A', 'C', 'aisle', 'D', 'F'])} */}

          {/* Premium Economy Class */}
          {/* {createRows(4, 7, 'premium', ['A', 'B', 'C', 'aisle', 'D', 'E', 'F'])} */}

          {/* Economy Class */}
          {Rows &&
            seatLayout &&
            createRows(8, 30, "", seatLayout, Rows, planeNo, seatAmountlist)}
        </div>

        <div className="palne-tail-container">
          {/* <div className='palin-tail-wing-top'></div> */}
          <div className="plane-taill">
            <img src={planeTail} alt="" />
            {/* <img src={mmt} alt=""  /> */}
            <img className="plane-taill-w" src={planeTail1} alt="" />
          </div>
          {/* <img src={tailImg} className='tail-img' alt="" /> */}
          {/* <div className='palin-tail-wing'></div>
                    <div className='palin-tail-wing-bottom'></div>
                    <div className='palin-tail-wing-cylender'></div> */}
        </div>
      </div>
    </div>
  );
};

function FlightLayout({ data }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const adultCount = queryParams.get("adult");

  const childCount = queryParams.get("child");

  const reducerState = useSelector((state) => state);

  const Traveller = Number(adultCount) + Number(childCount);
  const [dataD, setDataD] = useState([]);
  useEffect(() => {
    if (data !== null) {
      setDataD(data);
      let defaultSeatOccupation = data.map((item, index) => {
        // console.log(item, "defaultSeatOccupationnnItem", index);
        return (
          item?.Air_RetrieveSeatMapReply?.seatmapInformation?.cabin
            ?.compartmentDetails?.defaultSeatOccupation ||
          item?.Air_RetrieveSeatMapReply?.seatmapInformation?.cabin?.[0]
            ?.compartmentDetails?.defaultSeatOccupation
        );
      });
      // console.log(defaultSeatOccupation, data, "defaultSeatOccupationnn");

      dispatch(setDefaultSeatOccupation(defaultSeatOccupation));
    }
  }, [data]);

  let newData = dataD
    .map((item, i) => {
      if (item?.Air_RetrieveSeatMapReply?.errorInformation) {
        return null;
      } else {
        return { ...item, index: i };
      }
    })
    .filter((item) => item !== null);
  const [airports, setAireport] = useState(
    reducerState?.flightList?.aireportList
  );
  const [selected, setSelected] = useState(
    reducerState?.airlineSeatMap?.seatList
  );

  // console.log(reducerState, "mmmmmmm");

  function findAirportByCode(code) {
    const data = airports?.find((airport) => airport?.AirportCode === code);

    return data;
  }

  const totalSeatAmount = (Amount) => {
    let amount = 0;
    if (Amount) {
      amount = Amount.reduce(
        (accumulator, currentValue, currentIndex, array) => {
          return accumulator + currentValue?.amount;
        },
        0
      );
    }
    // console.log(Amount, amount, "amountttttttt");
    return amount;
  };
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
      },
    },
  };
  //old cnnvert functio
  // function convertSeatPrice(seatPrice) {
  //   console.log(seatPrice, "seatPrice");
  //   if (!seatPrice || seatPrice === undefined || seatPrice === null) {
  //     console.log("if block");
  //     return [];
  //   } else if (Array.isArray(seatPrice)) {
  //     return seatPrice.map((priceObj) => {
  //       let result = {
  //         type: "",
  //         amount: "",
  //         currency: "",
  //         seat: [],
  //       };

  //       // Extracting seat details
  //       console.log(priceObj, "priceObj");
  //       if (priceObj?.rowDetails) {
  //         const rowDetails = Array.isArray(priceObj.rowDetails)
  //           ? priceObj.rowDetails
  //           : [priceObj.rowDetails];
  //         rowDetails.forEach((row) => {
  //           if (Array.isArray(row?.seatOccupationDetails)) {
  //             row.seatOccupationDetails.forEach((seat) => {
  //               let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
  //               if (seat.seatOccupation) {
  //                 seatDetail += seat.seatOccupation;
  //               }
  //               result.seat.push(seatDetail);
  //             });
  //           }
  //         });
  //       }

  //       // Extracting monetary details
  //       if (priceObj?.seatPrice?.monetaryDetails) {
  //         if (priceObj?.seatPrice?.monetaryDetails?.currency) {
  //           if (priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "TNB") {
  //             result.type = "offer";
  //             result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
  //             result.currency = priceObj?.seatPrice?.monetaryDetails?.currency;
  //           } else if (
  //             priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "T"
  //           ) {
  //             result.type = "full";
  //             result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
  //             result.currency = priceObj?.seatPrice?.monetaryDetails?.currency;
  //           }
  //         }
  //         priceObj.seatPrice.monetaryDetails.forEach((detail) => {
  //           if (detail?.typeQualifier === "TNB") {
  //             result.type = "offer";
  //             result.amount = detail?.amount;
  //             result.currency = detail?.currency;
  //           } else if (detail?.typeQualifier === "T") {
  //             result.type = "full";
  //             result.amount = detail?.amount;
  //             result.currency = detail?.currency;
  //           }
  //         });
  //       }

  //       return result;
  //     });
  //     return [1];
  //   }
  //   // else {
  //   //   let result = {
  //   //     type: "",
  //   //     amount: "",
  //   //     currency: "",
  //   //     seat: [],
  //   //   };
  //   //   const rowDetails = seatPrice.rowDetails;
  //   //   rowDetails.forEach((row) => {
  //   //     if (Array.isArray(row?.seatOccupationDetails)) {
  //   //       row.seatOccupationDetails.forEach((seat) => {
  //   //         let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
  //   //         if (seat.seatOccupation) {
  //   //           seatDetail += seat.seatOccupation;
  //   //         }
  //   //         result.seat.push(seatDetail);
  //   //       });
  //   //     }
  //   //   });
  //   //   if (seatPrice?.seatPrice.monetaryDetails) {
  //   //     if (typeof seatPrice?.seatPrice.monetaryDetails?.amount == "number") {
  //   //       if (seatPrice?.seatPrice.monetaryDetails?.typeQualifier === "TNB") {
  //   //         result.type = "offer";
  //   //         result.amount = seatPrice?.seatPrice.monetaryDetails?.amount;
  //   //         result.currency = seatPrice?.seatPrice.monetaryDetails?.currency;
  //   //       } else if (
  //   //         seatPrice?.seatPrice.monetaryDetails?.typeQualifier === "T"
  //   //       ) {
  //   //         result.type = "full";
  //   //         result.amount = seatPrice?.seatPrice.monetaryDetails?.amount;
  //   //         result.currency = seatPrice?.seatPrice.monetaryDetails?.currency;
  //   //       }
  //   //     } else if (Array.isArray(seatPrice?.seatPrice.monetaryDetails)) {
  //   //       seatPrice?.seatPrice.monetaryDetails.forEach((detail) => {
  //   //         if (detail?.typeQualifier === "TNB") {
  //   //           result.type = "offer";
  //   //           result.amount = detail.amount;
  //   //           result.currency = detail.currency;
  //   //         } else if (detail?.typeQualifier === "T") {
  //   //           result.type = "full";
  //   //           result.amount = detail.amount;
  //   //           result.currency = detail.currency;
  //   //         }
  //   //       });
  //   //     }
  //   //   }
  //   //   console.log(result, "else conditionnnnnnn");
  //   //   return [result];
  //   // }
  //   // else {
  //   //   return ["1"];
  //   // }
  //   return [2];
  // }
  const convertSeatPrice = (customerCentricData) => {
    if (!customerCentricData) {
      return [];
    } else if (Array.isArray(customerCentricData?.seatPrice)) {
      return customerCentricData?.seatPrice?.map((priceObj, index) => {
        let result = {
          type: "",
          amount: "",
          currency: "",
          seat: [],
        };

        const rowDetails = Array.isArray(priceObj.rowDetails)
          ? priceObj.rowDetails
          : [priceObj.rowDetails];
        rowDetails.forEach((row) => {
          if (Array.isArray(row?.seatOccupationDetails)) {
            row.seatOccupationDetails.forEach((seat) => {
              let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
              // if (seat.seatOccupation) {
              //   seatDetail += seat.seatOccupation;
              // }
              result.seat.push(seatDetail);
            });
          }
        });
        if (Array?.isArray(priceObj?.seatPrice?.monetaryDetails)) {
          priceObj?.seatPrice?.monetaryDetails?.forEach((detail) => {
            if (detail?.typeQualifier === "TNB") {
              result.type = "offer";
              result.amount = detail.amount;
              result.currency = detail.currency;
            } else if (detail?.typeQualifier === "T") {
              result.type = "full";
              result.amount = detail.amount;
              result.currency = detail.currency;
            }
          });
        } else if (priceObj?.seatPrice?.monetaryDetails?.currency) {
          if (priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "TNB") {
            result.type = "offer";
            result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
            result.currency = priceObj?.seatPrice?.monetaryDetails?.currency;
          } else if (
            priceObj?.seatPrice?.monetaryDetails?.typeQualifier === "T"
          ) {
            result.type = "full";
            result.amount = priceObj?.seatPrice?.monetaryDetails?.amount;
            result.currency = priceObj?.seatPrice?.monetaryDetails?.currency;
          }
        }

        return result;
      });
    } else {
      // console.log(customerCentricData?.seatPrice, "else condition ");
      let result = {
        type: "test",
        amount: "",
        currency: "",
        seat: [],
      };

      const rowDetails = Array.isArray(
        customerCentricData?.seatPrice?.rowDetails
      )
        ? customerCentricData?.seatPrice?.rowDetails
        : [customerCentricData?.seatPrice?.rowDetails];
      rowDetails.forEach((row) => {
        if (Array.isArray(row?.seatOccupationDetails)) {
          row.seatOccupationDetails.forEach((seat) => {
            let seatDetail = `${row.seatRowNumber}${seat.seatColumn}`;
            // if (seat.seatOccupation) {
            //   seatDetail += seat.seatOccupation;
            // }
            result.seat.push(seatDetail);
          });
        }
      });

      // console.log(
      //   customerCentricData?.seatPrice?.seatPrice?.monetaryDetails,

      //   "else condition "
      // );
      const Price = customerCentricData?.seatPrice?.seatPrice?.monetaryDetails;
      // console.log(Price, "Price");
      if (Array?.isArray(Price)) {
        Price?.forEach((detail) => {
          if (detail?.typeQualifier === "TNB") {
            result.type = "offer";
            result.amount = detail.amount;
            result.currency = detail.currency;
          } else if (detail?.typeQualifier === "T") {
            result.type = "full";
            result.amount = detail.amount;
            result.currency = detail.currency;
          }
        });
      } else if (Price?.currency) {
        if (Price?.typeQualifier === "TNB") {
          result.type = "offer";
          result.amount = Price?.amount;
          result.currency = Price?.currency;
        } else if (Price?.typeQualifier === "T") {
          result.type = "full";
          result.amount = Price?.amount;
          result.currency = Price?.currency;
        } else {
          result.amount = Price?.amount;
        }
        return [result];
      }

      return result;
    }

    return ["else"];

    // console.log("hiii", customerCentricData);
  };

  useEffect(() => {
    console.log(
      data,
      "data22222",
      reducerState?.airlineSeatMap?.number_of_airline
    );
    if (
      data &&
      data.length >= reducerState?.airlineSeatMap?.number_of_airline
    ) {
      // Initialize an empty array to store the mapped results
      let data2 = [];

      // Map over the data and process it
      data.forEach((item, index) => {
        console.log(index, "map count");

        const result = convertSeatPrice(
          item?.Air_RetrieveSeatMapReply?.seatmapInformation
            ?.customerCentricData
        );

        data2.push(result); // Accumulate results in the array
      });

      // Dispatch after all data is processed
      console.log("All data processed, dispatching", data2);
      dispatch(setAirlineAmount(data2)); // Dispatch the full processed array
    }
  }, [data, dispatch]);

  // return (
  //   <div>
  //     <button
  //       onClick={() => {
  //         convertSeatPrice(data);
  //         console.log(reducerState, data, "reducerState");
  //       }}
  //     >
  //       click
  //     </button>
  //   </div>
  // );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, duration: 1 }}
        // variants={variants}
      >
        {dataD !== null && (
          <Carousel draggable={true} arrows arrowSize={60} infinite={false}>
            {newData.map((d, i) => {
              return (
                <div className="FLightSeatMapBox">
                  <div style={{}} key={i}>
                    <div className="seat-navbar-container">
                      <div className="seat-navbar">
                        <div>
                          <div className="seat-navbar-left-1">
                            <p>
                              {
                                findAirportByCode(
                                  d?.Air_RetrieveSeatMapReply
                                    ?.seatmapInformation?.flightDateInformation
                                    ?.boardPointDetails?.trueLocationId
                                )?.name
                              }
                            </p>
                            <IoIosArrowRoundForward />
                            <p>
                              {
                                findAirportByCode(
                                  d?.Air_RetrieveSeatMapReply
                                    ?.seatmapInformation?.flightDateInformation
                                    ?.offpointDetails?.trueLocationId
                                )?.name
                              }
                            </p>
                          </div>
                          <div className="seat-navbar-left-2">
                            <p>
                              {selected?.[d?.index]?.length} of {Traveller}{" "}
                              Seat(s) Selected
                            </p>
                          </div>
                        </div>
                        <div>
                          {selected?.[d?.index]?.length === 0 ? (
                            <p>Selection pending</p>
                          ) : (
                            <div>
                              <p className="navbar-right-price">{`₹ ${totalSeatAmount(
                                selected?.[d?.index]
                              )}`}</p>
                              <p>Added to fare</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="plane-type">
                        <FlightTypes planeNo={d?.index} />
                        {/* <button
                          onClick={() =>
                            console.log(reducerState, "reducerState")
                          }
                        >
                          reducer state
                        </button> */}
                      </div>
                    </div>

                    <Plane planeNo={d?.index} data={d} />
                  </div>
                </div>
              );
            })}
          </Carousel>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default FlightLayout;
