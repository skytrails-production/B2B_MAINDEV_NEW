import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./busbookingdetails.css";
import "react-phone-input-2/lib/bootstrap.css";
import { apiURL } from "../../../Constants/constant";
import userApi from "../../../Redux/API/api";
import { Mode } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import SecureStorage from "react-secure-storage";
import { Modal } from "antd";
//import ReviewForm from "../../../components/TailwindSearchComp/reviews/ReviewForm";
const BusBookingConfirmation = () => {
  const reducerState = useSelector((state) => state);
  const location = useLocation();
  const { finalamount, couponvalue } = location.state || {};
  const [isOpen, setIsOpen] = useState(true);
  const markUpamount =
    reducerState?.markup?.markUpData?.data?.result[0]?.busMarkup;
  const passengerNames = JSON.parse(sessionStorage.getItem("busPassName"));

  const navigate = useNavigate();

  // const couponconfirmation = async () => {
  //   try {
  //     const token = SecureStorage.getItem("jwtToken");
  //     const response = await axios.get(
  //       `${apiURL.baseURL}/skyTrails/api/coupons/couponApplied/${couponvalue}`,

  //       {
  //         headers: {
  //           token: token,
  //         },
  //       }
  //     );

  //     // sessionStorage.removeItem("couponCode");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const buscouponamountcode = sessionStorage.getItem("couponCode");
  useEffect(() => {
    const busBookSave = () => {
      const getDetails =
        reducerState?.getBusResult?.busDetails?.data?.data
          ?.GetBookingDetailResult?.Itinerary;
      const totalAmount =
        reducerState?.getBusResult?.busDetails?.data?.data
          ?.GetBookingDetailResult?.Itinerary?.Price?.PublishedPriceRoundedOff;
      // const grandtotal = totalAmount + markUpamount * totalAmount;
      const buscouponamount =
        reducerState?.getBusResult?.busDetails?.data?.data
          ?.GetBookingDetailResult?.Itinerary?.Price?.OfferedPriceRoundedOff +
        markUpamount *
          reducerState?.getBusResult?.busDetails?.data?.data
            ?.GetBookingDetailResult?.Itinerary?.Price
            ?.PublishedPriceRoundedOff;

      const payloadSavedata = {
        userId: reducerState?.logIn?.loginData?.id,
        destination: getDetails?.Destination,
        origin: getDetails?.Origin,
        departureTime: getDetails?.DepartureTime,
        arrivalTime: getDetails?.ArrivalTime,
        travelName: getDetails?.TravelName,
        busType: getDetails?.BusType,
        pnr: getDetails?.TicketNo,
        busId: getDetails?.BusId,
        noOfSeats: getDetails?.NoOfSeats,
        // amount: buscouponamountcode ? buscouponamount : grandtotal,
        amount: Number(finalamount).toFixed(2),
        passenger: getDetails?.Passenger.map((item, index) => {
          return {
            title: item?.Title,
            firstName: item?.FirstName,
            lastName: item?.LastName,
            Email: passengerNames[index]?.Email,
            Phone: passengerNames[index]?.Phoneno,
            Address: item?.Address,
            seatNumber: item?.Seat?.SeatName,
            Price: item?.Seat?.Price?.PublishedPrice,
          };
        }),
        BoardingPoint: {
          Location: getDetails?.BoardingPointdetails?.CityPointLocation,
          Landmark: getDetails?.BoardingPointdetails?.CityPointLandmark,
          Address: getDetails?.BoardingPointdetails?.CityPointAddress,
          Contactnumber:
            getDetails?.BoardingPointdetails?.CityPointContactNumber,
        },
        CancelPolicy: getDetails?.CancelPolicy,
      };
      userApi.busBookingDataSave(payloadSavedata);
      //couponconfirmation();
    };
    // if (sessionStorage.getItem("couponCode")) {
    // couponconfirmation();
    // }
    busBookSave();
  }, []);
  console.log(reducerState?.logIn?.loginData,"datataaaa")
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    // <div>
    //   <div className="bus_banner">
    //     <h1>Design not available</h1>
    //   </div>
    // </div>
    <div
      className="relative z-10 tempBox"
      style={{ marginTop: "150px", marginBottom: "150px" }}
    >
      <div className="container text-white">
        <h2>Thank You for Booking With Us</h2>
        <p>Please Check your Email for Booking Details</p>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Ok
        </button>
      </div>
      {/* <Modal
        centered
        maskClosable={false}
        width={500}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        className="authenticModal"
      >
        <ReviewForm
          destination={
            reducerState?.getBusResult?.busDetails?.data?.data
              ?.GetBookingDetailResult?.Itinerary?.Destination
          }
          section={"BUSES"}
          onCancel={handleCancel}
        />
      </Modal> */}
    </div>
  );
};

export default BusBookingConfirmation;
