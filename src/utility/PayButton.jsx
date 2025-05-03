import React, { useEffect, useState } from "react";

import { load } from "@cashfreepayments/cashfree-js";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { checkSearchTime } from "./utils";
import { apiURL } from "../Constants/constant";
import { swalModal } from "./swal";
import { useDispatch, useSelector } from "react-redux";
import { updateWalletRequest } from "../Redux/Auth/logIn/actionLogin";
import userApi from "../Redux/API/api";
import { Button, Modal } from "antd";
import flightPaymentLoding from "../images/loading/loading-ban.gif";

const PayButton = ({
  ticketPrice,
  phone,
  email,
  bookingType,
  buttonText,
  setPaymentLoading,
  // setLoaderPayment1,
  setLoaderPayment,
  setLoadingButton,
  className,
}) => {
  const [cashfree, setCashfree] = useState(null);
  const [loaderPayment1, setLoaderPayment1] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let walletAmount = useSelector((state) => state?.logIn?.wallet?.balance || 0);
  console.log("walletAmount", walletAmount);

  useEffect(() => {
    const initializeSDK = async () => {
      //   const cf = await load({ mode: "production" });
      const cf = await load({ mode: "sandbox" });

      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const doPayment = async (sessionID, order_id) => {
    sessionID =
      "session_FnxN1q49Dptg8rF_QJMaDi3qTSakEQV76V4G_pHnDVOjYKYRDaOLJe-OVu4SUxcsY91LUqQUsJH1QRt-dyqsUWIGXRJyZA_Fx4okYiCacZK71Q340CLr63V1MHBX4wpaymentpayment";

    const checkoutOptions = {
      paymentSessionId: sessionID,
      redirectTarget: "_modal",
    };

    cashfree.checkout(checkoutOptions).then((result) => {
      if (result.error) {
        swalModal(
          "Payment Error",
          "Some error occurred during payment!",
          false
        );
        sessionStorage.removeItem("couponCode");
      }

      if (result.redirect) {
        console.log("Redirecting to external payment page");
      }

      if (result.paymentDetails) {
        console.log(
          "Payment completed:;;;;",
          result.paymentDetails.paymentMessage,
          result
        );
        setLoaderPayment(true);
        setLoadingButton(true);
        const rechargeAmount = Math.ceil(ticketPrice - walletAmount);
        dispatch(updateWalletRequest({ balance: rechargeAmount }));
        userApi.rechargeHistoryWallet({
          amount: rechargeAmount,
          order_id: order_id,
          transaction_id: sessionID,
          status: "SUCCESS",
          payment_mode: "UPI",
        });
      }
    });
  };

  const handleRecharge = async () => {
    setPaymentLoading(true);
    setLoaderPayment1(true);

    if (!checkSearchTime()) {
      navigate("/");
      return;
    }

    // const token = localStorage?.getItem("jwtToken");
    sessionStorage.setItem("ammo", Number(ticketPrice).toFixed(0));
    let rechargeAmount = Math.ceil(ticketPrice - walletAmount);

    const cashPayload = {
      phone: phone || "7017757907",

      amount: rechargeAmount,
      email: email || "mohitjoshi@gmail.com",
      productinfo: "ticket",
      bookingType,
    };
    console.log("cashPayload", cashPayload);

    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/transaction/walletRecharge`,
        cashPayload,
        {
          headers: {
            "Content-Type": "application/json",
            // token,
          },
        }
      );

      if (response.status === 200) {
        console.log("Recharge API response:", response.data);
        const sessionId = response?.data?.result?.payment_session_id;
        const order_id = response?.data?.result?.order_id;
        doPayment(sessionId, order_id);
      } else {
        console.error("Payment API failed:", response.status);
      }
    } catch (err) {
      console.error("Recharge Error:", err);
    } finally {
      setPaymentLoading(false);
      setLoaderPayment1(false);
    }
  };

  const handleClick = () => {
    walletAmount = ticketPrice + 10;
    if (ticketPrice <= walletAmount) {
      console.log(`Proceed to book ${bookingType} with wallet balance`);
      setLoaderPayment(true);
    } else {
      const rechargeAmount = Math.ceil(ticketPrice - walletAmount);
      swalModal(
        "Insufficient Wallet Balance",
        `Recharge ₹${rechargeAmount} to continue`,
        true
      );
      handleRecharge();
      // doPayment();
    }
  };
  // const handleClick1 = () => {
  //   dispatch(updateWalletRequest({ balance: 0 }));
  // };

  return (
    <>
      <button type="primary" className={`${className} `} onClick={handleClick}>
        {buttonText}
      </button>
      {loaderPayment1 && (
        <div className=" fixed top-0 bottom-0 left-0 right-0 z-30 w-full bg-transparent  h-[100%] flex justify-center items-center">
          <div>
            <img src={flightPaymentLoding} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default PayButton;
