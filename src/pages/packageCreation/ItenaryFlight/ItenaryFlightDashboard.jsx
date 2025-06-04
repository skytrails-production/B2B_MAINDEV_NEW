import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Modal, Button } from "antd";
import ItenaryFLightFormPage from "./ItenaryFLightFormPage";
import ShowFlightDomestic from "./ShowFlightDomestic";
import {
  clearFlightSelectedIteneraryReducer,
  clearOneWayItenary,
  setSelectedFlightRequest,
} from "../../../Redux/Itenary/itenary";
import ShowFlightInternational from "./ShowFlightInternational";
import { returnActionClear } from "../../../Redux/FlightSearch/Return/return";
import ShowOnewayItenary from "./ShowOnewayItenary";

const ItenaryFlightDashboard = () => {
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedFlights, setSelectedFlights] = useState({});

  useEffect(() => {
    // Initialize the selectedFlights state from the Redux state if available
    setSelectedFlights(reducerState.Itenerary.selectedFlight || {});
  }, [reducerState.Itenerary.selectedFlight]);

  const reducerClear = () => {
    dispatch(returnActionClear());
    dispatch(clearOneWayItenary());
  };

  const showModal = (index) => {
    reducerClear();
    setSelectedIndex(index);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectedFlightRemove = (index) => {
    const updatedFlights = { ...selectedFlights };
    delete updatedFlights[index];
    setSelectedFlights(updatedFlights);
    dispatch(setSelectedFlightRequest(updatedFlights));
    // dispatch(clearFlightSelectedIteneraryReducer(Object.values(updatedFlights)));
  };

  const handleFlightSelection = (flightData) => {
    console.log(flightData, "flightdata");
    const updatedFlights = { ...selectedFlights, [selectedIndex]: flightData };
    setSelectedFlights(updatedFlights);
    dispatch(setSelectedFlightRequest(updatedFlights));
    setIsModalVisible(false);
  };

  console.log(selectedFlights, "flight dashboard");

  return (
    <div>
      {reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.map(
        (city, index) => (
          <div key={index} className="dayWiseItenaryMainBox mb-2">
            <div className="dayWiseItenaryInnerBox border-1 p-2 rounded-md bg-green-50">
              <div className="dayWiseItenaryContent">
                <h5>
                  {index === 0
                    ? `Add Flight to my Trip : ${reducerState?.Itenerary?.itenaryPayload?.leavingFrom?.Destination} - ${city?.from?.Destination}`
                    : `Add Flight to my Trip : ${
                        reducerState?.Itenerary?.itenaryPayload?.cityAndNight?.[
                          index - 1
                        ]?.from?.Destination
                      } - ${city?.from?.Destination}`}
                </h5>
              </div>

              {selectedFlights[index]?.[0]?.payloadReturn && (
                <ShowFlightDomestic flight={selectedFlights[index]} />
              )}
              {selectedFlights[index]?.payloadReturnInternational && (
                <ShowFlightInternational flight={selectedFlights[index]} />
              )}
              {selectedFlights[index]?.payloadOneway && (
                <ShowOnewayItenary flight={selectedFlights[index]} />
              )}

              <div className="addActvityRoomItenary mt-4 d-flex gap-2 justify-content-end">
                <Button
                  width="100%"
                  type={selectedFlights[index] ? "primary" : "dashed"}
                  danger
                  icon={
                    selectedFlights[index] ? <SyncOutlined /> : <PlusOutlined />
                  }
                  onClick={() => showModal(index)}
                >
                  {selectedFlights[index]
                    ? "Change Flight"
                    : "Add Flight to my Trip"}
                </Button>
                {selectedFlights[index] && (
                  <Button
                    width="100%"
                    type="primary"
                    icon={<MinusCircleOutlined />}
                    onClick={() => handleSelectedFlightRemove(index)}
                    warning
                  >
                    Remove Flight
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      )}

      <Modal
        className="iteFliMod w-full"
        width={1500}
        footer={null}
        title="Select Activity"
        open={isModalVisible}
        onCancel={handleCancel}
      >
        <div>
          <ItenaryFLightFormPage
            closeModal={handleCancel}
            selectedIndex={selectedIndex}
            onFlightSelect={handleFlightSelection}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ItenaryFlightDashboard;
