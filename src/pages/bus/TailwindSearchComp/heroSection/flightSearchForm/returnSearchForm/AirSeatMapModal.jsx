import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { FaEdit, FaCheckCircle } from "react-icons/fa";
import FlightLayout from "../../../../flightLayout/FlightLayout";
import { useSelector } from "react-redux";
import FlightLayoutAMD from "../../../../flightLayout/FlightLayoutAmd";
import FlightLayoutTVO from "../../../../flightLayout/FlightLayoutTBONew";
import { GiCarSeat } from "react-icons/gi";
import { PiSeatDuotone } from "react-icons/pi";
import {
  MdNoMealsOuline,
  MdOutlineAirlineSeatReclineNormal,
} from "react-icons/md";
import { PiSeatBold } from "react-icons/pi";
import { Luggage } from "lucide-react";
import FlightMealTBO from "../../../../flightMealBaggage/FlightMealTBO";
import FlightBaggageTBO from "../../../../flightMealBaggage/FlightBaggageTBO";
import { findSeatMealBaggagePrice } from "../../../../../utility/flightUtility/BookwarperUtility";
import FlightLayoutKafila from "../../../../flightLayout/FlightLayoutKafila";
import FlightMealKafila from "../../../../flightMealBaggage/FlightMealKafila";
import FlightBaggageKafila from "../../../../flightMealBaggage/FlightBaggageKafila";
const AirSeatMapModal = ({
  passengerData,
  isSeatModal,
  closeSeatModal,
  handleSkipToPayment,
}) => {
  const [isOnward, setIsOnwards] = useState(true);
  const [tabIndex, setTabIndex] = useState(1);
  const reducerState = useSelector((state) => state);
  // console.log(reducerState, "reducerState");
  const Onward = reducerState?.returnSelected?.returnSelectedFlight?.onward;
  const Return = reducerState?.returnSelected?.returnSelectedFlight?.return;
  const selectedFlight = isOnward ? Onward : Return;
  // console.log(Onward, "return ");
  const tabList =
    selectedFlight?.type === "TBO" || selectedFlight?.type === "KAFILA"
      ? [
          { tilte: "Seat", icon: <MdOutlineAirlineSeatReclineNormal /> },
          { tilte: "Meal", icon: <MdNoMealsOuline /> },
          { tilte: "Baggage", icon: <Luggage /> },
        ]
      : [{ tilte: "Seat", icon: <GiCarSeat /> }];

  const freeMeal =
    (selectedFlight?.type === "TBO" &&
      selectedFlight?.flight?.IsFreeMealAvailable) ||
    false;

  // console.log(freeMeal, "free meal");
  const seatList = isOnward
    ? reducerState?.airlineSeatMapNew?.onward?.seatMap
    : reducerState?.airlineSeatMapNew?.return?.seatMap;
  const baggageList = isOnward
    ? reducerState?.airlineSeatMapNew?.onward?.baggageList
    : reducerState?.airlineSeatMapNew?.return?.baggageList;
  const mealsList = isOnward
    ? reducerState?.airlineSeatMapNew?.onward?.mealsList
    : reducerState?.airlineSeatMapNew?.return?.mealsList;

  const seatbaggagePrice = findSeatMealBaggagePrice();
  console.log(mealsList, "seatbaggagePriceee");

  return (
    <Modal
      className=" "
      show={isSeatModal}
      size="4xl"
      onClose={() => closeSeatModal()}
    >
      <Modal.Header className="px-4 py-2 text-md font-bold w-full ">
        <h3 className="mb-0 text-lg flex items-center gap-2 text-gray-600 font-semibold ">
          Add On's <i class="fa-solid fa-plus"></i>
        </h3>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <div className="space-y-6 relative">
          {Return && (
            <div className="flex gap-4 justify-center mt-4">
              <button
                onClick={() => {
                  setIsOnwards(true);
                  setTabIndex(1);
                }}
                className={
                  isOnward
                    ? "flex items-center justify-center w-full bg-primary-6000 text-white hover:bg-primary-700 rounded-md py-2 font-semibold shadow-sm transition-all"
                    : "flex items-center justify-center w-full bg-white text-primary-600 border-[1px]  hover:bg-primary-50 rounded-md py-2  border-primary-6000 font-semibold shadow-sm transition-all text-primary-6000"
                }
              >
                {/* <FaEdit className="mr-2 text-primary-6000" /> */}
                Onward
              </button>
              <button
                onClick={() => {
                  setIsOnwards(false);
                  setTabIndex(1);
                }}
                className={
                  !isOnward
                    ? "flex items-center justify-center w-full bg-primary-6000 text-white hover:bg-primary-700 rounded-md py-2 font-semibold shadow-sm transition-all"
                    : "flex items-center justify-center w-full bg-white text-primary-600 border-[1px]  hover:bg-primary-50 rounded-md py-2  border-primary-6000 font-semibold shadow-sm transition-all text-primary-6000"
                }
              >
                {/* <FaCheckCircle className="mr-2 " /> */}
                Return
              </button>
            </div>
          )}

          <div className="flex gap-2 justify-start items-center mt-4">
            {tabList.map((item, index) => {
              return (
                <button
                  onClick={() => setTabIndex(index + 1)}
                  className={
                    tabIndex === index + 1
                      ? "flex items-center gap-2 justify-center px-4 bg-primary-50  border-b-2 border-primary-6000 text-primary-6000   py-2 font-semibold shadow-sm transition-all"
                      : "flex items-center gap-2 justify-center px-4 text-primary-600  text-gray-800 hover:bg-primary-50  py-2   font-semibold  transition-all"
                  }
                >
                  {item.icon}
                  {item.tilte}
                </button>
              );
            })}
          </div>
          {seatList && tabIndex == 1 && selectedFlight?.type == "AMD" && (
            <FlightLayoutAMD data={seatList} isOnward={isOnward} />
          )}
          {seatList && tabIndex == 1 && selectedFlight?.type == "TBO" && (
            <FlightLayoutTVO seatMap={seatList} isOnward={isOnward} />
          )}
          {seatList && tabIndex == 1 && selectedFlight?.type == "KAFILA" && (
            <FlightLayoutKafila seatMap={seatList} isOnward={isOnward} />
          )}
          {/* {data && <FlightLayoutTVO seatMap={data} isOnward={isOnward} />} */}
          {/* {data && !isOnward && (
            <FlightLayoutAMD data={data} isOnward={isOnward} />
            )} */}
          {/* {mealsList && tabIndex == 2 && (
            <FlightMealTBO MealMap={mealsList} isOnward={isOnward} />
          )} */}

          {tabIndex == 2 && isOnward && selectedFlight?.type == "TBO" && (
            <FlightMealTBO
              MealMap={mealsList}
              isOnward={isOnward}
              isFreeMeal={freeMeal}
            />
          )}
          {tabIndex == 2 && !isOnward && selectedFlight?.type == "TBO" && (
            <FlightMealTBO
              MealMap={mealsList}
              isOnward={isOnward}
              isFreeMeal={freeMeal}
            />
          )}
          {mealsList &&
            tabIndex == 2 &&
            isOnward &&
            selectedFlight?.type == "KAFILA" && (
              <FlightMealKafila
                MealMap={mealsList}
                isOnward={isOnward}
                isFreeMeal={freeMeal}
              />
            )}
          {mealsList &&
            tabIndex == 2 &&
            !isOnward &&
            selectedFlight?.type == "KAFILA" && (
              <FlightMealKafila
                MealMap={mealsList}
                isOnward={isOnward}
                isFreeMeal={freeMeal}
              />
            )}

          {baggageList &&
            tabIndex == 3 &&
            isOnward &&
            selectedFlight?.type == "TBO" && (
              <FlightBaggageTBO BaggageMap={baggageList} isOnward={isOnward} />
            )}
          {baggageList &&
            tabIndex == 3 &&
            !isOnward &&
            selectedFlight?.type == "TBO" && (
              <FlightBaggageTBO BaggageMap={baggageList} isOnward={isOnward} />
            )}
          {baggageList &&
            tabIndex == 3 &&
            isOnward &&
            selectedFlight?.type == "KAFILA" && (
              <FlightBaggageKafila
                BaggageMap={baggageList}
                isOnward={isOnward}
              />
            )}
          {baggageList &&
            tabIndex == 3 &&
            !isOnward &&
            selectedFlight?.type == "KAFILA" && (
              <FlightBaggageKafila
                BaggageMap={baggageList}
                isOnward={isOnward}
              />
            )}
        </div>
      </Modal.Body>
      <Modal.Footer className="w-full justify-end py-2">
        <div className="flex justify-end my-2">
          <button
            onClick={handleSkipToPayment}
            className="px-5 py-2 rounded-md bg-primary-6000 text-white hover:bg-primary-700"
          >
            Skip to Payment
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AirSeatMapModal;
