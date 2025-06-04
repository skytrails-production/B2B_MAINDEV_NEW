import React, { useEffect } from "react";
import loaderImg from "../images/logoLoader.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, walletRequest } from "../Redux/Auth/logIn/actionLogin";
import secureLocalStorage from "react-secure-storage";

const Itinerary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const tokenFromURL = query.get("token");
  const redirectURL = query.get("redirectURL");
  const isDummy = query.get("isDummy");
  const storedToken = secureLocalStorage.getItem("jwtToken");
  sessionStorage.setItem("isDummy", isDummy);
  sessionStorage.setItem("redirectURL", redirectURL);

  // Prefer token from URL, fallback to stored token
  const token = tokenFromURL || storedToken;

  const userData = useSelector((state) => state?.logIn);

  useEffect(() => {
    if (tokenFromURL) {
      // Store only once if coming from URL
      secureLocalStorage.setItem("jwtToken", tokenFromURL);
      localStorage.setItem("jwtToken", tokenFromURL);
    }

    if (token) {
      dispatch(loginAction(token));
      // dispatch(walletRequest(token));
    }
  }, [tokenFromURL, token, dispatch]);

  useEffect(() => {
    if (!userData?.isLoading) {
      if (userData?.isError) {
        console.error("Error in itinerary generation:", userData?.isError);
      } else if (userData?.loginData?.id) {
        console.log(redirectURL, "redirectURL");
        navigate(redirectURL ? `/${redirectURL}` : "/");
      }
    }
  }, [userData, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="text-center flex flex-col items-center space-y-4">
        <h1 className="text-white text-2xl font-semibold">
          Crafting Your Journey
        </h1>
        <p className="text-white text-base">
          Curating personalized experiences and optimizing your travel plans.
        </p>
        <img
          src={loaderImg}
          alt="Loading..."
          className="w-40 h-40 animate-breathe"
        />
      </div>
    </div>
  );
};

export default Itinerary;
