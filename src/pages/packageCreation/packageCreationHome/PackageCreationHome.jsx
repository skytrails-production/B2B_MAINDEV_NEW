import { apiURL } from "../../../Constants/constant";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Combobox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
  MinusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import {
  clearFlightSelectedIteneraryReducer,
  clearItenaryRecuder,
  hotelActionItenerary,
  itenerarysearchRequest,
  savePayloadrRequest,
} from "../../../Redux/Itenary/itenary";
import { clearHotelReducer } from "../../../Redux/Hotel/hotel";

// Initial data constants
const initialSelectedFromData = {
  Destination: "New Delhi",
  StateProvinceCode: "DL",
  cityid: "130443",
  country: "India",
  countrycode: "IN",
  stateprovince: "DELHI",
  __v: 0,
  _id: "63fc59c1ec25cae0ebcfd9b1",
};

const initialSelectedToData = {
  countryCode: "IN",
  countryCode3: "IND",
  countryName: "India",
};

const initialSelectedLeavingData = {
  Destination: "New Delhi",
  StateProvinceCode: "DL",
  cityid: "130443",
  country: "India",
  countrycode: "IN",
  stateprovince: "DELHI",
  __v: 0,
  _id: "63fc59c1ec25cae0ebcfd9b1",
};

// Custom Select Components
const CitySearchInput = ({ initialValue, onItemSelect, placeholder }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialValue);
  const [items, setItems] = useState([initialValue]);

  const fetchCities = async (value) => {
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/city/hotelCitySearch?keyword=${value}`
      );
      const results = response.data.data.map((item) => ({
        ...item,
        item, // Include the full item for reference
      }));
      setItems(results);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => fetchCities(query), 200);
      return () => clearTimeout(timer);
    }
  }, [query]);

  return (
    <Combobox
      value={selected}
      onChange={(value) => {
        setSelected(value);
        onItemSelect(value.item || value);
      }}
    >
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(item) => item?.Destination || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {items.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              items.map((item) => (
                <Combobox.Option
                  key={item.cityid}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.Destination} ({item.countrycode})
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

const NationalityInput = ({ onItemSelect }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialSelectedToData);
  const [items, setItems] = useState([initialSelectedToData]);

  const fetchCountries = async (value) => {
    try {
      const response = await axios.get(
        `${apiURL.baseURL}/skyTrails/grnconnect/getcountrylist`
      );
      const filtered = response.data.data
        .filter((item) =>
          item.countryName.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => ({
          ...item,
          value: item.countryCode,
          item,
        }));
      setItems(filtered);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => fetchCountries(query), 200);
      return () => clearTimeout(timer);
    }
  }, [query]);

  return (
    <Combobox
      value={selected}
      onChange={(value) => {
        setSelected(value);
        onItemSelect(value.item || value);
      }}
    >
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(item) => item?.countryName || ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Select Nationality"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {items.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              items.map((item) => (
                <Combobox.Option
                  key={item.value}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.countryName} ({item.countryCode})
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

const PackageCreationHome = () => {
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [selectNationality, setSelectNationality] = useState(
    initialSelectedToData
  );
  const [itineraryItems, setItineraryItems] = useState([
    { from: initialSelectedFromData, night: null },
  ]);
  const [selectedLeaving, setSelectedLeaving] = useState(
    initialSelectedLeavingData
  );
  const [loader, setLoader] = useState(false);
  const [clientName, setClientName] = useState("");
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Date handling
  const dateFormat = "DD MMM, YY";
  const today = dayjs().format(dateFormat);
  const [newDepartDate, setNewDepartDate] = useState(today);

  // Traveler selection
  const [condition, setCondition] = useState(1);
  const [formDataDynamic, setFormData] = useState([
    {
      NoOfAdults: 1,
      NoOfChild: 0,
      ChildAge: [],
    },
  ]);

  // Other form fields
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [whoisTravelling, setWhoisTravelling] = useState(null);
  const [ratingData, setRatingData] = useState(null);

  // Initialize
  useEffect(() => {
    dispatch(clearHotelReducer());
    dispatch(clearFlightSelectedIteneraryReducer());
    dispatch(clearItenaryRecuder());
  }, [dispatch]);

  // Handler functions
  const handleNationalitySelect = (item) => setSelectNationality(item);
  const handleLeavingSelect = (item) => setSelectedLeaving(item);

  const handleFromSelect = (index, item) => {
    const newItems = [...itineraryItems];
    newItems[index].from = item;
    setItineraryItems(newItems);
  };

  const handleNightSelect = (index, value) => {
    const newItems = [...itineraryItems];
    newItems[index].night = value;
    setItineraryItems(newItems);
  };

  const handleAddItem = () => {
    setItineraryItems([
      ...itineraryItems,
      { from: initialSelectedFromData, night: null },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItems = itineraryItems.filter((_, i) => i !== index);
    setItineraryItems(newItems);
  };

  const handleRangeChange = (date) => {
    if (date) {
      setNewDepartDate(dayjs(date).format(dateFormat));
    }
  };

  const disablePastDates = (current) =>
    current && current < dayjs().startOf("day");

  // Traveler modal handlers
  const handleConditionChange = (e) => {
    const newCondition = parseInt(e.target.value);
    setCondition(newCondition);
    setFormData(
      Array.from({ length: newCondition }, () => ({
        NoOfAdults: 1,
        NoOfChild: 0,
        ChildAge: [],
      }))
    );
  };

  const handleFormChange = (index, key, value) => {
    const updatedFormData = [...formDataDynamic];
    if (key === "NoOfAdults" && value > 8) value = 8;
    updatedFormData[index][key] = value;

    if (key === "NoOfChild") {
      updatedFormData[index]["ChildAge"] =
        value === 0 ? [] : Array.from({ length: value }, () => 1);
    }

    setFormData(updatedFormData);
  };

  const handleChildAgeChange = (index, childIndex, value) => {
    const updatedFormData = [...formDataDynamic];
    updatedFormData[index].ChildAge[childIndex] = value;
    setFormData(updatedFormData);
  };

  // Calculate traveler counts
  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);

  useEffect(() => {
    const adults = formDataDynamic.reduce(
      (sum, data) => sum + data.NoOfAdults,
      0
    );
    const children = formDataDynamic.reduce(
      (sum, data) => sum + data.NoOfChild,
      0
    );
    setNumAdults(adults);
    setNumChildren(children);
  }, [formDataDynamic]);

  // Form submission
  const handleItenarySubmit = () => {
    setLoader(true);

    const payload = {
      cityAndNight: itineraryItems,
      clientName,
      leavingFrom: selectedLeaving,
      nationality: selectNationality,
      leavingDate: newDepartDate,
      RoomGuests: [...formDataDynamic],
      interest: selectedInterest,
      whoisTravelling,
      ratingData,
    };
    dispatch(savePayloadrRequest(payload));

    let currentCheckInDate = dayjs(newDepartDate);

    itineraryItems.forEach((item) => {
      const payloadSearch = {
        origin: selectedLeaving?.Destination?.toLowerCase(),
        destination: item?.from?.Destination?.toLowerCase(),
        noOfDays: item?.night,
      };
      dispatch(itenerarysearchRequest(payloadSearch));

      const payloadHotel = {
        CheckInDate: currentCheckInDate.format("DD/MM/YYYY"),
        NoOfNights: item?.night,
        CountryCode: item?.from?.countrycode,
        CityId: item?.from?.cityid,
        ResultCount: null,
        PreferredCurrency: "INR",
        GuestNationality: "IN",
        NoOfRooms: condition,
        RoomGuests: [...formDataDynamic],
        MaxRating: 5,
        MinRating: 3,
        ReviewScore: null,
        IsNearBySearchAllowed: false,
        EndUserIp: reducerState?.ip?.ipData,
        TokenId: reducerState?.ip?.tokenData,
      };

      dispatch(hotelActionItenerary(payloadHotel));
      currentCheckInDate = currentCheckInDate.add(item.night, "day");
    });

    navigate("/packagecreationresult");
  };

  // Nights options
  const nights = Array.from({ length: 30 }, (_, index) => index + 1);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Customized Holidays
          </h2>
        </div>

        {/* Itinerary Items */}
        {itineraryItems.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
            <div className="col-span-12 sm:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <CitySearchInput
                initialValue={item.from}
                onItemSelect={(item) => handleFromSelect(index, item)}
                placeholder="Search destination"
              />
            </div>

            <div className="col-span-8 sm:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nights
              </label>
              <select
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={item.night || ""}
                onChange={(e) =>
                  handleNightSelect(index, parseInt(e.target.value))
                }
              >
                <option value="">Select nights</option>
                {nights.map((night) => (
                  <option key={night} value={night}>
                    {night} Night{night !== 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-4 sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <MinusCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Another City
          </button>
        </div>

        {/* Form Fields */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leaving City
              </label>
              <CitySearchInput
                initialValue={selectedLeaving}
                onItemSelect={handleLeavingSelect}
                placeholder="Search leaving city"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationality
              </label>
              <NationalityInput onItemSelect={handleNationalitySelect} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Leaving On
              </label>
              <input
                type="date"
                min={dayjs().format("YYYY-MM-DD")}
                value={dayjs(newDepartDate, dateFormat).format("YYYY-MM-DD")}
                onChange={(e) => handleRangeChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Travelers
              </label>
              <button
                type="button"
                onClick={() => setIsTravelModalOpen(true)}
                className="w-full text-left rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                {condition} Room, {numAdults} Adults, {numChildren} Children
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest
              </label>
              <select
                value={selectedInterest || ""}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Select interest</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Luxury">Luxury</option>
                <option value="Leisure">Leisure</option>
                <option value="Spa">Spa</option>
                <option value="History">History</option>
                <option value="Art&Culture">Art & Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traveling As
              </label>
              <select
                value={whoisTravelling || ""}
                onChange={(e) => setWhoisTravelling(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Select option</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Star Rating
              </label>
              <select
                value={ratingData || ""}
                onChange={(e) => setRatingData(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">Select rating</option>
                <option value="recommended">Recommended</option>
                <option value="3">3 Star</option>
                <option value="4">4 Star</option>
                <option value="5">5 Star</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleItenarySubmit}
              disabled={loader}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-6000 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loader ? (
                "Searching..."
              ) : (
                <>
                  <MagnifyingGlassIcon className="-ml-1 mr-3 h-5 w-5" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Traveler Modal */}
      <Transition appear show={isTravelModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsTravelModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
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
                as={Fragment}
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
                    Travelers
                  </Dialog.Title>

                  <div className="mt-4">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rooms
                      </label>
                      <select
                        value={condition}
                        onChange={handleConditionChange}
                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num} Room{num !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {Array.from({ length: condition }).map((_, index) => (
                      <div
                        key={index}
                        className="mb-6 border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                      >
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                          ROOM {index + 1}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adults
                            </label>
                            <select
                              value={formDataDynamic[index]?.NoOfAdults || 1}
                              onChange={(e) =>
                                handleFormChange(
                                  index,
                                  "NoOfAdults",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Children
                            </label>
                            <select
                              value={formDataDynamic[index]?.NoOfChild || 0}
                              onChange={(e) =>
                                handleFormChange(
                                  index,
                                  "NoOfChild",
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            >
                              {[0, 1, 2, 3, 4].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {formDataDynamic[index]?.NoOfChild > 0 && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Children Ages
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {Array.from({
                                length: formDataDynamic[index]?.NoOfChild,
                              }).map((_, childIndex) => (
                                <div key={childIndex}>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Child {childIndex + 1}
                                  </label>
                                  <select
                                    value={
                                      formDataDynamic[index]?.ChildAge?.[
                                        childIndex
                                      ] || 1
                                    }
                                    onChange={(e) =>
                                      handleChildAgeChange(
                                        index,
                                        childIndex,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                                  >
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <option key={i} value={i + 1}>
                                        {i + 1} year{i !== 0 ? "s" : ""}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsTravelModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsTravelModalOpen(false)}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default PackageCreationHome;
