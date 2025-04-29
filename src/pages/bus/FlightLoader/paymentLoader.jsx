import React from "react";
// import flightLoading from '../../../Images/loading/flightLoading.gif'
// import flightLoading from '../../utility/flight_loader.gif'
//import paymentLoading from "../../../utility/raz"
import paymentLoading from "../../../utility/razorpayLoader.gif";
import "./paymentLoader.css";

const PaymentLoader = () => {
  return (
    <div className="paymentLoading">
      <img src={paymentLoading} alt="payment" />
    </div>
  );
};

export default PaymentLoader;
