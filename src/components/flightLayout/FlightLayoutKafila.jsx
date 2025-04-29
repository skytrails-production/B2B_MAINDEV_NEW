import React, { useState, useEffect } from "react";
// import WcIcon from "@mui/icons-material/Wc";
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

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  number_of_seat_map_onward,
  number_of_seat_map_return,
  setAirlineSeat_onward,
  setAirlineSeat_retrun,
  setDefaultSeatOccupationOnward,
  setDefaultSeatOccupationReturn,
  setAirlineAmountOnward,
  setAirlineAmountReturn,
  setSeatMidAmountOnward,
  setSeatMidAmountReturn,
} from "../../Redux/AirlineSeatMapNew/actionAirlineSeatMap";
// import tailImg from "./tail.svg"
import { motion, AnimatePresence } from "framer-motion";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useLocation } from "react-router-dom";
import planeHead from "./plane option 2.svg";
import planeTail from "./tale part 1-01 (2).svg";
import planeTail1 from "./tale part 2-01.svg";
// import AirSeatMap from "../AirSeatMap/AirSeatMap";
import { findAirportByCode } from "../../utility/flightUtility/BookwarperUtility";

const Seat = ({ seat, planeNo, isOnward }) => {
  // console.log(seat, "seatttt");
  // console.log(Mid, "mid seat");
  const [isToolTip, setToolTip] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //   const adultCount = queryParams.get("adult");
  //   const childCount = queryParams.get("child");
  const adultCount = Number(sessionStorage.getItem("adults"));
  const childCount = Number(sessionStorage.getItem("childs"));
  const traveller = Number(adultCount) + Number(childCount);
  const { seatList, midAmount, amountList } = useSelector((state) => {
    return isOnward
      ? state?.airlineSeatMapNew?.onward
      : state?.airlineSeatMapNew?.return;
  });

  // const allSeats = Object.values(seatList).flat();

  // console.log(allSeats,"all seat list flat");
  const [SEATES, setSEATS] = useState(seatList);
  const [isChecked, setIsChecked] = useState(false);
  const mid = amountList?.[planeNo];
  // console.log("seatmid", mid, seat);
  // const traveller = 3;
  useEffect(() => {
    setSEATS(seatList);
    // console.log(
    //   seatList,
    //   seat,
    //   // selectedSeat,
    //   // "selectedSeat",
    //   planeNo,
    //   // selectedSeat?.[planeNo]?.length,
    //   "sealected seat beforddd",
    //   seatList?.[planeNo]
    // );
    if (
      seatList?.[planeNo]?.findIndex(
        (Seat) => Seat?.SeatCode == seat?.SeatCode
      ) !== -1
    ) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
      // console.log(seat+rowNumber,"elseseeee")
    }
    // console.log(seatList,"seattttttttttttttttttttttttttttttttt")
  }, [seatList]);

  const dispatch = useDispatch();
  const handleSeatClick = () => {
    let selectedSeat = { ...SEATES };
    // if(selectedSeat?.[planeNo]==undefined){
    //     // selectedSeat[planeNo] = []
    //     console.log( selectedSeat[planeNo]," selectedSeat[planeNo]")

    // }
    // console.log(
    //   seatList,
    //   seat,
    //   selectedSeat,
    //   "selectedSeat",
    //   planeNo,
    //   selectedSeat?.[planeNo]?.length,
    //   "sealected seat befor"
    // );
    if (!seat?.Avlt) {
      return false;
    } else if (
      selectedSeat?.[planeNo]?.length === traveller &&
      selectedSeat?.[planeNo]?.findIndex(
        (Seat) => Seat?.SeatCode == `${seat?.SeatCode}`
      ) === -1
    ) {
      // console.log(selectedSeat?.[planeNo]?.length, traveller, "selectedSeat")
      selectedSeat?.[planeNo].shift();

      // selectedSeat?.[planeNo].push(seat);
      selectedSeat?.[planeNo].push({
        // add full seat object
        ...seat,

        // add extra mapped/renamed fields
        AirlineCode: seat.FCode,
        FlightNumber: seat.FNo,
        CraftType: seat.FType,
        Origin: seat.Src,
        Destination: seat.Des,
        AvailabilityType: seat.Avlt,
        RowNo: seat.SeatRow,
        SeatNo: seat.SeatCode,
        Cabin: seat.Compartemnt,
        SSR: seat.SsrDesc,
        Description: seat?.SsrDesc,
      });
      // console.log(selectedSeat, "selectedSeat1")
    } else {
      const index = selectedSeat?.[planeNo]?.findIndex(
        (Seat) => Seat?.SeatCode == `${seat?.SeatCode}`
      );

      if (index !== -1) {
        selectedSeat?.[planeNo]?.splice(index, 1);
      } else {
        // selectedSeat?.[planeNo]?.push(seat);
        selectedSeat?.[planeNo]?.push({
          // add full seat object
          ...seat,

          // add extra mapped/renamed fields
          AirlineCode: seat.FCode,
          FlightNumber: seat.FNo,
          CraftType: seat.FType,
          Origin: seat.Src,
          Destination: seat.Des,
          AvailabilityType: seat.Avlt,
          RowNo: seat.SeatRow,
          SeatNo: seat.SeatCode,
          Cabin: seat.Compartemnt,
          SSR: seat.SsrDesc,
          Description: seat?.SsrDesc,
        });
      }
      // console.log(selectedSeat, "sealected seat beforrr")
      // selectedSeat?.[planeNo]?.push(seat)
      // console.log(selectedSeat, "sealected seat beforrr")
    }
    if (isOnward) {
      dispatch(setAirlineSeat_onward(selectedSeat));
    } else {
      dispatch(setAirlineSeat_retrun(selectedSeat));
    }

    // console.log(selectedSeat, "sealected seat")
  };

  // console.log(seat, "seat")
  // console.log(airlineSeatMap, "airlineSeatMap")
  // console.log(planeNo, "planeNo")
  const handleToolTip = (check) => {
    if (check === 1) {
      setToolTip(true);
    } else {
      setToolTip(false);
    }
  };

  return (
    <div
      onClick={() => handleSeatClick()}
      onMouseOver={() => handleToolTip(1)}
      onMouseLeave={() => handleToolTip(2)}
      className={`seat seat-default ${
        seat?.Price == 0 && seat?.Avlt ? "free-seat" : ""
      }
      ${
        seat?.Price !== 0 && seat?.Avlt && seat?.Price < mid
          ? "seat-price-low"
          : ""
      }
      ${
        seat?.Price !== 0 && seat?.Avlt && seat?.Price > mid
          ? "seat-price-high"
          : ""
      }
        
         ${!seat?.Avlt ? "seat-occupied" : ""}
         ${isChecked ? "seatSelected" : ""} 
 
     
        `}
      // className="seat seat-price-low"
    >
      {/* {SeatChar?.AvailablityType?.[seat?.AvailablityType]} */}
      {isToolTip && (
        <div className="tooltip-air">
          {!seat?.Avlt ? (
            "Sorry! This seat is taken"
          ) : (
            <>
              <div className="tooltip-title-box">
                <p style={{ fontWeight: "700" }}>{seat?.SeatCode}</p>
                <p style={{ fontWeight: "700" }}>{seat?.SsrDesc}</p>
                <p style={{ fontWeight: "700" }}>
                  ₹ {seat?.Price || 0}
                  {seat?.Currency}
                </p>
              </div>
              {/* {outputArray && (
                <div className="tooltip-title-box">
                  {outputArray.map((item) => {
                    return <p>{item}</p>;
                  })}
                </div>
              )} */}
            </>
          )}
        </div>
      )}
    </div>
  );
};
const Row = ({ row, planeNo, Mid, isOnward }) => {
  // console.log(row, "row")
  return (
    <div className="plane-row flex justify-center items-center flex-1 ">
      {row?.map((seat, i) => {
        let len = row?.length;
        let isAisle = false;
        if (i < len - 1) {
          // console.log(row?.[i + 1], "row?.[i + 1]");
          if (
            seat?.SsrDesc?.includes("AISLE") &&
            row?.[i + 1] &&
            row?.[i + 1]?.SsrDesc?.includes("AISLE")
          ) {
            isAisle = true;
          }
        }

        return (
          <div>
            {isAisle ? (
              <div className="flex">
                <Seat
                  seat={seat}
                  key={i}
                  planeNo={planeNo}
                  Mid={Mid}
                  isOnward={isOnward}
                />
                <div className="aisle seat"></div>
              </div>
            ) : (
              <Seat
                seat={seat}
                key={i}
                planeNo={planeNo}
                Mid={Mid}
                isOnward={isOnward}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Plane = ({ data, planeNo, Mid, isOnward }) => {
  //   const seatList = useSelector((state) => {
  //     return isOnward
  //       ? state?.airlineSeatMapNew?.onward?.seatList
  //       : state?.airlineSeatMapNew?.return?.seatList;
  //   });
  //   const airlineSeatMap = useSelector((state) => {
  //     return isOnward
  //       ? state?.airlineSeatMapNew?.onward
  //       : state?.airlineSeatMapNew?.return;
  //   });
  //   const amount = useSelector((state) => {
  //     return isOnward
  //       ? state?.airlineSeatMapNew?.onward?.amountTVO
  //       : state?.airlineSeatMapNew?.return?.amountTVO;
  //   });
  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     const Amount = seatList?.[planeNo]?.reduce((accumulator, seat) => {
  //       return accumulator + seat?.Price;
  //     }, 0);
  //     if (amount.length >= planeNo) {
  //       amount[planeNo] = [Amount];
  //     }
  //     if (isOnward) {
  //       dispatch(setSeatAmountTvoOnward(amount));
  //     } else {
  //       dispatch(setSeatAmountTvoRetrun(amount));
  //     }

  //     // console.log(airlineSeatMap, Amount, amount[planeNo], "Amount");
  //   }, [seatList]);

  return (
    <div className="plane-container">
      <div className="plane">
        <div className="plane-headd">
          <img src={planeHead} />
        </div>

        <div className="plane-body">
          {data?.map((row, i) => {
            // console.log(row, "rowwww");
            return (
              <div className="plane-row">
                <Row
                  planeNo={planeNo}
                  row={row}
                  Mid={Mid}
                  isOnward={isOnward}
                />
              </div>
            );
          })}
        </div>

        <div className="palne-tail-container">
          {/* <div className='palin-tail-wing-top'></div> */}
          <div className="plane-taill">
            <img src={planeTail} alt="" />
            {/* <img src={mmt} alt=""  /> */}
            <img className="plane-taill-w" src={planeTail1} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
const FlightTypes = ({ planeNo, isOnward }) => {
  //   const Amount = useSelector((state) => state?.airlineSeatMap?.amountList);
  const Amount = useSelector((state) => {
    // console.log(
    //   state?.airlineSeatMapNew?.onward?.amountList,
    //   state?.airlineSeatMap?.return?.amountList,
    //   isOnward,
    //   "state?.airlineSeatMap?.return?.amountList"
    // );
    return isOnward
      ? state?.airlineSeatMapNew?.onward?.amountTVO
      : state?.airlineSeatMap?.return?.amountTVO;
  });

  // console.log(Amount.flat(), "amountList", Amount);

  const [seatAmount, setSeatAmount] = useState([]);
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  let Mid;
  const typeFun = (data) => {
    // console.log(data, "typeFundata");
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
      {
        title: "Legroom",
        color: "red",
        class: "legroom seat-occupied",
      },
    ];

    console.log(data, "flighTypesData");
    if (!data) {
      return type;
    }
    let data2 = !Array.isArray(data) ? [data] : data;
    // console.log(data, "data");

    // let data2 = Array.from(
    //   new Set(
    //     data1.map((item) => {
    //       return item.amount;
    //     })
    //   )
    // );
    // data2.sort((a, b) => b - a);
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
        class: "seat-price-high",
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
        title: `₹ ${maxHigh}-${minHigh}`,
        color: "red",
        class: "seat-price-high",
      });
      type.push({
        title: `₹ ${maxLow}-${minLow}`,
        color: "red",
        class: "seat-price-low",
      });
      // console.log(maxHigh, minHigh, maxLow, minLow);
      Mid = minHigh;
    }
    // console.log(Mid, "type");

    return type;
  };
  // console.log(Amount?.[planeNo], Amount, "AmountPlane");
  const Type = typeFun(Amount?.[planeNo]);
  // useEffect(() => {
  //   // console.log(Mid, "setSeatMidAmountOnward");
  //   if (isOnward) {
  //     dispatch(setSeatMidAmountOnward(Mid));
  //   } else {
  //     dispatch(setSeatMidAmountReturn(Mid));
  //   }
  //   // dispatch(setSeatMidAmountRe(Mid));
  // }, [Amount, planeNo]);

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

const FlightLayoutKafila = ({ seatMap, isOnward }) => {
  let selected = useSelector((state) => {
    return isOnward
      ? state.airlineSeatMapNew?.onward?.seatList
      : state.airlineSeatMapNew?.return?.seatList;
  });
  //   const childCount = queryParams.get("child");
  const adultCount = Number(sessionStorage.getItem("adults"));
  const childCount = Number(sessionStorage.getItem("childs"));
  const traveller = Number(adultCount) + Number(childCount);
  const totalSeatAmount = (Amount) => {
    let amount = 0;
    if (Amount) {
      amount = Amount.reduce(
        (accumulator, currentValue, currentIndex, array) => {
          return accumulator + currentValue?.Price;
        },
        0
      );
    }
    // console.log(Amount, amount, "amountttttttt");
    return amount;
  };
  return (
    <>
      {seatMap !== null && (
        // <Carousel draggable={true} arrows arrowSize={60} infinite={false}>
        //   {newData.map((d, i) => {
        //     return (

        //     );
        //   })}
        // </Carousel>

        <div className=" ">
          <div class="swiper favSwiper-active mt-2">
            <div class="swiper-wrapper  relative">
              {seatMap?.length > 1 && (
                <div className="custom-navigation">
                  <button className="custom-prev">
                    <div className="h-6 w-6 flex justify-center items-center">
                      <i className="fa fa-chevron-left"></i>
                    </div>
                  </button>
                  <button className=" custom-next">
                    <div className="h-6 w-6 flex justify-center items-center">
                      <i className="fa fa-chevron-right"></i>
                    </div>
                  </button>
                </div>
              )}
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                // loop={true}
                spaceBetween={25}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 1,
                  },
                  1280: {
                    slidesPerView: 1,
                  },
                  1280: {
                    slidesPerView: 1,
                  },
                  0: {
                    slidesPerView: 1,
                  },
                }}
                navigation={{
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                }}
              >
                {seatMap.map((d, i) => (
                  <SwiperSlide>
                    <div className="FLightSeatMapBox">
                      <div style={{}} key={i}>
                        <div className="seat-navbar-container">
                          <div className="seat-navbar">
                            <div>
                              <div className="seat-navbar-left-1">
                                <p>
                                  {findAirportByCode(d?.[0]?.[0]?.Src)?.name}
                                </p>
                                <IoIosArrowRoundForward />
                                <p>
                                  {findAirportByCode(d?.[0]?.[0]?.Des)?.name}
                                </p>
                              </div>
                              <div className="seat-navbar-left-2">
                                <p>
                                  {selected?.[i]?.length} of {traveller} Seat(s)
                                  Selected
                                </p>
                              </div>
                            </div>
                            <div>
                              {selected?.[i]?.length === 0 ? (
                                <p>Selection pending</p>
                              ) : (
                                <div>
                                  <p className="navbar-right-price">{`₹ ${totalSeatAmount(
                                    selected?.[i]
                                  )}`}</p>
                                  <p>Added to fare</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="plane-type">
                            <FlightTypes planeNo={i} isOnward={isOnward} />
                            {/* <button
                                onClick={() =>
                                  console.log(reducerState, "reducerState")
                                }
                              >
                                reducer state
                              </button> */}
                          </div>
                        </div>

                        <Plane planeNo={i} data={d} isOnward={isOnward} />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightLayoutKafila;
