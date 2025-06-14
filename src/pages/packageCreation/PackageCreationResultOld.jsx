import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Modal, Button, Divider } from "antd";
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
} from "../../Redux/Itenary/itenary";
import IteneraryPriceSummary from "./IteneraryPriceSummary";
import BlurredLoader from "../../components/BlurredLoader";

const PackageCreationResult = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState({});
  const [selectedCityActivities, setSelectedCityActivities] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reducerState = useSelector((state) => state);
  const itenaryResults = reducerState?.Itenerary?.itenararyResult || [];
  const initialDate = reducerState?.Itenerary?.itenaryPayload?.leavingDate;
  const [loader, setLoader] = useState(true);

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

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

  const destinationOrder =
    reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.map((city) =>
      city?.from?.Destination?.toLowerCase()
    );

  const sortedItenaryResults = itenaryResults?.sort((a, b) => {
    const aDestination = a?.data?.result?.[0].destination;
    const bDestination = b?.data?.result?.[0].destination;
    return (
      destinationOrder.indexOf(aDestination) -
      destinationOrder.indexOf(bDestination)
    );
  });

  return (
    <>
      {loader ? (
        <BlurredLoader textData={"Hold on ! We're Creating Your Itenerary"} />
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

                {sortedItenaryResults.map((itenary, itenaryIndex) => (
                  <div key={itenaryIndex} className="col-lg-12">
                    {itenary?.data?.result?.[0]?.dayAt?.map((item, index) => {
                      const dayIndex =
                        sortedItenaryResults
                          ?.slice(0, itenaryIndex)
                          ?.reduce(
                            (acc, curr) =>
                              acc + curr?.data?.result?.[0]?.dayAt?.length,
                            0
                          ) + index;
                      const currentDate = getDateForDay(
                        initialStartDate,
                        dayIndex
                      );

                      return (
                        <div
                          className="dayWiseItenaryMainBox mb-3 border rounded-lg p-3 bg-blue-100"
                          key={index}
                        >
                          <div className="headingItenary">
                            <h6 className="mb-3">
                              Day {dayIndex + 1} in{" "}
                              {itenary?.data?.result?.[0]?.destination}{" "}
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
                                      {activity?.description?.slice(0, 100)}
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
                                    itenary?.data?.result?.[0]?.activities || []
                                  )
                                }
                              >
                                Add Activity
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <IteneraryPriceSummary />
            </div>
          </div>
        </div>
      )}

      {/* SINGLE MODAL FOR ALL CITIES */}
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
    </>
  );
};

export default PackageCreationResult;
