import { apiURL } from "../../../Constants/constant";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./packageHome.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import "./itenary.css";
import { Input, Select } from "antd";
import { DatePicker, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  clearFlightSelectedIteneraryReducer,
  clearItenaryRecuder,
  hotelActionItenerary,
  itenerarysearchRequest,
  savePayloadrRequest,
} from "../../../Redux/Itenary/itenary";
import { clearHotelReducer, hotelAction } from "../../../Redux/Hotel/hotel";

// Select city data logic

let FromTimeout;
let FromCurrentValue;

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

const fetchFromCity = (value, callback) => {
  if (FromTimeout) {
    clearTimeout(FromTimeout);
    FromTimeout = null;
  }
  FromCurrentValue = value;
  const cityData = () => {
    axios
      .post(`${apiURL.baseURL}/skyTrails/city/hotelCitySearch?keyword=${value}`)
      .then((response) => {
        if (FromCurrentValue === value) {
          const res = response.data.data;
          const result = res?.map((item) => ({
            Destination: item.Destination,
            StateProvinceCode: item.StateProvinceCode,
            cityid: item.cityid,
            country: item.country,
            countrycode: item.countrycode,
            stateprovince: item.stateprovince,
            __v: item.__v,
            _id: item._id,
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
  const { onItemSelect } = props;
  const [fromData, setFromData] = useState([]);
  const [fromValue, setFromValue] = useState(
    initialSelectedFromData.Destination
  );
  const [selectedItem, setSelectedItem] = useState(initialSelectedFromData);

  const [FromPlaceholder, setFromPlaceholder] = useState("");
  const [FromDisplayValue, setFromDisplayValue] = useState(
    initialSelectedFromData.Destination
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setFromData([
      {
        Destination: initialSelectedFromData.Destination,
        StateProvinceCode: initialSelectedFromData.StateProvinceCode,
        cityid: initialSelectedFromData.cityid,
        country: initialSelectedFromData.country,
        countrycode: initialSelectedFromData.countrycode,
        stateprovince: initialSelectedFromData.stateprovince,
        __v: initialSelectedFromData.__v,
        _id: initialSelectedFromData._id,
        item: initialSelectedFromData,
      },
    ]);
  }, []);

  const handleFromSearch = (newValue) => {
    fetchFromCity(newValue, setFromData);
  };

  const handleFromChange = (newValue) => {
    const selected = fromData.find((d) => d.cityid === newValue);
    setFromValue(selected ? selected.Destination : newValue);
    setFromDisplayValue(selected ? selected.Destination : newValue);
    setSelectedItem(selected ? selected.item : null);
    setInputStyle({ caretColor: "transparent" });
    if (selected) {
      onItemSelect(selected.item);
    }
  };

  const handleFromFocus = () => {
    setFromPlaceholder("From");
    setFromDisplayValue(""); // Clear display value to show placeholder
    setInputStyle({});
  };

  const handleFromBlur = () => {
    setFromPlaceholder("");
    setFromDisplayValue(fromValue); // Reset display value to selected value
    setInputStyle({ caretColor: "transparent" });
  };
  const renderFromOption = (option) => (
    <div>
      <div>
        {option.Destination} ({option.countrycode})
      </div>
      <div style={{ color: "gray" }}>{option.cityid}</div>
    </div>
  );

  return (
    <Select
      showSearch
      style={inputStyle}
      // value={fromValue}
      value={FromDisplayValue}
      // placeholder={props.placeholder}
      placeholder={FromPlaceholder || props.placeholder}
      // style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleFromSearch}
      onChange={handleFromChange}
      onFocus={handleFromFocus} // Set placeholder on focus
      onBlur={handleFromBlur}
      notFoundContent={null}
      options={fromData.map((d) => ({
        value: d.cityid,
        label: renderFromOption(d),
      }))}
    />
  );
};

// select city data logic

// select country logic

let ToTimeout;
let ToCurrentValue;

const initialSelectedToData = {
  countryCode: "IN",
  countryCode3: "IND",
  countryName: "India",
};

const fetchToCity = (value, callback) => {
  if (ToTimeout) {
    clearTimeout(ToTimeout);
    ToTimeout = null;
  }
  ToCurrentValue = value;
  const cityData = () => {
    axios
      .get(`${apiURL.baseURL}/skyTrails/grnconnect/getcountrylist`)
      .then((response) => {
        if (ToCurrentValue === value) {
          const { data } = response.data;
          const filteredData = data.filter((item) =>
            item.countryName.toLowerCase().includes(value.toLowerCase())
          );
          const result = filteredData.map((item) => ({
            value: item.countryCode,
            countryName: item.countryName,
            countryCode3: item.countryCode3,
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

const NationalityInput = (props) => {
  const { onItemSelect } = props;
  const [toData, setToData] = useState([]);
  const [toValue, setToValue] = useState(initialSelectedToData.countryName);
  const [selectedItem, setSelectedItem] = useState(initialSelectedToData);

  const [ToPlaceholder, setToPlaceholder] = useState("");
  const [ToDisplayValue, setToDisplayValue] = useState(
    initialSelectedToData.countryName
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setToData([
      {
        value: initialSelectedToData.countryCode,
        countryCode3: initialSelectedToData.countryCode3,
        countryName: initialSelectedToData.countryName,
        item: initialSelectedToData,
      },
    ]);
  }, []);

  const handleToSearch = (newValue) => {
    fetchToCity(newValue, setToData);
  };

  const handleToChange = (newValue) => {
    const selected = toData.find((d) => d.value === newValue);
    setToValue(selected ? selected.countryName : newValue);
    setToDisplayValue(selected ? selected.countryName : newValue);
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
        {option.countryName} ({option.value})
      </div>
      <div style={{ color: "gray" }}>{option.countryCode3}</div>
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

// select country logic

// leaving city logic

let LeavingTimeout;
let LeavingCurrentValue;

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

const fetchLeavingCity = (value, callback) => {
  if (LeavingTimeout) {
    clearTimeout(LeavingTimeout);
    LeavingTimeout = null;
  }
  LeavingCurrentValue = value;
  const cityData = () => {
    axios
      .post(`${apiURL.baseURL}/skyTrails/city/hotelCitySearch?keyword=${value}`)
      .then((response) => {
        if (LeavingCurrentValue === value) {
          const res = response.data.data;
          const result = res?.map((item) => ({
            Destination: item.Destination,
            StateProvinceCode: item.StateProvinceCode,
            cityid: item.cityid,
            country: item.country,
            countrycode: item.countrycode,
            stateprovince: item.stateprovince,
            __v: item.__v,
            _id: item._id,
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
    LeavingTimeout = setTimeout(cityData, 200);
  } else {
    callback([]);
  }
};

const LeavingSearchInput = (props) => {
  const { onItemSelect } = props;
  const [fromData, setFromData] = useState([]);
  const [fromValue, setFromValue] = useState(
    initialSelectedLeavingData.Destination
  );
  const [selectedItem, setSelectedItem] = useState(initialSelectedLeavingData);

  const [FromPlaceholder, setFromPlaceholder] = useState("");
  const [FromDisplayValue, setFromDisplayValue] = useState(
    initialSelectedLeavingData.Destination
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setFromData([
      {
        Destination: initialSelectedLeavingData.Destination,
        StateProvinceCode: initialSelectedLeavingData.StateProvinceCode,
        cityid: initialSelectedLeavingData.cityid,
        country: initialSelectedLeavingData.country,
        countrycode: initialSelectedLeavingData.countrycode,
        stateprovince: initialSelectedLeavingData.stateprovince,
        __v: initialSelectedLeavingData.__v,
        _id: initialSelectedLeavingData._id,
        item: initialSelectedLeavingData,
      },
    ]);
  }, []);

  const handleFromSearch = (newValue) => {
    fetchLeavingCity(newValue, setFromData);
  };

  const handleFromChange = (newValue) => {
    const selected = fromData.find((d) => d.cityid === newValue);
    setFromValue(selected ? selected.Destination : newValue);
    setFromDisplayValue(selected ? selected.Destination : newValue);
    setSelectedItem(selected ? selected.item : null);
    setInputStyle({ caretColor: "transparent" });
    if (selected) {
      onItemSelect(selected.item);
    }
  };

  const handleFromFocus = () => {
    setFromPlaceholder("From");
    setFromDisplayValue(""); // Clear display value to show placeholder
    setInputStyle({});
  };

  const handleFromBlur = () => {
    setFromPlaceholder("");
    setFromDisplayValue(fromValue); // Reset display value to selected value
    setInputStyle({ caretColor: "transparent" });
  };
  const renderFromOption = (option) => (
    <div>
      <div>
        {option.Destination} ({option.countrycode})
      </div>
      {/* <div style={{ color: "gray" }}>{option.cityid}</div> */}
    </div>
  );

  return (
    <Select
      showSearch
      style={inputStyle}
      // value={fromValue}
      value={FromDisplayValue}
      // placeholder={props.placeholder}
      placeholder={FromPlaceholder || props.placeholder}
      // style={props.style}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleFromSearch}
      onChange={handleFromChange}
      onFocus={handleFromFocus} // Set placeholder on focus
      onBlur={handleFromBlur}
      notFoundContent={null}
      options={fromData.map((d) => ({
        value: d.cityid,
        label: renderFromOption(d),
      }))}
    />
  );
};

// leaving city logic

const PackageCreationHome = () => {
  const [openTravelModal, setOpenTravelModal] = React.useState(false);
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

  useEffect(() => {
    dispatch(clearHotelReducer());
    dispatch(clearFlightSelectedIteneraryReducer());
    dispatch(clearItenaryRecuder());
  }, []);

  // console.log(itineraryItems, "itineraryItems")

  const handleNationalitySelect = (item) => {
    setSelectNationality(item);
  };

  const handleFromSelect = (index, item) => {
    const newItineraryItems = [...itineraryItems];
    newItineraryItems[index].from = item;
    setItineraryItems(newItineraryItems);
  };

  const handleLeavingSelect = (item) => {
    setSelectedLeaving(item);
  };

  const handleNightSelect = (index, value) => {
    const newItineraryItems = [...itineraryItems];
    newItineraryItems[index].night = value;
    setItineraryItems(newItineraryItems);
  };

  const handleAddItem = () => {
    setItineraryItems([
      ...itineraryItems,
      { from: initialSelectedFromData, night: null },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newItineraryItems = itineraryItems.filter((_, i) => i !== index);
    setItineraryItems(newItineraryItems);
  };
  //  night show logic

  const nights = Array.from({ length: 30 }, (_, index) => index + 1);
  //  night show logic

  // date logic here

  const dateFormat = "DD MMM, YY";
  const today = dayjs().format(dateFormat);
  const [newDepartDate, setNewDepartDate] = useState(today);
  // const [newDepartDateCld, setNewDepartDateCld] = useState("");

  const handleRangeChange = (date) => {
    if (date) {
      setNewDepartDate(dayjs(date).format(dateFormat));
    } else {
      console.log("Selection cleared");
    }
  };

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // date logic here

  // rooms and passenger selection

  const [condition, setCondition] = useState(1);
  const [formDataDynamic, setFormData] = useState([
    {
      NoOfAdults: 1,
      NoOfChild: 0,
      ChildAge: [],
    },
  ]);

  const handleTravelClickOpen = () => {
    setOpenTravelModal(true);
  };

  const handleTravelClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenTravelModal(false);
    }
  };

  const handleConditionChange = (event) => {
    const newCondition = parseInt(event.target.value);
    setCondition(newCondition);
    const newFormData = Array.from({ length: newCondition }, () => ({
      NoOfAdults: 1,
      NoOfChild: 0,
      ChildAge: [],
    }));
    setFormData(newFormData);
  };

  const handleFormChange = (index, key, value) => {
    const updatedFormData = [...formDataDynamic];
    if (key === "NoOfAdults" && value > 8) {
      value = 8; // Limit the number of adults to a maximum of 8
    }
    updatedFormData[index][key] = value;

    if (key === "NoOfChild") {
      if (value === 0) {
        updatedFormData[index]["ChildAge"] = [];
      } else {
        updatedFormData[index]["ChildAge"] = Array.from(
          { length: value },
          () => 1
        ); // Initialize child age with 1
      }
    }

    setFormData(updatedFormData);
  };

  const handleChildAgeChange = (index, childIndex, value) => {
    const updatedFormData = [...formDataDynamic];
    updatedFormData[index].ChildAge[childIndex] = value;
    setFormData(updatedFormData);
  };

  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);
  // const [numInfants, setNumInfants] = useState(0);

  const calculateTravellerCount = () => {
    let adults = 0;
    let children = 0;
    // let infants = 0;

    formDataDynamic.forEach((data) => {
      adults += data.NoOfAdults;
      children += data.NoOfChild;
    });

    setNumAdults(adults);
    setNumChildren(children);
    // setNumInfants(infants);
  };

  useEffect(() => {
    calculateTravellerCount();
  }, [formDataDynamic]);

  // rooms and passenger selection

  // interest selection

  const [selectedInterest, setSelectedInterest] = useState(null);

  const handleInterestChange = (value) => {
    setSelectedInterest(value);
  };

  // interest selection

  // who is travelling selection

  const [whoisTravelling, setwhoisTravelling] = useState(null);

  const handleWhoisTravelling = (value) => {
    setwhoisTravelling(value);
  };

  // who is travelling selection

  // who is travelling selection

  const [ratingData, setRatingData] = useState(null);

  const handleRating = (value) => {
    setRatingData(value);
  };

  // who is travelling selection

  // console.log(reducerState, "reducer stater in itenary dashboard")

  // handle client name

  const handleClientName = (e) => {
    setClientName(e.target.value);
  };

  // handle client name

  const handleItenarySubmit = () => {
    setLoader(true);

    const payload = {
      cityAndNight: itineraryItems,
      clientName: clientName,
      leavingFrom: selectedLeaving,
      nationality: selectNationality,
      leavingDate: newDepartDate,
      RoomGuests: [...formDataDynamic],
      interest: selectedInterest,
      whoisTravelling: whoisTravelling,
      ratingData: ratingData,
    };
    dispatch(savePayloadrRequest(payload));

    let currentCheckInDate = dayjs(newDepartDate);

    itineraryItems.forEach((item, index) => {
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

      // Calculate the next check-in date
      currentCheckInDate = currentCheckInDate.add(item.night, "day");
    });

    navigate("/packagecreationresult");
  };

  return (
    <section className="py-5">
      <div
        className="container px-5 py-3 "
        style={{ background: "#FFF", borderRadius: "10px", maxWidth: "750px" }}
      >
        <div className="itenaryHeading d-flex justify-content-center text-center mb-3">
          <h3>Customized Holidays</h3>
        </div>
        {itineraryItems.map((item, index) => (
          <div className="row g-3 mb-2" key={index}>
            <div className="col-lg-6 col-md-6">
              <div className="itenarySelect">
                <FromSearchInput
                  style={{ width: "100%" }}
                  placeholder="Search"
                  onItemSelect={(item) => handleFromSelect(index, item)}
                />
              </div>
            </div>
            <div className="col-lg-5 col-md-5">
              <div className="itenarySelect">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Night"
                  onChange={(value) => handleNightSelect(index, value)}
                  value={item.night}
                >
                  {nights.map((night, index) => (
                    <Select.Option key={night} value={index + 1}>
                      {night} Night
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="col-lg-1 col-md-1">
              {/* <Button type="danger" >-</Button> */}
              <MinusCircleOutlined
                className="dynamic-delete-button"
                onClick={() => handleRemoveItem(index)}
              />
            </div>
          </div>
        ))}
        <div className="row">
          <div className="col-lg-12 col-md-12">
            {/* <Button type="primary" >Add</Button> */}
            <div className="d-flex justify-content-center mt-2">
              <Button
                type="dashed"
                onClick={handleAddItem}
                style={{
                  width: "60%",
                }}
                icon={<PlusOutlined />}
              >
                Add Another City
              </Button>
            </div>
          </div>
        </div>

        <div className="row mt-4 g-2 labelItenerary">
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Client Name</label>
            <div className="itenarySelect">
              <Input placeholder="name" onChange={(e) => handleClientName(e)} />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Leaving City</label>
            <div className="itenarySelect">
              <LeavingSearchInput
                placeholder="Search"
                style={{ width: "100%" }}
                onItemSelect={handleLeavingSelect} // Pass the callback function
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Nationality</label>
            <div className="itenarySelect">
              <NationalityInput
                placeholder="Search"
                style={{ width: "100%" }}
                onItemSelect={handleNationalitySelect} // Pass the callback function
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Leaving on</label>
            <div className="itenarySelect">
              <DatePicker
                onChange={handleRangeChange}
                defaultValue={[dayjs()]}
                format={dateFormat}
                disabledDate={disablePastDates}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Number of Travellers</label>
            <div className="itenarySelectRoom">
              <div onClick={handleTravelClickOpen} className="travellerButton">
                <span className="">
                  {condition} Room, {numAdults} Adults {numChildren} Child
                </span>
              </div>

              <Dialog
                sx={{ zIndex: "99999" }}
                disableEscapeKeyDown
                open={openTravelModal}
                onClose={handleTravelClose}
              >
                <DialogContent>
                  <>
                    <div className="travellerModal">
                      <div className="roomModal">
                        <div className="hotel_modal_form_input px-0">
                          <label className="form_label">Room*</label>
                          <select
                            name="room"
                            value={condition}
                            onChange={handleConditionChange}
                            className="hotel_input_select"
                          >
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                          </select>
                        </div>
                      </div>

                      <div className="px-1">
                        {condition > 0 &&
                          Array.from({ length: condition }).map((_, index) => (
                            <div key={index} className="room-modal-container">
                              <div>
                                <h5>ROOM {index + 1}</h5>
                              </div>
                              <div className="row">
                                <div className="hotel_modal_form_input">
                                  <label className="form_label">
                                    No of Adults:
                                  </label>
                                  <select
                                    value={
                                      formDataDynamic[index]?.NoOfAdults || 1
                                    }
                                    className="hotel_input_select"
                                    onChange={(e) =>
                                      handleFormChange(
                                        index,
                                        "NoOfAdults",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                      <option key={num} value={num}>
                                        {num}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="hotel_modal_form_input">
                                  <label className="form_label">
                                    No of Child:
                                  </label>
                                  <select
                                    value={
                                      formDataDynamic[index]?.NoOfChild || 0
                                    }
                                    className="hotel_input_select"
                                    name="noOfChild"
                                    onChange={(e) =>
                                      handleFormChange(
                                        index,
                                        "NoOfChild",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    {[0, 1, 2, 3, 4].map((childCount) => (
                                      <option
                                        key={childCount}
                                        value={childCount}
                                      >
                                        {childCount}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              {formDataDynamic[index]?.NoOfChild > 0 && (
                                <div className="hotel_modal_form_input_child_age">
                                  <label className="mt-3">Child Age:</label>
                                  <div>
                                    {Array.from({
                                      length:
                                        formDataDynamic[index]?.NoOfChild || 0,
                                    }).map((_, childIndex) => (
                                      <div key={childIndex} className="">
                                        <select
                                          value={
                                            formDataDynamic[index]?.ChildAge?.[
                                              childIndex
                                            ] || ""
                                          }
                                          className="hotel_input_select"
                                          onChange={(e) =>
                                            handleChildAgeChange(
                                              index,
                                              childIndex,
                                              e.target.value
                                            )
                                          }
                                        >
                                          {Array.from(
                                            { length: 12 },
                                            (_, i) => (
                                              <option key={i} value={i + 1}>
                                                {i + 1}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                </DialogContent>
                <DialogActions>
                  <Button
                    style={{
                      backgroundColor: "#21325d",
                      color: "white",
                    }}
                    onClick={handleTravelClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#21325d",
                      color: "white",
                    }}
                    onClick={handleTravelClose}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Interest</label>
            <div className="itenarySelect">
              <Select
                value={selectedInterest}
                onChange={handleInterestChange}
                style={{ width: "100%" }}
                placeholder="Select an option"
              >
                <Select.Option value="Honeymoon">Honeymoon</Select.Option>
                <Select.Option value="Luxury">Luxury</Select.Option>
                <Select.Option value="Leisure">Leisure</Select.Option>
                <Select.Option value="Spa">Spa</Select.Option>
                <Select.Option value="History">History</Select.Option>
                <Select.Option value="Art&Culture">Art & Culture</Select.Option>
                <Select.Option value="Adventure">Adventure</Select.Option>
                <Select.Option value="Nightlife">Nightlife</Select.Option>
                <Select.Option value="Shopping">Shopping</Select.Option>
                <Select.Option value="Entertainment">
                  Entertainment
                </Select.Option>
                <Select.Option value="option7">Adventure</Select.Option>
              </Select>
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Who is Travelling</label>
            <div className="itenarySelect">
              <Select
                value={whoisTravelling}
                onChange={handleWhoisTravelling}
                style={{ width: "100%" }}
                placeholder="Select an option"
              >
                <Select.Option value="Couple">Couple</Select.Option>
                <Select.Option value="Family">Family</Select.Option>
                <Select.Option value="Friends">Friends</Select.Option>
              </Select>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <label htmlFor="">Star Rating</label>
            <div className="itenarySelect">
              <Select
                value={ratingData}
                onChange={handleRating}
                style={{ width: "100%" }}
                placeholder="Select an option"
              >
                <Select.Option value="recommended">Recommended</Select.Option>
                <Select.Option value="3">3 Star</Select.Option>
                <Select.Option value="4">4 Star</Select.Option>
                <Select.Option value="5">5 Star</Select.Option>
              </Select>
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="d-flex justify-content-center ">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                danger
                onClick={handleItenarySubmit}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageCreationHome;

// export default PackageCreationHome;
