import React, { useState, useEffect, useRef } from "react";
import "./authentic.scss";
import { Modal, Button, Input, DatePicker } from "antd";
import SecureStorage from "react-secure-storage";
import newlogo from "../../images/logoSky.svg";
import { apiURL } from "../../Constants/constant";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  loginAction,
  loginActionSocial,
  logoutAction,
  requestNumAfterSocialLogin,
} from "../../Redux/Auth/logIn/actionLogin";
import dayjs from "dayjs";
import { ipAction, tokenAction } from "../../Redux/IP/actionIp";
import { useNavigate } from "react-router-dom";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const Authentic = ({ isOpen, onClose, isLogoutOpen, onLogoutClose }) => {
  const [mobileEmail, setMobileEmail] = useState("");
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userName = reducerState?.logIn?.loginData?.data?.result?.username;

  const status = reducerState?.logIn?.loginData?.data?.statusCode;

  const isNumberPresent =
    reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number;
  const [validNumEmail, setValidNumEmail] = useState(true);
  const [token, setToken] = useState("");
  const [reqSignInData, setReqSignInData] = useState([]);
  const [otpLoader, setOtpLoader] = useState(false);
  const [otpSectionVisible, setOtpSectionVisible] = useState(false);
  const [loginPage, setLoginPage] = useState(false);
  const [otp, setOtp] = useState("");
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [referralError, setReferralError] = useState(false);
  const [incorrectOtp, setIncorrectOtp] = useState(false);
  const [openOnlyMobileVerify, setOpenOnlyMobile] = useState(false);
  const [invokedSocialLogin, setInvokedSocialLogin] = useState(false);
  const [socialLoginOTPVisible, setSocialLoginOTPVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  const [errors, setErrors] = useState({
    fname: "",
    phone: "",
    referral: "",
  });
  const [formData, setFormData] = useState({
    fname: "",
    phone: "",
    referral: "",
  });

  const handleChange = (e) => {
    const value = e.target.value.trim();
    setMobileEmail(value);
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidInput = phoneRegex.test(value) || emailRegex.test(value);
    setValidNumEmail(!isValidInput);
  };

  const requestSignIn = async () => {
    setOtpLoader(true);

    let payload = {
      email: mobileEmail,
    };

    try {
      const res = await axios({
        method: "post",
        url: `${apiURL.baseURL}/skytrails/api/user/loginWithMailMobileLogin`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const newToken = await res.data.result.token;
      SecureStorage.setItem("jwtToken", newToken);
      setReqSignInData(res?.data?.result);

      if (res.data.statusCode === 200 && res.data.result.firstTime === false) {
        setOtpLoader(false);
        setOtpSectionVisible(true);
      } else {
        setOtpLoader(false);
        setLoginPage(true);
      }
      setToken(newToken);
    } catch (error) {
      // console.log("Error requesting sign-in:", error);
      setOtpLoader(false);
    }
  };

  const onChangeOtp = (e) => {
    if (e) {
      setOtp(e);
    } else {
      console.log("Invalid event object:", e);
    }
  };

  const sharedProps = {
    onChange: onChangeOtp,
    value: otp,
  };

  // verify otp

  const verifyOTP = async (e) => {
    setOtpLoader(true);
    setIncorrectOtp(false);
    e.preventDefault();
    let payload = {
      otp: otp,
    };
    dispatch(loginAction(payload));
    setInvokedSocialLogin(false);
    // handleCancel()
  };

  const verifyOTP2 = async (e) => {
    setOtpLoader(true);
    setIncorrectOtp(false);
    e.preventDefault();
    let payload = {
      otp: otp,
      mobileNumber: mobileEmail,
    };
    dispatch(requestNumAfterSocialLogin(payload));
    // setInvokedSocialLogin(false);
    // handleCancel();
  };

  // first time user

  const validateForm = (formData) => {
    const errors = {};
    if (formData.fname.length < 4 || formData.fname.length > 26) {
      errors.fname = "Enter valid name";
    }

    if (formData.phone.length < 10 || formData.phone.length > 50) {
      errors.phone = "Enter Phone Number";
    }

    return errors;
  };

  const onInputChangeHandler = (e) => {
    setAlreadyExist(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // date picker
  const dateFormat = "DD MMM, YY";
  const today = dayjs().format(dateFormat);
  const [newDepartDate, setNewDepartDate] = useState(today);

  const handleRangeChange = (date) => {
    if (date) {
      setNewDepartDate(dayjs(date).format(dateFormat));
    } else {
    }
  };

  const signUpUser = async () => {
    setAlreadyExist(false);
    setReferralError(false);
    setOtpLoader(true);

    const validationResult = validateForm(formData);
    if (Object.keys(validationResult).length > 0) {
      setErrors(validationResult);
      setOtpLoader(false);
      return;
    }
    let payloadotp = {
      otp: otp,
      fullName: formData.fname,
      dob: newDepartDate,
      email: formData.phone,
      referrerCode: formData.referral,
    };

    dispatch(loginAction(payloadotp));
  };

  useEffect(() => {
    setOtpLoader(false);
    if (
      reducerState?.logIn?.loginData?.data?.message ===
        "This mobile number already exists" ||
      reducerState?.logIn?.loginData?.data?.message ===
        "This email already exist"
    ) {
      setAlreadyExist(true);
    }
    if (
      reducerState?.logIn?.loginData?.data?.message ===
      "Incorect referal code,please provide valid code..!"
    ) {
      setReferralError(true);
    }
    if (reducerState?.logIn?.loginData?.message === "Incorrect OTP") {
      setIncorrectOtp(true);
    }
    if (reducerState?.logIn?.loginData?.message === "OTP expired") {
      setIncorrectOtp(true);
    }
  }, [
    reducerState?.logIn?.loginData,
    reducerState?.logIn?.loginData?.data?.message,
  ]);

  // resend logic

  useEffect(() => {
    let timer;

    if (loginPage || otpSectionVisible || socialLoginOTPVisible) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      }
    }

    return () => clearInterval(timer);
  }, [timeLeft, loginPage, otpSectionVisible, socialLoginOTPVisible]);

  const handleResendOtp = async () => {
    setTimeLeft(90);
    let Payload = {
      email: mobileEmail,
    };

    try {
      const res = await axios({
        method: "PUT",
        url: `${apiURL.baseURL}/skytrails/api/user/resendOtp1`,
        data: Payload,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
    } catch (error) {
      // console.warn("Error resending OTP:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  // resend logic

  const handleLogout = () => {
    dispatch(logoutAction());
    SecureStorage.removeItem("jwtToken");
    dispatch(ipAction());
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    setLoginPage(false);
    setReqSignInData([]);
    setAlreadyExist(false);
    setIncorrectOtp(false);
    setOtpSectionVisible(false);
    setMobileEmail("");
    setFormData({
      fname: "",
      phone: "",
      referral: "",
    });
    setOtp("");
    setTimeLeft(90);
    setOpenOnlyMobile(false);

    setInvokedSocialLogin(false);
    setSocialLoginOTPVisible(false);

    dispatch(tokenAction(payload));
    onLogoutClose();
    navigate("/");
  };

  const handleCancel = () => {
    setLoginPage(false);

    // console.log("vhdsmlahjlsdahygjlkhvljkzft")
    setReqSignInData([]);
    setAlreadyExist(false);
    setIncorrectOtp(false);
    setMobileEmail("");
    setOtpSectionVisible(false);
    setFormData({
      fname: "",
      phone: "",
      referral: "",
    });
    setOtp("");
    setTimeLeft(90);

    onClose();
  };

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      setInvokedSocialLogin(true);
      if (result.user) {
        const payload = {
          username: result?.user?.displayName,
          email: result?.user?.email,
          socialId: result?.user?.uid,
          socialType: result?.user?.providerData[0]?.providerId,
          deviceType: "web",
          deviceToken: result?.user?.accessToken,
          profilePic: result?.user?.photoURL,
        };

        dispatch(loginActionSocial(payload));
      }
    });
  };

  // useEffect(() => {
  //     if (reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number == "") {
  //         setInvokedSocialLogin(true)

  //     }

  // }, [reducerState?.logIn?.loginData, reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number])

  useEffect(() => {
    const newToken = reducerState?.logIn?.loginData?.data?.result?.token;
    SecureStorage.setItem("jwtToken", newToken);
  }, [
    reducerState?.logIn?.loginData,
    reducerState?.logIn?.loginData?.data?.result?.token,
  ]);

  useEffect(() => {
    if (
      (reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number ==
        "" ||
        reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number ==
          undefined) &&
      invokedSocialLogin
    ) {
      setOpenOnlyMobile(true);
    }
    if (
      !reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number ==
        "" &&
      invokedSocialLogin
    ) {
      handleCancel();
    }
  }, [
    reducerState?.logIn?.loginData?.data?.result?.phone?.mobile_number,
    invokedSocialLogin,
  ]);

  // social login mobile verify

  const addNumberInSocialLogin = async () => {
    setOtpLoader(true);

    let payload = {
      mobile_number: mobileEmail,
    };
    const newToken = reducerState?.logIn?.loginData?.data?.result?.token;

    try {
      const res = await axios({
        method: "put",
        url: `${apiURL.baseURL}/skyTrails/api/user/addPhoneNumber`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          token: newToken,
        },
      });

      if (res.data.statusCode == "200") {
        setOtpLoader(false);
        setSocialLoginOTPVisible(true);
      } else if (res.data.statusCode == "409") {
        setAlreadyExist(true);
        setOtpLoader(false);
        // console.log(res, "inside else if");
      } else {
        setOtpLoader(false);
        setLoginPage(true);
      }
    } catch (error) {
      setOtpLoader(false);
    }
  };

  const optsectionVerifyMobileAfterSocialLogin = () => {
    setSocialLoginOTPVisible(true);
  };

  // social login mobile verify

  useEffect(() => {
    if (status === 200 && !invokedSocialLogin) {
      onClose();
    }
  }, [status]);

  return (
    <div className="authenticMain">
      <Modal
        centered
        maskClosable={false}
        width={500}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        className="authenticModal"
      >
        {openOnlyMobileVerify ? (
          <>
            <div className="authenticModalContent">
              <img src={newlogo} alt="" />
              <p>Add your Mobile Number</p>
              <div className="signInForm">
                {socialLoginOTPVisible ? (
                  <>
                    <label htmlFor="">
                      OTP to verify{" "}
                      {reqSignInData?.phone && reqSignInData?.phone}
                    </label>
                    <Input.OTP value={otp} variant="filled" {...sharedProps} />

                    <div className="timer">
                      {timeLeft > 0 ? (
                        <span>Resend OTP in {formatTime(timeLeft)}</span>
                      ) : (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={handleResendOtp}
                        >
                          Resend OTP
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {alreadyExist ? (
                      <label style={{ color: "red" }} for="inputEmail4">
                        This Phone is already Registered
                      </label>
                    ) : (
                      <label for="inputEmail4">Enter Mobile Number</label>
                    )}
                    <input
                      type="text"
                      value={mobileEmail}
                      onChange={(e) => {
                        setMobileEmail(e.target.value);
                        handleChange(e);
                      }}
                      name="phone"
                      className="form-control"
                    />
                  </>
                )}
              </div>
              {socialLoginOTPVisible ? (
                <Button
                  type="primary"
                  loading={otpLoader}
                  onClick={verifyOTP2}
                  disabled={otp.length < 6}
                >
                  Verify OTP
                </Button>
              ) : (
                <Button
                  type="primary"
                  loading={otpLoader}
                  onClick={addNumberInSocialLogin}
                  disabled={validNumEmail}
                >
                  Get OTP
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {loginPage ? (
              <div className="authenticModalContent">
                <img src={newlogo} alt="" />
                <p>Signup to the Skytrails</p>
                <div className="signInForm">
                  <>
                    <label for="inputEmail4">Full Name</label>
                    <input
                      style={{ borderColor: errors.fname ? "red" : "" }}
                      type="text"
                      name="fname"
                      id="fname"
                      className="form-control"
                      value={formData.fname}
                      onChange={onInputChangeHandler}
                    />
                  </>
                  {!reqSignInData.email ? (
                    <>
                      {alreadyExist ? (
                        <label style={{ color: "red" }} for="inputEmail4">
                          This email id is already Exist
                        </label>
                      ) : (
                        <label for="inputEmail4">Email ID</label>
                      )}

                      <input
                        style={{ borderColor: errors.phone ? "red" : "" }}
                        type="email"
                        id="phone"
                        name="phone"
                        class="form-control"
                        value={formData.phone}
                        onChange={onInputChangeHandler}
                      />
                    </>
                  ) : (
                    <>
                      {alreadyExist ? (
                        <label style={{ color: "red" }} for="inputEmail4">
                          This Phone is already Registered
                        </label>
                      ) : (
                        <label for="inputEmail4">Phone No</label>
                      )}
                      <input
                        style={{ borderColor: errors.phone ? "red" : "" }}
                        type="tel"
                        name="phone"
                        id="phone"
                        class="form-control"
                        value={formData.phone}
                        onChange={onInputChangeHandler}
                      />
                    </>
                  )}

                  <>
                    <label for="inputEmail4">Referral Code (Optional)</label>
                    <input
                      style={{ borderColor: errors.referral ? "red" : "" }}
                      type="text"
                      name="referral"
                      id="referral"
                      className="form-control"
                      placeholder="DF1AF354"
                      value={formData.referral}
                      onChange={onInputChangeHandler}
                    />
                  </>

                  <>
                    <label for="inputPassword4">Date of Birth</label>
                    <DatePicker
                      onChange={handleRangeChange}
                      defaultValue={dayjs(today)}
                      format={dateFormat}
                      value={dayjs(newDepartDate)}
                    />
                  </>

                  <>
                    <label htmlFor="">
                      OTP to verify{" "}
                      {reqSignInData?.phone && reqSignInData?.phone}
                    </label>
                    <Input.OTP
                      status={incorrectOtp ? "error" : ""}
                      value={otp}
                      variant="filled"
                      {...sharedProps}
                    />
                  </>

                  <div className="timer">
                    {timeLeft > 0 ? (
                      <span>Resend OTP in {formatTime(timeLeft)}</span>
                    ) : (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  type="primary"
                  loading={otpLoader}
                  onClick={signUpUser}
                  disabled={otp.length < 6 && formData?.fname == ""}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="authenticModalContent">
                <img src={newlogo} alt="" />
                <p>Login to the Skytrails</p>
                <div className="signInForm">
                  {otpSectionVisible ? (
                    <>
                      <label htmlFor="">
                        OTP to verify{" "}
                        {reqSignInData?.phone && reqSignInData?.phone}
                      </label>
                      <Input.OTP
                        value={otp}
                        variant="filled"
                        {...sharedProps}
                      />

                      <div className="timer">
                        {timeLeft > 0 ? (
                          <span>Resend OTP in {formatTime(timeLeft)}</span>
                        ) : (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={handleResendOtp}
                          >
                            Resend OTP
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <label htmlFor="">Enter Email id or Mobile Number</label>
                      <input
                        type="text"
                        value={mobileEmail}
                        onChange={(e) => {
                          setMobileEmail(e.target.value);
                          handleChange(e);
                        }}
                        name="phone"
                        className="form-control"
                      />
                    </>
                  )}
                </div>
                {otpSectionVisible ? (
                  <Button
                    type="primary"
                    loading={otpLoader}
                    onClick={verifyOTP}
                    disabled={otp.length < 6}
                  >
                    Verify OTP
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    loading={otpLoader}
                    onClick={requestSignIn}
                    disabled={validNumEmail}
                  >
                    Get OTP
                  </Button>
                )}

                <div className="socialLoginBox">
                  <p>Or Continue </p>
                  <div>
                    <div className="googleLogin" onClick={googleLogin}>
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        height="20"
                        width="20"
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                      >
                        <path
                          style={{ fill: "#167EE6" }}
                          d="M492.668,211.489l-208.84-0.01c-9.222,0-16.697,7.474-16.697,16.696v66.715 c0,9.22,7.475,16.696,16.696,16.696h117.606c-12.878,33.421-36.914,61.41-67.58,79.194L384,477.589 c80.442-46.523,128-128.152,128-219.53c0-13.011-0.959-22.312-2.877-32.785C507.665,217.317,500.757,211.489,492.668,211.489z"
                        ></path>
                        <path
                          style={{ fill: "#12B347" }}
                          d="M256,411.826c-57.554,0-107.798-31.446-134.783-77.979l-86.806,50.034 C78.586,460.443,161.34,512,256,512c46.437,0,90.254-12.503,128-34.292v-0.119l-50.147-86.81 C310.915,404.083,284.371,411.826,256,411.826z"
                        ></path>
                        <path
                          style={{ fill: "#0F993E" }}
                          d="M384,477.708v-0.119l-50.147-86.81c-22.938,13.303-49.48,21.047-77.853,21.047V512 C302.437,512,346.256,499.497,384,477.708z"
                        ></path>
                        <path
                          style={{ fill: "#FFD500" }}
                          d="M100.174,256c0-28.369,7.742-54.91,21.043-77.847l-86.806-50.034C12.502,165.746,0,209.444,0,256 s12.502,90.254,34.411,127.881l86.806-50.034C107.916,310.91,100.174,284.369,100.174,256z"
                        ></path>
                        <path
                          style={{ fill: "#FF4B26" }}
                          d="M256,100.174c37.531,0,72.005,13.336,98.932,35.519c6.643,5.472,16.298,5.077,22.383-1.008 l47.27-47.27c6.904-6.904,6.412-18.205-0.963-24.603C378.507,23.673,319.807,0,256,0C161.34,0,78.586,51.557,34.411,128.119 l86.806,50.034C148.202,131.62,198.446,100.174,256,100.174z"
                        ></path>
                        <path
                          style={{ fill: "#D93F21" }}
                          d="M354.932,135.693c6.643,5.472,16.299,5.077,22.383-1.008l47.27-47.27 c6.903-6.904,6.411-18.205-0.963-24.603C378.507,23.672,319.807,0,256,0v100.174C293.53,100.174,328.005,113.51,354.932,135.693z"
                        ></path>
                      </svg>
                      <span>Sign up with Google</span>
                    </div>
                    {/* <div className="googleLogin">
                                                    <svg
                                                        version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                                        x="0px"
                                                        y="0px"
                                                        height="20"
                                                        width="20"
                                                        viewBox="0 0 112.196 112.196"
                                                        style={{ enableBackground: "new 0 0 112.196 112.196" }}
                                                        xmlSpace="preserve"
                                                    >
                                                        <g>
                                                            <circle style={{ fill: "#3B5998" }} cx="56.098" cy="56.098" r="56.098"></circle>
                                                            <path
                                                                style={{ fill: "#FFFFFF" }}
                                                                d="M70.201,58.294h-10.01v36.672H45.025V58.294h-7.213V45.406h7.213v-8.34
        c0-5.964,2.833-15.303,15.301-15.303L71.56,21.81v12.51h-8.151c-1.337,0-3.217,0.668-3.217,3.513v7.585h11.334L70.201,58.294z"
                                                            ></path>
                                                        </g>
                                                    </svg>
                                                    <span>with Facebook</span>
                                                </div> */}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        centered
        maskClosable={false}
        width={400}
        open={isLogoutOpen}
        onCancel={onLogoutClose}
        footer={[
          <Button className="logoutButton" key="Cancel" onClick={onLogoutClose}>
            Cancel
          </Button>,
          <Button
            className="logoutButton"
            key="submit"
            type="primary"
            onClick={handleLogout}
          >
            Logout
          </Button>,
        ]}
      >
        <div className="logoutBox">
          <h3>Log out from The Skytrails</h3>
        </div>
      </Modal>
    </div>
  );
};

export default Authentic;
