import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import dayjs from "dayjs";
import ItenaryHotel from "./ItenaryHotel";
import { useNavigate } from "react-router-dom";
import ItenaryFlightDashboard from "./ItenaryFlight/ItenaryFlightDashboard";
import { apiURL } from "../../Constants/constant";
import axios from "axios";
import {
  handleActivityRequest,
  setFLightFromRequest,
  setFLightToRequest,
  itenerarysearchRequest,
} from "../../Redux/Itenary/itenary";
import IteneraryPriceSummary from "./IteneraryPriceSummary";
import BlurredLoader from "../../components/BlurredLoader";

const PackageCreationResult = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddItineraryModalVisible, setIsAddItineraryModalVisible] =
    useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [selectedCityActivities, setSelectedCityActivities] = useState([]);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [form] = Form.useForm();
  const [dayForms, setDayForms] = useState([]);
  const [activityForms, setActivityForms] = useState([]);
  const [refreshingItinerary, setRefreshingItinerary] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const initialDate = reducerState?.Itenerary?.itenaryPayload?.leavingDate;
  const [loader, setLoader] = useState(true);

  // Get ordered itinerary data based on cityAndNight array
  const getOrderedItineraryData = () => {
    const cityAndNight =
      reducerState?.Itenerary?.itenaryPayload?.cityAndNight || [];
    const itenaryResults = reducerState?.Itenerary?.itenararyResult || [];

    return cityAndNight.map((city, index) => {
      const destination = city?.from?.Destination?.toLowerCase();

      // Find matching itinerary result for this city
      const matchingResult = itenaryResults.find((result) => {
        const resultDestination =
          result?.data?.result?.[0]?.destination?.toLowerCase() ||
          result?.data?.origin?.toLowerCase();
        return resultDestination === destination;
      });

      return {
        cityData: city,
        itineraryData: matchingResult?.data,
        index,
      };
    });
  };

  const orderedItineraryData = getOrderedItineraryData();

  // Calculate day index offset for each city
  const getDayIndexOffset = (cityIndex) => {
    return orderedItineraryData.slice(0, cityIndex).reduce((acc, curr) => {
      const nights = curr.cityData?.night || 0;
      return acc + nights + 1; // +1 for arrival day
    }, 0);
  };

  // Function to refresh all itinerary data
  const refreshAllItineraryData = async () => {
    setRefreshingItinerary(true);
    try {
      const cityAndNight =
        reducerState?.Itenerary?.itenaryPayload?.cityAndNight || [];
      const leavingFrom = reducerState?.Itenerary?.itenaryPayload?.leavingFrom;

      // Dispatch requests for all cities
      const requests = cityAndNight.map((item, index) => {
        const payloadSearch = {
          origin:
            index === 0
              ? leavingFrom?.Destination?.toLowerCase()
              : cityAndNight[index - 1]?.from?.Destination?.toLowerCase(),
          destination: item?.from?.Destination?.toLowerCase(),
          noOfDays: item?.night,
        };
        return dispatch(itenerarysearchRequest(payloadSearch));
      });

      // Wait for all requests to complete
      await Promise.all(requests);
      message.success("Itinerary data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing itinerary data:", error);
      message.error("Error refreshing itinerary data");
    } finally {
      setRefreshingItinerary(false);
    }
  };

  useEffect(() => {
    const hotelResults = reducerState?.Itenerary?.hotelResultArray;
    const allResultsReceived =
      hotelResults.length ===
      reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.length;

    if (allResultsReceived) {
      const errorExists = hotelResults.some(
        (result) =>
          result?.data?.data?.HotelSearchResult?.Error?.ErrorCode !== 0
      );
      setLoader(false);
    }
  }, [
    reducerState?.Itenerary?.hotelResultArray,
    reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.length,
  ]);

  const showModal = (dayIndex, activities) => {
    setSelectedDayIndex(dayIndex);
    setSelectedCityActivities(activities || []);
    setIsModalVisible(true);
  };

  const showAddItineraryModal = (cityIndex) => {
    setCurrentCityIndex(cityIndex);
    const nights =
      reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[cityIndex]?.night;
    // Initialize day forms based on number of nights (nights + 1 days)
    const initialDayForms = Array.from({ length: nights + 1 }, (_, i) => ({
      title: `Day ${i + 1}`,
      description: "",
      price: 0,
      type: "Sightseeing",
    }));
    setDayForms(initialDayForms);
    setActivityForms([{ title: "", description: "", timing: "", price: 0 }]);
    setIsAddItineraryModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddItineraryCancel = () => {
    setIsAddItineraryModalVisible(false);
  };

  const handleSelectActivity = (activity) => {
    setSelectedActivities((prevState) => {
      const newActivities = { ...prevState };
      if (!newActivities[selectedDayIndex]) {
        newActivities[selectedDayIndex] = [];
      }
      const activityExists = newActivities[selectedDayIndex].some(
        (act) => act._id === activity._id
      );
      if (!activityExists) {
        newActivities[selectedDayIndex].push(activity);
      }
      return newActivities;
    });

    handleOk();
  };

  useEffect(() => {
    dispatch(
      handleActivityRequest({
        activities: selectedActivities,
        itenararyResult: reducerState?.Itenerary?.itenararyResult,
      })
    );
  }, [selectedActivities]);

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setSelectedActivities((prevState) => {
      const newActivities = { ...prevState };
      newActivities[dayIndex].splice(activityIndex, 1);
      return newActivities;
    });
  };

  const getDateForDay = (startDate, dayIndex) => {
    return dayjs(startDate).add(dayIndex, "days").format("ddd, D MMM, YYYY");
  };

  useEffect(() => {
    const flightFromData = () => {
      axios
        .get(
          `${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${reducerState?.Itenerary?.itenaryPayload?.leavingFrom?.Destination}`
        )
        .then((response) => {
          dispatch(setFLightFromRequest(response?.data));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    flightFromData();
  }, []);

  useEffect(() => {
    const flightToData = () => {
      axios
        .get(
          `${apiURL.baseURL}/skyTrails/city/searchCityData?keyword=${reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[0]?.from?.Destination}`
        )
        .then((response) => {
          dispatch(setFLightToRequest(response?.data));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    flightToData();
  }, []);

  const getLatestDate = (dates) => {
    return dates.reduce((latest, current) =>
      dayjs(latest).isAfter(dayjs(current)) ? latest : current
    );
  };

  const leavingDate = dayjs(initialDate);
  const arrivalDate1 = dayjs(
    reducerState?.Itenerary?.selectedFlight?.[0]?.payloadReturnInternational?.Segments?.slice(
      -1
    )?.[0]?.Destination?.ArrTime
  );
  const arrivalDate2 = dayjs(
    reducerState?.Itenerary?.selectedFlight?.[0]?.[0]?.payloadGoing?.Segments?.slice(
      -1
    )?.[0]?.Destination?.ArrTime
  );
  const arrivalDate3 = dayjs(
    reducerState?.Itenerary?.selectedFlight?.[0]?.payloadOneway?.Segments?.slice(
      -1
    )?.[0]?.Destination?.ArrTime
  );

  const initialStartDate = getLatestDate([
    leavingDate,
    arrivalDate1,
    arrivalDate2,
    arrivalDate3,
  ]);

  const handleAddDayForm = () => {
    setDayForms([
      ...dayForms,
      {
        title: `Day ${dayForms.length + 1}`,
        description: "",
        price: 0,
        type: "Sightseeing",
      },
    ]);
  };

  const handleRemoveDayForm = (index) => {
    const newDayForms = [...dayForms];
    newDayForms.splice(index, 1);
    setDayForms(newDayForms);
  };

  const handleDayFormChange = (index, field, value) => {
    const newDayForms = [...dayForms];
    newDayForms[index][field] = value;
    setDayForms(newDayForms);
  };

  const handleAddActivityForm = () => {
    setActivityForms([
      ...activityForms,
      {
        title: "",
        description: "",
        timing: "",
        price: 0,
      },
    ]);
  };

  const handleRemoveActivityForm = (index) => {
    const newActivityForms = [...activityForms];
    newActivityForms.splice(index, 1);
    setActivityForms(newActivityForms);
  };

  const handleActivityFormChange = (index, field, value) => {
    const newActivityForms = [...activityForms];
    newActivityForms[index][field] = value;
    setActivityForms(newActivityForms);
  };

  const handleSubmitItinerary = async () => {
    try {
      const payload = {
        destination:
          reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[
            currentCityIndex
          ]?.from?.Destination.toString().toLowerCase(),
        origin:
          currentCityIndex === 0
            ? reducerState?.Itenerary?.itenaryPayload?.leavingFrom?.Destination.toString().toLowerCase()
            : reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[
                currentCityIndex - 1
              ]?.from?.Destination.toString().toLowerCase(),
        noOfDays: (
          parseInt(
            reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[
              currentCityIndex
            ]?.night
          ) + 1
        ).toString(),
        dayAt: dayForms,
        activities: activityForms,
      };

      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/itinerary/dayWise/createDayWise`,
        payload
      );

      if (response.data.statusCode === 200) {
        message.success("Itinerary added successfully!");
        setIsAddItineraryModalVisible(false);
        // Refresh all itinerary data after successful submission
        await refreshAllItineraryData();
      } else {
        message.error("Failed to add itinerary");
      }
    } catch (error) {
      console.error("Error submitting itinerary:", error);
      message.error("Error submitting itinerary");
    }
  };

  const hasItineraryData = (itinerary) => {
    return (
      itinerary?.statusCode === 200 && itinerary?.result?.[0]?.dayAt?.length > 0
    );
  };

  return (
    <>
      {loader || refreshingItinerary ? (
        <BlurredLoader
          textData={
            refreshingItinerary
              ? "Refreshing itinerary data..."
              : "Hold on ! We're Creating Your Itenerary"
          }
        />
      ) : (
        <div className="container-fluid p-4">
          <div className="row">
            <div className="col-lg-8 p-3 border-1 rounded-md">
              <div className="row">
                <div className="col-lg-12">
                  <ItenaryFlightDashboard />
                </div>
                <div className="col-lg-12">
                  <ItenaryHotel />
                </div>

                {orderedItineraryData.map(
                  ({ cityData, itineraryData, index: cityIndex }) => {
                    const destination = cityData?.from?.Destination;
                    const nights = cityData?.night;

                    if (!hasItineraryData(itineraryData)) {
                      return (
                        <div key={cityIndex} className="col-lg-12">
                          <div className="dayWiseItenaryMainBox mb-3 border rounded-lg p-3 bg-blue-100">
                            <div className="headingItenary">
                              <h6 className="mb-3">{destination}</h6>
                            </div>
                            <div className="dayWiseItenaryInnerBox">
                              <p>No itinerary found for this destination</p>
                              <Button
                                type="primary"
                                onClick={() => showAddItineraryModal(cityIndex)}
                              >
                                Add Day Wise Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={cityIndex} className="col-lg-12">
                        {itineraryData?.result?.[0]?.dayAt?.map(
                          (item, dayItemIndex) => {
                            const dayIndex =
                              getDayIndexOffset(cityIndex) + dayItemIndex;
                            const currentDate = getDateForDay(
                              initialStartDate,
                              dayIndex
                            );

                            return (
                              <div
                                className="dayWiseItenaryMainBox mb-3 border rounded-lg p-3 bg-blue-100"
                                key={dayItemIndex}
                              >
                                <div className="headingItenary">
                                  <h6 className="mb-3">
                                    Day {dayIndex + 1} in {destination}{" "}
                                    {currentDate}
                                  </h6>
                                </div>
                                <div className="dayWiseItenaryInnerBox">
                                  <div className="dayWiseItenaryContent">
                                    <h5>{item?.title}</h5>
                                    <div className="paragraph-Itenary">
                                      <p className="paragraphinsideItenary">
                                        {item?.description}
                                      </p>
                                    </div>
                                  </div>

                                  {(selectedActivities[dayIndex] || []).map(
                                    (activity, activityIndex) => (
                                      <div key={activityIndex}>
                                        <Divider />
                                        <h6>{activity?.title?.slice(0, 60)}</h6>
                                        <div className="d-flex justify-content-between gap-5 align-items-center">
                                          <p>
                                            {activity?.description?.slice(
                                              0,
                                              100
                                            )}
                                          </p>
                                          <div className="d-flex flex-column justify-content-center gap-2 align-items-center">
                                            <h6
                                              style={{
                                                color: "green",
                                                fontWeight: "600",
                                              }}
                                            >
                                              ₹ {activity?.price}
                                            </h6>
                                            <Button
                                              type="dashed"
                                              icon={<MinusCircleOutlined />}
                                              onClick={() =>
                                                handleRemoveActivity(
                                                  dayIndex,
                                                  activityIndex
                                                )
                                              }
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}

                                  <div className="addActvityRoomItenary mt-4 d-flex justify-content-end">
                                    <Button
                                      type="primary"
                                      icon={<PlusOutlined />}
                                      danger
                                      onClick={() =>
                                        showModal(
                                          dayIndex,
                                          itineraryData?.result?.[0]
                                            ?.activities || []
                                        )
                                      }
                                    >
                                      Add Activity
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <IteneraryPriceSummary />
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR SELECTING ACTIVITIES */}
      <Modal
        width={800}
        title="Select Activity"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedCityActivities?.map((activity, activityIndex) => (
          <div key={activityIndex}>
            <h6>{activity?.title?.slice(0, 60)}</h6>
            <div className="d-flex justify-content-between gap-5 align-items-center">
              <p>{activity?.description?.slice(0, 150)}</p>
              <div className="d-flex flex-column justify-content-center gap-2 align-items-center">
                <h6 style={{ color: "green", fontWeight: "600" }}>
                  ₹ {activity?.price}
                </h6>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => handleSelectActivity(activity)}
                  warning
                >
                  Add
                </Button>
              </div>
            </div>
            <Divider />
          </div>
        ))}
      </Modal>

      {/* MODAL FOR ADDING ITINERARY */}
      <Modal
        width={800}
        title={`Add Itinerary for ${reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[currentCityIndex]?.from?.Destination}`}
        open={isAddItineraryModalVisible}
        onOk={handleSubmitItinerary}
        onCancel={handleAddItineraryCancel}
        footer={[
          <Button key="back" onClick={handleAddItineraryCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmitItinerary}>
            Submit
          </Button>,
        ]}
      >
        <h4>Day-wise Itinerary</h4>
        {dayForms.map((day, dayIndex) => (
          <div key={dayIndex} className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Day {dayIndex + 1}</h5>
              {dayIndex > 0 && (
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => handleRemoveDayForm(dayIndex)}
                />
              )}
            </div>
            <Form.Item label="Title">
              <Input
                value={day.title}
                onChange={(e) =>
                  handleDayFormChange(dayIndex, "title", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={day.description}
                onChange={(e) =>
                  handleDayFormChange(dayIndex, "description", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Price">
              <InputNumber
                value={day.price}
                onChange={(value) =>
                  handleDayFormChange(dayIndex, "price", value)
                }
              />
            </Form.Item>
            <Form.Item label="Type">
              <Input
                value={day.type}
                onChange={(e) =>
                  handleDayFormChange(dayIndex, "type", e.target.value)
                }
              />
            </Form.Item>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={handleAddDayForm}
          icon={<PlusCircleOutlined />}
          className="mb-4"
        >
          Add Another Day
        </Button>

        <h4>Activities</h4>
        {activityForms.map((activity, activityIndex) => (
          <div key={activityIndex} className="mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Activity {activityIndex + 1}</h5>
              {activityIndex > 0 && (
                <Button
                  type="text"
                  danger
                  icon={<MinusCircleOutlined />}
                  onClick={() => handleRemoveActivityForm(activityIndex)}
                />
              )}
            </div>
            <Form.Item label="Title">
              <Input
                value={activity.title}
                onChange={(e) =>
                  handleActivityFormChange(
                    activityIndex,
                    "title",
                    e.target.value
                  )
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={activity.description}
                onChange={(e) =>
                  handleActivityFormChange(
                    activityIndex,
                    "description",
                    e.target.value
                  )
                }
              />
            </Form.Item>
            <Form.Item label="Timing">
              <Input
                value={activity.timing}
                onChange={(e) =>
                  handleActivityFormChange(
                    activityIndex,
                    "timing",
                    e.target.value
                  )
                }
              />
            </Form.Item>
            <Form.Item label="Price">
              <InputNumber
                value={activity.price}
                onChange={(value) =>
                  handleActivityFormChange(activityIndex, "price", value)
                }
              />
            </Form.Item>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={handleAddActivityForm}
          icon={<PlusCircleOutlined />}
        >
          Add Another Activity
        </Button>
      </Modal>
    </>
  );
};

export default PackageCreationResult;
