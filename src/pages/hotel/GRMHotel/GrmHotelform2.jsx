import { apiURL } from "../../Constants/constant";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import {
  hotelActionGRN,
  clearHotelReducerGRN,
  clearonlyHotelsGRN,
  singleHotelGRN,
  hotelGalleryRequest,
} from "../../Redux/HotelGRN/hotel";
const { RangePicker } = DatePicker;

// Select city data logic

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
      .get(
        `${apiURL.baseURL}/skyTrails/grnconnect/searchcityandhotel?keyword=${value}`
      )
      .then((response) => {
        if (FromCurrentValue === value) {
          const { data } = response.data;
          const cityList = data.cityList.map((item) => ({
            value: `city-${item.cityCode}`,
            name: item.cityName,
            code: item.countryCode,
            cityCode: item.countryName,
            item,
            type: "city",
          }));

          const hotelList = data.hotelList.map((item) => ({
            value: `hotel-${item.hotelCode}`,
            name: item.hotelName,
            code: item.cityCode,
            cityCode: item.countryCode,
            address: item.address,
            countryName: item.countryName,
            // cityName: item.cityName,
            item,
            type: "hotel",
          }));

          const combinedList = [...cityList, ...hotelList];
          callback(combinedList);
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
  const grmhotel = JSON.parse(sessionStorage.getItem("revisithotel"));
  const initialSelectedFromData = {
    cityCode: grmhotel?.[0]?.cityCode,
    cityName: grmhotel?.[0]?.cityName,
    countryCode: grmhotel?.[0]?.countryCode,
    countryName: grmhotel?.[0]?.countryName,
  };
  const [fromValue, setFromValue] = useState(initialSelectedFromData.cityName);
  const [selectedItem, setSelectedItem] = useState(initialSelectedFromData);
  const [FromPlaceholder, setFromPlaceholder] = useState("");
  const [FromDisplayValue, setFromDisplayValue] = useState(
    initialSelectedFromData.cityName
  );
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setFromData([
      {
        value: `city-${initialSelectedFromData.cityCode}`,
        name: initialSelectedFromData.cityName,
        code: initialSelectedFromData.countryCode,
        cityCode: initialSelectedFromData.countryName,
        item: initialSelectedFromData,
        type: "city",
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
    setFromDisplayValue(""); // Clear display value to show placeholder
    setInputStyle({});
  };

  const handleFromBlur = () => {
    setFromPlaceholder("");
    setFromDisplayValue(fromValue); // Reset display value to selected value
    setInputStyle({ caretColor: "transparent" });
  };
  // const renderFromOption = (option) => (
  //   <div>
  //     <div>
  //       {option.name} ({option.code})
  //     </div>
  //     <div style={{ color: "gray" }}>{option.cityCode}</div>
  //   </div>
  // );

  const renderFromOption = (option) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {option.type === "city" ? (
          <i class="fa-solid fa-city"></i>
        ) : (
          <i class="fa-solid fa-bed"></i>
        )}
        <div>
          {option.type === "city" ? (
            <>
              <div className="ellipsisHotelDropdown">
                {option.name} ({option.code})
              </div>
              <div style={{ color: "gray" }}>{option.cityCode}</div>
            </>
          ) : (
            <>
              <div className="ellipsisHotelDropdown">
                {option.name} - ({option.countryName})
              </div>
              <div className="ellipsisHotelDropdown" style={{ color: "gray" }}>
                {option.address}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
        value: d.value,
        label: renderFromOption(d),
      }))}
    />
  );
};

// select city data logic

// select country data logic

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

const ToSearchInput = (props) => {
  const { onItemSelect } = props;
  const [toData, setToData] = useState([]);
  const grmhotel = JSON.parse(sessionStorage.getItem("revisithotel"));
  const initialSelectedToData = {
    countryCode: grmhotel?.[0]?.nationality?.countryCode,
    countryCode3: grmhotel?.[0]?.nationality?.countryCode3,
    countryName: grmhotel?.[0]?.nationality?.countryName,
  };
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

// select country data logic

function GrmHotelform2() {
  const grmhotel = JSON.parse(sessionStorage.getItem("revisithotel"));

  const initialSelectedFromData = {
    cityCode: grmhotel?.[0]?.cityCode,
    cityName: grmhotel?.[0]?.cityName,
    countryCode: grmhotel?.[0]?.countryCode,
    countryName: grmhotel?.[0]?.countryName,
  };

  const initialSelectedToData = {
    countryCode: grmhotel?.[0]?.nationality?.countryCode,
    countryCode3: grmhotel?.[0]?.nationality?.countryCode3,
    countryName: grmhotel?.[0]?.nationality?.countryName,
  };
  const roomvalueLength = grmhotel?.[0]?.rooms?.length;
  const [openTravelModal, setOpenTravelModal] = React.useState(false);
  const currentDate = new Date();

  // Add one day
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 1);
  const [selectedFrom, setSelectedFrom] = useState(initialSelectedFromData);
  const [selectNationality, setSelectNationality] = useState("IN");

  const handleFromSelect = (item) => {
    setSelectedFrom(item);
  };
  const handleNationalitySelect = (item) => {
    setSelectNationality(item);
  };

  const handleTravelClickOpen = () => {
    setOpenTravelModal(true);
  };

  const handleTravelClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpenTravelModal(false);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [condition, setCondition] = useState(roomvalueLength);
  const [formDataDynamic, setFormData] = useState([]);
  useEffect(() => {
    if (grmhotel?.[0]?.rooms) {
      const initialFormData = grmhotel?.[0]?.rooms.map((room) => ({
        NoOfAdults: room?.adults,
        NoOfChild: room?.children_ages?.length || 0,
        ChildAge: room?.children_ages,
      }));
      setFormData(initialFormData);
    }
  }, []);
  const reducerState = useSelector((state) => state);

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const [isSingleHotelSearched, setIsSIngleHotelSerched] = useState(false);

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
      value = 8;
    }
    updatedFormData[index][key] = value;

    if (key === "NoOfChild") {
      updatedFormData[index]["ChildAge"] = Array.from(
        { length: value },
        () => "1"
      );
    }
    setFormData(updatedFormData);
  };

  const handleChildAgeChange = (index, childIndex, value) => {
    const updatedFormData = [...formDataDynamic];
    updatedFormData[index].ChildAge[childIndex] = value;
    setFormData(updatedFormData);
  };

  const dateFormat = "DD MMM";
  const initialDepartDate = grmhotel?.[0]?.checkin;
  const initialReturnDate = grmhotel?.[0]?.checkout;

  // Set states
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

  const selectedSingleHotel =
    reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels?.filter(
      (item) => item.hotel_code == selectedFrom?.hotelCode
    );

  const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleClick = () => {
    const payload = {
      data: {
        rate_key: selectedSingleHotel?.[0]?.min_rate?.rate_key,
        group_code: selectedSingleHotel?.[0]?.min_rate?.group_code,
      },
      searchID: selectedSingleHotel?.[0]?.search_id,
      hotel_code: selectedSingleHotel?.[0]?.hotel_code,
    };

    const galleryPayload = {
      hotel_id: selectedSingleHotel?.[0]?.hotel_code,
    };
    dispatch(hotelGalleryRequest(galleryPayload));
    dispatch(singleHotelGRN(payload));
    navigate("/st-hotel/hotelresult/selectroom");
  };

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels &&
      isSingleHotelSearched &&
      selectedFrom?.hotelName
    ) {
      handleClick();
    }
  }, [reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels]);

  function handleSubmit(event) {
    event.preventDefault();
    setIsSIngleHotelSerched(true);
    setLoader(true);
    sessionStorage.setItem("SessionExpireTime", new Date());

    const dynamicFormData = formDataDynamic.map((data) => ({
      adults: data.NoOfAdults || 0,
      children_ages: data.ChildAge || [],
    }));

    sessionStorage.setItem(
      "clientNationality",
      JSON.stringify(selectNationality?.countryCode)
    );
    sessionStorage.setItem(
      "revisithotel",
      JSON.stringify([
        {
          cityCode: selectedFrom.cityCode,
          cityName: selectedFrom.cityName,
          countryCode: selectedFrom.countryCode,
          countryName: selectedFrom.countryName,
          checkin: newDepartDate,
          checkout: newReturnDate,
          rooms: [...dynamicFormData],
          nationality: selectNationality,
        },
      ])
    );

    // const payload = {
    //   "rooms": [...dynamicFormData],
    //   "rates": "concise",
    //   "cityCode": selectedFrom.cityCode,
    //   "currency": "INR",
    //   "client_nationality": selectNationality?.countryCode,
    //   "checkin": dayjs(newDepartDate).format("YYYY-MM-DD"),
    //   "checkout": dayjs(newReturnDate).format("YYYY-MM-DD"),
    //   "cutoff_time": 30000,
    //   "version": "2.0",
    // };

    // const pageNumber = 1;
    // sessionStorage.setItem("grnPayload", JSON.stringify(payload));
    // dispatch(clearonlyHotelsGRN());
    // dispatch(hotelActionGRN(payload, pageNumber));
    // navigate("/st-hotel/hotelresult");

    if (selectedFrom.hotelName) {
      const payload = {
        rooms: [...dynamicFormData],
        rates: "concise",
        hotel_codes: [`${selectedFrom.hotelCode}`],
        currency: "INR",
        client_nationality: selectNationality?.countryCode || "In",
        checkin: dayjs(newDepartDate).format("YYYY-MM-DD"),
        checkout: dayjs(newReturnDate).format("YYYY-MM-DD"),
        cutoff_time: 30000,
        version: "2.0",
      };

      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      dispatch(hotelActionGRN(payload));
      // navigate("/st-hotel/hotelresult");
    } else {
      const payload = {
        rooms: [...dynamicFormData],
        rates: "concise",
        cityCode: selectedFrom.cityCode,
        currency: "INR",
        client_nationality: selectNationality?.countryCode || "In",
        checkin: dayjs(newDepartDate).format("YYYY-MM-DD"),
        checkout: dayjs(newReturnDate).format("YYYY-MM-DD"),
        cutoff_time: 30000,
        version: "2.0",
      };

      sessionStorage.setItem("grnPayload", JSON.stringify(payload));
      dispatch(hotelActionGRN(payload));
      navigate("/st-hotel/hotelresult");
    }

    if (reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels) {
      setOpen(false);
    }
    setOpen(true);
  }

  const [numAdults, setNumAdults] = useState(0);
  const [numChildren, setNumChildren] = useState(0);

  const calculateTravellerCount = () => {
    let adults = 0;
    let children = 0;

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

  useEffect(() => {
    if (reducerState?.hotelSearchResultGRN?.onlyHotels.length !== 0) {
      setLoader(false);
    }
  }, [reducerState?.hotelSearchResultGRN?.onlyHotels]);

  useEffect(() => {
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.errors?.[0]
        ?.code == "1501"
    ) {
      setLoader(false);
    }
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.errors?.[0]
        ?.code == "5111"
    ) {
      setLoader(false);
    }
    if (
      reducerState?.hotelSearchResultGRN?.ticketData?.data?.data?.hotels
        ?.length > 0
    ) {
      setLoader(false);
    }
  }, [reducerState?.hotelSearchResultGRN?.ticketData?.data?.data]);

  return (
    <>
      <div
        className="container transParentBG"
        style={{ paddingBottom: "13px", paddingTop: "13px" }}
      >
        <div className="row g-2 newOneWayMainOneway2">
          <div className="col-lg-3">
            <div className="newOnewaySingle">
              <span>From</span>
              <FromSearchInput
                placeholder="Search"
                style={{ width: "100%" }}
                onItemSelect={handleFromSelect}
              />
            </div>
          </div>

          <div className="col-lg-3">
            <div className="newOnewaySingle">
              <span className="me-4">Check In</span>
              <span className="ms-5 smMargin">Check Out</span>

              <RangePicker
                onChange={handleRangeChange}
                defaultValue={[dayjs(newDepartDate), dayjs(newReturnDate)]}
                format={dateFormat}
                disabledDate={disablePastDates}
              />
            </div>
          </div>

          <div className="col-lg-3">
            <div>
              <div className="newOnewaySingle " onClick={handleTravelClickOpen}>
                <span className="nrsb">Guests & Rooms</span>
                <div className="travelContent">
                  <p>
                    {condition} Room, {numAdults} Adults, {numChildren} Child
                  </p>
                </div>
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
                                            { length: 11 },
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

          <div className="col-lg-2">
            <div className="newOnewaySingle">
              <span>Nationality</span>
              <ToSearchInput
                placeholder="Search"
                style={{ width: "100%" }}
                onItemSelect={handleNationalitySelect}
              />
            </div>
          </div>

          <div className="col-lg-1">
            {/* <Button>
              Search
            </Button> */}

            <div className="hotelFormInnerBtton hotelColor">
              <Button
                onClick={handleSubmit}
                loading={loader}
                type="primary"
                icon={<SearchOutlined />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GrmHotelform2;
