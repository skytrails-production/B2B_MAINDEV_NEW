import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import SecureStorage from "react-secure-storage";
import { Select } from "antd";
import { DatePicker, Space, Button } from "antd";
import dayjs from "dayjs";
import { apiURL } from "../../../Constants/constant";
import { ipAction, tokenAction } from "../../../Redux/IP/actionIp";
import { clearbookTicketGDS } from "../../../Redux/FlightBook/actionFlightBook";
import { resetAllFareData } from "../../../Redux/FlightFareQuoteRule/actionFlightQuote";
import { swalModal } from "../../../utility/swal";
import { Flex, Spin } from "antd";
import ItenaryRoundFlightResult from "./ItenaryRoundFlightResult";
import ItenaryRoundFlightResultInternational from "./ItenaryRoundFlightResultInternational";
import {
  returnActionClearPackCreation,
  returnActionPackCreation,
} from "../../../Redux/FlightSearch/returnPackCreation/returnPackCreation";
import TravelerCounter from "./TravelerCounter";
const { RangePicker } = DatePicker;

// from data logic (unchanged)
let FromTimeout;
let FromCurrentValue;

const fetchFromCity = (value, callback) => {
  if (FromTimeout) {
    clearTimeout(FromTimeout);
    FromTimeout = null;
  }
  FromCurrentValue = value;
  const cityData = () => {
    axios
      .get(`${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${value}`)
      .then((response) => {
        if (FromCurrentValue === value) {
          const { data } = response.data;
          const result = data.map((item) => ({
            value: item._id,
            name: item.name,
            code: item.code,
            cityCode: item.CityCode,
            item,
          }));
          callback(result);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  if (value) {
    FromTimeout = setTimeout(cityData, 200);
  } else {
    callback([]);
  }
};

const FromSearchInput = (props) => {
  const reducerState = useSelector((state) => state);
  const initialSelectedFromData =
    reducerState?.Itenerary?.flightfromData?.data?.[0];
  const { onItemSelect } = props;
  const [fromData, setFromData] = useState([]);
  const [fromValue, setFromValue] = useState(initialSelectedFromData.name);
  const [selectedItem, setSelectedItem] = useState(initialSelectedFromData);
  const [FromPlaceholder, setFromPlaceholder] = useState("");
  const [FromDisplayValue, setFromDisplayValue] = useState(
    initialSelectedFromData.name
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setFromData([
      {
        value: initialSelectedFromData._id,
        name: initialSelectedFromData.name,
        code: initialSelectedFromData.code,
        cityCode: initialSelectedFromData.CityCode,
        item: initialSelectedFromData,
      },
    ]);
  }, []);

  const handleFromSearch = (newValue) => {
    fetchFromCity(newValue, setFromData);
  };

  const handleFromChange = (newValue) => {
    const selected = fromData.find((d) => d.value === newValue);
    setFromValue(selected ? selected.name : newValue);
    setFromDisplayValue(selected ? selected.name : newValue);
    setSelectedItem(selected ? selected.item : null);
    setInputStyle({ caretColor: "transparent" });
    if (selected) {
      onItemSelect(selected.item);
    }
  };

  const handleFromFocus = () => {
    setFromPlaceholder("From");
    setFromDisplayValue("");
    setInputStyle({});
  };

  const handleFromBlur = () => {
    setFromPlaceholder("");
    setFromDisplayValue(fromValue);
    setInputStyle({ caretColor: "transparent" });
  };

  const renderFromOption = (option) => (
    <div>
      <div>
        {option.name} ({option.cityCode})
      </div>
      <div style={{ color: "gray" }}>{option.code}</div>
    </div>
  );

  return (
    <Select
      showSearch
      style={inputStyle}
      value={FromDisplayValue}
      placeholder={FromPlaceholder || props.placeholder}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleFromSearch}
      onChange={handleFromChange}
      onFocus={handleFromFocus}
      onBlur={handleFromBlur}
      notFoundContent={null}
      options={fromData.map((d) => ({
        value: d.value,
        label: renderFromOption(d),
      }))}
    />
  );
};

// to data logic (unchanged)
let ToTimeout;
let ToCurrentValue;

const fetchToCity = (value, callback) => {
  if (ToTimeout) {
    clearTimeout(ToTimeout);
    ToTimeout = null;
  }
  ToCurrentValue = value;
  const cityData = () => {
    axios
      .get(`${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${value}`)
      .then((response) => {
        if (ToCurrentValue === value) {
          const { data } = response.data;
          const result = data.map((item) => ({
            value: item._id,
            name: item.name,
            code: item.code,
            cityCode: item.CityCode,
            item,
          }));
          callback(result);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  if (value) {
    ToTimeout = setTimeout(cityData, 200);
  } else {
    callback([]);
  }
};

const ToSearchInput = (props) => {
  const { onItemSelect } = props;
  const reducerState = useSelector((state) => state);
  const initialSelectedToData =
    reducerState?.Itenerary?.flighttoData?.data?.[0];
  const [toData, setToData] = useState([]);
  const [toValue, setToValue] = useState(initialSelectedToData.name);
  const [selectedItem, setSelectedItem] = useState(initialSelectedToData);
  const [ToPlaceholder, setToPlaceholder] = useState("");
  const [ToDisplayValue, setToDisplayValue] = useState(
    initialSelectedToData.name
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setToData([
      {
        value: initialSelectedToData._id,
        name: initialSelectedToData.name,
        code: initialSelectedToData.code,
        cityCode: initialSelectedToData.CityCode,
        item: initialSelectedToData,
      },
    ]);
  }, []);

  const handleToSearch = (newValue) => {
    fetchToCity(newValue, setToData);
  };

  const handleToChange = (newValue) => {
    const selected = toData.find((d) => d.value === newValue);
    setToValue(selected ? selected.name : newValue);
    setToDisplayValue(selected ? selected.name : newValue);
    setSelectedItem(selected ? selected.item : null);
    setInputStyle({ caretColor: "transparent" });
    if (selected) {
      onItemSelect(selected.item);
    }
  };

  const handleToFocus = () => {
    setToPlaceholder("To");
    setToDisplayValue("");
    setInputStyle({});
  };

  const handleTOBlur = () => {
    setToPlaceholder("");
    setToDisplayValue(toValue);
    setInputStyle({ caretColor: "transparent" });
  };

  const renderToOption = (option) => (
    <div>
      <div>
        {option.name} ({option.cityCode})
      </div>
      <div style={{ color: "gray" }}>{option.code}</div>
    </div>
  );

  return (
    <Select
      showSearch
      value={ToDisplayValue}
      placeholder={ToPlaceholder || props.placeholder}
      style={inputStyle}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleToSearch}
      onChange={handleToChange}
      onFocus={handleToFocus}
      onBlur={handleTOBlur}
      notFoundContent={null}
      options={toData.map((d) => ({
        value: d.value,
        label: renderToOption(d),
      }))}
    />
  );
};

const ItenaryRoundFlightForm = ({
  closeModal,
  selectedIndex,
  onFlightSelect,
}) => {
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialSelectedFromData =
    reducerState?.Itenerary?.flightfromData?.data?.[0];
  const initialSelectedToData =
    reducerState?.Itenerary?.flighttoData?.data?.[0];
  const [loader, setLoader] = useState(false);
  const [openTravelModal, setOpenTravelModal] = useState(false);
  const [activeIdClass, setActiveIdClass] = useState(2);

  let totalAdults = 0;
  let totalChildren = 0;

  reducerState?.Itenerary?.itenaryPayload?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  const [activeIdChild, setActiveIdChild] = useState(totalChildren);
  const [activeIdInfant, setActiveIdInfant] = useState(0);
  const [activeIdAdult, setActiveIdAdult] = useState(totalAdults);
  const [totalCount, setCountPassanger] = useState(
    Number(totalAdults) + Number(totalChildren)
  );
  const [selectedFrom, setSelectedFrom] = useState(initialSelectedFromData);
  const [selectedTo, setSelectedTo] = useState(initialSelectedToData);
  const [returnDomestic, setReturnResultDomestic] = useState(false);
  const [returnInternational, setReturnResultInternational] = useState(false);
  const [returnResults, setReturnResults] = useState(null);

  const handleFromSelect = (item) => {
    setSelectedFrom(item);
  };

  const handleToSelect = (item) => {
    setSelectedTo(item);
  };

  useEffect(() => {
    dispatch(returnActionClearPackCreation());
    dispatch(ipAction());
  }, []);

  useEffect(() => {
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    dispatch(tokenAction(payload));
  }, [reducerState?.ip?.ipData]);

  // Date handling (unchanged)
  const dateFormat = "DD MMM";
  const initialDepartDate =
    reducerState?.Itenerary?.itenaryPayload?.leavingDate;
  let initialReturnDate = null;
  if (initialDepartDate) {
    const departDate = dayjs(initialDepartDate);
    const returnDate = departDate.add(
      Number(
        reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[0]?.night
      ) + 1,
      "day"
    );
    initialReturnDate = returnDate;
  }

  const [newDepartDate, setNewDepartDate] = useState(initialDepartDate);
  const [newReturnDate, setNewReturnDate] = useState(initialReturnDate);

  const handleRangeChange = (dates, dateStrings) => {
    if (dates) {
      setNewDepartDate(dayjs(dates[0]).format("DD MMM, YY"));
      setNewReturnDate(dayjs(dates[1]).format("DD MMM, YY"));
    } else {
      console.log("Selection cleared");
    }
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const returnSearch = async (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/flight/search/return",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  };

  // Handle form submission
  const handleRoundSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
      TokenId: reducerState?.ip?.tokenData,
      AdultCount: adultCount,
      ChildCount: childCount,
      InfantCount: infantCount,
      DirectFlight: "false",
      OneStopFlight: "false",
      JourneyType: "2",
      PreferredAirlines: null,
      Segments: [
        {
          Origin: selectedFrom.AirportCode,
          Destination: selectedTo.AirportCode,
          FlightCabinClass: activeClassId,
          PreferredDepartureTime: dates[0].format("DD MMM, YY"),
          PreferredArrivalTime: dates[0].format("DD MMM, YY"),
        },
        {
          Origin: selectedTo.AirportCode,
          Destination: selectedFrom.AirportCode,
          FlightCabinClass: activeClassId,
          PreferredDepartureTime: dates[1].format("DD MMM, YY"),
          PreferredArrivalTime: dates[1].format("DD MMM, YY"),
        },
      ],
      Sources: null,
    };

    sessionStorage.setItem("adults", adultCount);
    sessionStorage.setItem("childs", childCount);
    sessionStorage.setItem("infants", infantCount);

    try {
      const response = await returnSearch(payload);
      setReturnResults(response?.data?.data?.Response?.Results); // store the response data
    } catch (error) {
      console.error("Return flight search failed:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (returnResults) {
      setLoader(false);
      if (returnResults?.[1]) {
        setReturnDomestic(true);
        setReturnInternational(false);
      } else {
        setReturnDomestic(false);
        setReturnInternational(true);
      }
    }
  }, [returnResults]);

  const handleTravelerCountChange = (category, value) => {
    if (category === "adult") {
      const newAdultCount = Math.min(Math.max(1, activeIdAdult + value), 9);
      const maxAllowedChild = Math.max(0, 9 - newAdultCount);
      const newChildCount = Math.min(activeIdChild, maxAllowedChild);

      setActiveIdAdult(newAdultCount);
      setActiveIdChild(newChildCount);

      const newInfantCount = Math.min(activeIdInfant, newAdultCount);
      setActiveIdInfant(newInfantCount);
    } else if (category === "child") {
      const newChildCount = Math.min(
        Math.max(0, activeIdChild + value),
        9 - activeIdAdult
      );
      setActiveIdChild(newChildCount);
    } else if (category === "infant") {
      const newInfantCount = Math.min(
        Math.max(0, activeIdInfant + value),
        activeIdAdult
      );
      setActiveIdInfant(newInfantCount);
    }
  };

  const ClassItems = [
    { id: 1, label: "All" },
    { id: 2, label: "Economy" },
    { id: 3, label: "Premium Economy" },
    { id: 4, label: "Business" },
    { id: 5, label: "Premium Business" },
    { id: 6, label: "First" },
  ];

  const handleTravelClickOpen = () => {
    setActiveIdClass(activeIdClass);
    setOpenTravelModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* From */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            From
          </label>
          <div className="relative">
            <FromSearchInput
              placeholder="City or Airport"
              style={{ width: "100%" }}
              onItemSelect={handleFromSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">{selectedFrom?.code}</p>
        </div>

        {/* To */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">To</label>
          <div className="relative">
            <ToSearchInput
              placeholder="City or Airport"
              style={{ width: "100%" }}
              onItemSelect={handleToSelect}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500">{selectedTo?.code}</p>
        </div>

        {/* Dates */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Dates
          </label>
          <div className="flex items-center space-x-2">
            <RangePicker
              onChange={handleRangeChange}
              defaultValue={[dayjs(newDepartDate), dayjs(newReturnDate)]}
              format={dateFormat}
              disabledDate={disablePastDates}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{dayjs(newDepartDate).format("dddd")}</span>
            <span>{dayjs(newReturnDate).format("dddd")}</span>
          </div>
        </div>

        {/* Travelers & Class */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Travelers & Class
          </label>
          <button
            type="button"
            onClick={handleTravelClickOpen}
            className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <div className="flex justify-between items-center">
              <span>{totalCount || 1} Traveler(s)</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {activeIdClass === 1 && "All"}
              {activeIdClass === 2 && "Economy"}
              {activeIdClass === 3 && "Premium Economy"}
              {activeIdClass === 4 && "Business"}
              {activeIdClass === 5 && "Premium Business"}
              {activeIdClass === 6 && "First Class"}
            </div>
          </button>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRoundSubmit}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {loader ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Searching...
            </span>
          ) : (
            "Search Flights"
          )}
        </button>
      </div>

      {/* Traveler & Class Modal */}
      <Transition appear show={openTravelModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    TRAVELLERS & CLASS
                  </Dialog.Title>

                  <div className="mt-6 space-y-6">
                    <TravelerCounter
                      label="Adults (Age 12+ Years)"
                      count={activeIdAdult}
                      onIncrement={() => handleTravelerCountChange("adult", 1)}
                      onDecrement={() => handleTravelerCountChange("adult", -1)}
                    />
                    <TravelerCounter
                      label="Children (Age 2-12 Years)"
                      count={activeIdChild}
                      onIncrement={() => handleTravelerCountChange("child", 1)}
                      onDecrement={() => handleTravelerCountChange("child", -1)}
                    />
                    <TravelerCounter
                      label="Infants (Age 0-2 Years)"
                      count={activeIdInfant}
                      onIncrement={() => handleTravelerCountChange("infant", 1)}
                      onDecrement={() =>
                        handleTravelerCountChange("infant", -1)
                      }
                    />
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Choose Travel Class
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {ClassItems.map((ele) => (
                        <button
                          key={ele.id}
                          type="button"
                          className={`px-4 py-2 rounded-md border transition-colors ${
                            ele.id === activeIdClass
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveIdClass(ele.id)}
                        >
                          {ele.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={closeModal}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Results Section */}
      <div className="mt-10">
        {loader ? (
          <div className="text-center py-10">
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Please Wait we are searching best flights for you!
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Searching across multiple airlines to find the best options...
            </p>
          </div>
        ) : (
          <>
            {returnDomestic && (
              <ItenaryRoundFlightResult
                onFlightSelect={onFlightSelect}
                selectedIndex={selectedIndex}
                closeModal={closeModal}
                result={returnResults}
              />
            )}
            {returnInternational && (
              <ItenaryRoundFlightResultInternational
                onFlightSelect={onFlightSelect}
                selectedIndex={selectedIndex}
                closeModal={closeModal}
                result={returnResults}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ItenaryRoundFlightForm;
