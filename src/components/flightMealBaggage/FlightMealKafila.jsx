import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "flowbite-react";
import {
  setAirlineMeal_retrun,
  setAirlineMeal_onward,
} from "../../Redux/AirlineSeatMapNew/actionAirlineSeatMap";
// import {setAirlineMeal_onward,setAirlineMeal_retrun} from
// import bowlfood from "../../images/meals/bowlfood.png";
import chicken from "../../images/meals/chicken.jpg";
// import chicken2 from "../../images/meals/chicken2.png";
import fruit from "../../images/meals/fruit.jpg";
import hotdog from "../../images/meals/hotdog.jpg";
import juice from "../../images/meals/juice.jpg";
import rice from "../../images/meals/rice.jpg";
import sandwich from "../../images/meals/sandwich.jpg";
import tea from "../../images/meals/tea.jpg";
import nonveg from "../../images/meals/non-veg.jpg";
import freeMeal from "../../images/freemeal.png";
import veg from "../../images/meals/veg.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";
import { findAirportByCode } from "../../utility/flightUtility/BookwarperUtility";
import { Minus, Plus } from "lucide-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
const MealComponent = ({
  mealData,
  origin,
  destination,
  maximumSelection,
  isOnward,
  keyss,
}) => {
  const dispatch = useDispatch();
  const reducerState = useSelector((state) => state);
  // console.log(reducerState, "reducerState");
  const mealStructure = isOnward
    ? reducerState?.airlineSeatMapNew?.onward?.meals
    : reducerState?.airlineSeatMapNew?.return?.meals;
  const [mealCounts, setMealCounts] = useState(mealStructure[keyss]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  // console.log(mealData, "mealCounts", mealCounts);

  const totalCount = mealCounts?.reduce((sum, count) => sum + count, 0);

  const addMeal = (typeParam, index) => {
    setMealCounts((prevCounts) => {
      const updatedCounts = [...prevCounts];
      // console.log(updatedCounts, "updatedCounts");
      if (typeParam === "inc") {
        if (totalCount < maximumSelection) {
          if (updatedCounts[index] < maximumSelection) {
            updatedCounts[index] += 1;
            if (isOnward) {
              dispatch(
                setAirlineMeal_onward({
                  ...mealStructure,
                  [keyss]: updatedCounts,
                })
              );
            } else {
              dispatch(
                setAirlineMeal_retrun({
                  ...mealStructure,
                  [keyss]: updatedCounts,
                })
              );
            }
          } else {
            // alert(
            //   `You can't select more than ${maximumSelection} for this meal.`
            // );
            setToast({
              show: true,
              message: `You can't select more than ${maximumSelection} for this meal.`,
              type: "success",
            });
          }
        } else {
          // alert(`Total selection cannot exceed ${maximumSelection} meals.`);
          setToast({
            show: true,
            message: `Total selection cannot exceed ${maximumSelection} meals.`,
            type: "success",
          });
        }
      } else if (typeParam === "dec") {
        if (updatedCounts[index] > 0) {
          updatedCounts[index] -= 1;
          if (isOnward) {
            dispatch(
              setAirlineMeal_onward({
                ...mealStructure,
                [keyss]: updatedCounts,
              })
            );
          } else {
            dispatch(
              setAirlineMeal_retrun({
                ...mealStructure,
                [keyss]: updatedCounts,
              })
            );
          }
        }
      }

      return updatedCounts;
    });
  };

  // const findMealPrice = () => {
  //   console.log(mealData, "mealDatamealDatamealData");
  // };

  // findMealPrice();

  return (
    <div>
      {/* <h1>{`${origin} - ${destination}`}</h1> */}

      {toast.show && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
          <Toast>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.type === "success"
                  ? "bg-red-100 text-red-500"
                  : "bg-red-100 text-red-500 "
              }`}
            >
              <HiX className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{toast.message}</div>
            <Toast.Toggle
              className="items-center justify-center"
              onClick={() => setToast({ ...toast, show: false })}
            />
          </Toast>
        </div>
      )}

      <div className="sticky w-full top-0 overflow-hidden z-10">
        <div className="seat-navbar-left-1 bg-indigo-100 rounded-md py-2 px-2">
          <p>{findAirportByCode(mealData?.[0]?.Src)?.name}</p>
          <IoIosArrowRoundForward />
          <p>{findAirportByCode(mealData?.[0]?.Des)?.name}</p>
        </div>
        <div className="flex flex-row w-full justify-center px-3 items-center py-2 bg-white">
          <p className="flex-1 text-primary-6000 text-center "></p>
          <p className="flex-1 text-primary-6000 text-center ">Meal Type</p>
          <p className="flex-1 text-primary-6000 text-center ">Price Rate</p>
          <p className="flex-1 text-primary-6000  text-end">Quantity</p>
        </div>
      </div>
      {mealData?.map((item, index) => {
        let vegImage = null;
        let icon = null;

        if (item?.SsrDesc) {
          const description = item.SsrDesc.toLowerCase();

          // Determine vegImage based on the description
          if (
            description.includes("non veg") ||
            description.includes("non-veg") ||
            description.includes("nonveg") ||
            description.includes("chicken")
          ) {
            vegImage = (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <img
                  src={nonveg}
                  alt="Non Veg"
                  className="w-4 h-4 object-contain absolute top-1 left-1"
                />
              </div>
            );
          } else if (description.includes("veg")) {
            vegImage = (
              <img
                src={veg}
                alt="Veg"
                className="w-4 h-4 object-contain absolute top-1 left-1"
              />
            );
          }

          // Determine icon based on the description
          if (description.includes("hotdog")) {
            icon = (
              <img
                src={hotdog}
                alt="Hotdog"
                className="object-contain w-[50%] rounded-md"
                // style={{ height: "50px", width: "50px" }}
              />
            );
          } else if (description.includes("fruit")) {
            icon = (
              <img
                src={fruit}
                alt="Fruit"
                className="object-contain w-[50%] rounded-md"
                // style={{ height: "50px", width: "50px" }}
              />
            );
          } else if (description.includes("rice")) {
            icon = (
              <img
                src={rice}
                alt="Rice"
                className="object-contain w-[50%] rounded-md"
                // style={{ height: "50px", width: "50px" }}
              />
            );
          } else if (description.includes("chicken")) {
            icon = (
              <img
                src={chicken}
                alt="Chicken"
                className="object-contain w-[50%] rounded-md"
                // style={{ height: "50px", width: "50px" }}
              />
            );
          } else if (description.includes("sandwich")) {
            icon = (
              <img
                src={sandwich}
                alt="Sandwich"
                className="object-contain w-[50%] rounded-md"
                // style={{ height: "50px", width: "50px" }}
              />
            );
          } else if (
            description.includes("beverage") ||
            description.includes("juice")
          ) {
            icon = (
              <img
                src={juice}
                alt="Juice"
                className="object-contain w-[50%] rounded-md"
              />
            );
          } else if (
            description.includes("tea") ||
            description.includes("coffee")
          ) {
            icon = (
              <img
                src={tea}
                alt="Tea/Coffee"
                className="object-contain w-[50%] rounded-md"
              />
            );
          } else {
            icon = (
              <img
                src={hotdog}
                alt="Default Icon"
                className="object-contain w-[50%] rounded-md"
              />
            );
          }
        }

        return (
          <div
            key={index}
            className="border-1 shadow-sm rounded-md p-2 flex flex-row mb-2 justify-between mx-"
          >
            <div className="flex-1 flex relative justify-center items-center ">
              <div className=" z-0">
                {vegImage}
                {icon}
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <p className="font-medium text-sm text-center">
                {item.SsrDesc || "Meal Option"}
              </p>
            </div>
            <div className="flex-1 flex justify-center items-center">
              <p className="font-bold">{item?.Price}</p>
            </div>
            <div className="flex-1 flex justify-end items-center gap-2">
              <button
                className=" rounded-full w-6 h-6 flex items-center justify-center bg-primary-6000 hover:bg-primary-700 text-white"
                onClick={() => addMeal("dec", index)}
              >
                <Minus size={14} className="text-white" />
              </button>
              <p style={{ margin: "0 10px" }}>{mealCounts?.[index]}</p>
              <button
                className=" rounded-full w-6 h-6 flex items-center justify-center bg-primary-6000 hover:bg-primary-700 text-white"
                onClick={() => addMeal("inc", index)}
              >
                <Plus size={14} className="text-white" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FlightMealKafila = ({ MealMap, isOnward, isFreeMeal }) => {
  let seatKeys = [];
  const separatedObj = separateFunction(MealMap);

  const adultCount = Number(sessionStorage.getItem("adults"));
  const childCount = Number(sessionStorage.getItem("childs"));
  const numberToSelect = adultCount + childCount;

  function separateFunction(param) {
    seatKeys = [];
    const groupedMeals = new Map();

    param?.forEach((item) => {
      const flightNumber = item?.FNo;
      if (!groupedMeals.has(flightNumber)) {
        groupedMeals.set(flightNumber, []);
        seatKeys.push(flightNumber);
      }
      groupedMeals.get(flightNumber).push(item);
    });
    // console.log(seatKeys, "seatkeysss");

    // Convert Map to an object and preserve order
    const result = {};
    for (const [key, value] of groupedMeals) {
      result[key] = value;
    }

    return result;
  }

  console.log(separateFunction(MealMap), "seatKeys", seatKeys);

  return (
    <>
      {isFreeMeal ? (
        <div className="relative flex flex-row items-center justify-center gap-1">
          <img src={freeMeal} className="w-10 h-10" alt="" />
          <p className="text-[15px]">Free Meal will be included </p>
        </div>
      ) : (
        <div className=" ">
          <div class="swiper favSwiper-active mt-2">
            <div class="swiper-wrapper  relative ">
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
                {seatKeys.map((key) => (
                  <SwiperSlide>
                    <div className="max-h-[35rem] w-[90%] mx-auto overflow-hidden overflow-y-scroll">
                      <MealComponent
                        key={key}
                        mealData={separatedObj[key]}
                        origin={"BOM"}
                        destination={"DEL"}
                        maximumSelection={numberToSelect}
                        isOnward={isOnward}
                        keyss={key}
                      />
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

export default FlightMealKafila;
