import axios from "axios";
import { apiURL } from "../../Constants/constant";
import SecureStorage from "react-secure-storage";
import secureLocalStorage from "react-secure-storage";
import { ErrorMessage } from "formik";

function api() {
  const userIP = (formData) => {
    return axios.get("https://api.ipify.org?format=json");
  };

  const markUp = () => {
    return axios.get(`${apiURL.baseURL}/skyTrails/api/admin/getMarkup`);
  };
  const flightList = () => {
    return axios.get(`${apiURL.baseURL}/skyTrails/airline`);
  };
  const airportList = () => {
    return axios.get(`${apiURL.baseURL}/skyTrails/searchCity`);
  };
  const faqReviewApi = () => {
    return axios.get(`${apiURL.baseURL}/skyTrails/api/user/getFaqRating`);
  };
  const fetchflightSuggest = async () => {
    let data = await axios.get(
      `${apiURL.baseURL}/skyTrails/staticContent/flightPayload/listStaticFlightPayload`
    );
    return data?.data?.result;
  };

  const userB2BToken = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/token",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const userB2CLogin = (payload) => {
    // console.log("payload", payload);
    const token = SecureStorage.getItem("jwtToken");
    // console.log("jwt token", token);
    return axios({
      method: "PUT",
      url: "/skytrails/api/user/verifyUserOtp1",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };
  const userProfile = (payload) => {
    // const token = SecureStorage.getItem("jwtToken");
    console.log(payload, "/api/wserToken")
    return axios({
      method: "GET",
      url: "/api/user-profile/",
      baseURL: `https://crm.theskytrails.com`,
      // data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload}`,
      },
    });
  };
  const userWallet = (payload) => {
    // const token = SecureStorage.getItem("jwtToken");
    console.log(payload, "/api/wallettoken")

    return axios({
      method: "GET",
      url: "/api/wallet",
      baseURL: `https://crm.theskytrails.com/`,
      // data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload}`,
      },
    });
  };
  const rechargeHistoryWallet = (payload) => {
    const token = localStorage.getItem("jwtToken");


    return axios({
      method: "PUT",
      url: "recharge-history/create/",
      baseURL: `https://crm.theskytrails.com/`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const updateUserWallet = (payload) => {
    const token = localStorage.getItem("jwtToken");
    console.log(payload, "/api/wallettoken")

    return axios({
      method: "PUT",
      url: "/api/wallet",
      baseURL: `https://crm.theskytrails.com/`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const subtractUserWallet = (payload) => {
    const token = localStorage.getItem("jwtToken");
    console.log(payload, "/api/wallettoken")

    return axios({
      method: "PATCH",
      url: "/api/wallet",
      baseURL: `https://crm.theskytrails.com/`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const socialPhoneVerify = (payload) => {
    // console.log("payload", payload);
    const token = SecureStorage.getItem("jwtToken");
    // console.log("jwt token", token);
    return axios({
      method: "PUT",
      url: "/skytrails/api/user/socialLoginVerifyOtp",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  const profilePicUpdate = (payload) => {
    // console.log("payload", payload);
    const token = SecureStorage.getItem("jwtToken");
    // console.log("jwt token", token);
    return axios({
      method: "PUT",
      url: "/skytrails/api/user/uploadImage",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
      },
    });
  };
  const profileDataUpdate = (payload) => {
    // console.log("payload", payload);
    const token = SecureStorage.getItem("jwtToken");
    // console.log("jwt token", token);
    return axios({
      method: "PUT",
      url: "/skytrails/api/user/editProfile",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  const userB2CLoginWithSocial = (payload) => {
    console.log("chal gye ");
    return axios({
      method: "POST",
      url: "/skyTrails/api/user/socialLogin",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // const loginUserData = () => {
  //   const token = SecureStorage.getItem("jwtToken");
  //   return axios({
  //     method: "GET",
  //     url: "/skytrails/api/user/getUserProfile",
  //     baseURL: `${apiURL.baseURL}`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "token": token,
  //     },
  //   });
  // };

  // Flight Api start From here ⬇️
  const oneWaySearch = (payload) => {
    return axios({
      method: "POST",
      // url: "/skytrails/api/combined/combineTVOAMADEUSPriceSort",
      url: "/skytrails/api/combined/AMADEUSPriceSort",

      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const oneWaySearchCombined = (payload) => {
    return axios({
      method: "POST",
      // url: "/skytrails/api/combined/combineTVOAMADEUSPriceSort",
      url: "/skyTrails/api/combine/combineApiRes",
      // url: "/skytrails/api/combined/AMADEUSPriceSort",

      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const flightBookingDB = (payload) => {
    const token = SecureStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      url: "/skyTrails/api/amadeus/user/flightBooking",

      // url: "/skyTrails/flight/search/oneway",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };
  const flightBookingDetailsCommon = (payload) => {
    const token = SecureStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      url: "/skytrails/crmagent/flightbooking/create",

      // url: "/skyTrails/flight/search/oneway",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  const flightQuoteSearch = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: "/skyTrails/flight/farequote",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response; // Return the response if the request is successful
    } catch (error) {
      console.error("Error in flightQuoteSearch:", error);
      return { error: true, errorMessage: error };
    }
  };
  const flightSSR = async (payload) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/flight/ssr`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const Response = res?.data?.data?.Response;
      const mealLength = Response?.MealDynamic?.[0]?.filter((item) => {
        return item?.Code !== "NoMeal";
      });
      let BaggageList = Response?.Baggage?.[0].filter((item, index) => {
        return item?.Price !== 0;
      });
      let MealsList = mealLength;
      let baglis = [...Array(BaggageList?.length)].fill(0);
      let Meals = [...Array(Response?.MealDynamic?.[0]?.length)].fill(0);
      let MealsNew = Response?.MealDynamic?.[0]?.reduce((result, param) => {
        if (param.Code !== "NoMeal") {
          const flightNumber = param.FlightNumber;
          if (!result[flightNumber]) {
            result[flightNumber] = [];
          }
          result[flightNumber].push(0);
        }
        return result;
      }, {});
      let seatMapList = Response?.SeatDynamic;
      let seatListt = [];
      let seatAmountList = [];

      for (let i = 0; i < seatMapList?.[0]?.SegmentSeat?.length; i++) {
        // seatListt[i]={}
        seatListt.push([]);
        seatAmountList.push([]);
        // console.log(seatListt, "gg")
      }
      return {
        seatMap: seatMapList,
        number_of_seat_map: 0,

        number_of_airline: 0,
        seatList: seatListt,
        amountList: [],
        amountTVO: seatAmountList,
        defaultSeatOccupation: [],
        midAmount: 0,
        seatDataList: [],
        mealsList: MealsList,
        baggageList: BaggageList,
        baggage: baglis,
        meals: MealsNew,

        isError: false,
        isLoading: false,
        errorMessage: "",
        isSeatsShow: seatMapList?.[0]?.SegmentSeat?.length > 0 ? true : false,
      };
    } catch (error) {
      console.warn(error);
      return { error: true, errorMessage: error };
    }
  };

  const flightRuleSearch = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: "/skyTrails/flight/farerule",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.error("Error in flightRuleSearch:", error);
      return { error: true, errorMessage: error };
    }
  };
  const kafilaFareCheck = async (payload) => {
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/kafila/kafilaFareCheck`,
        payload
      );
      return response;
    } catch (error) {
      console.error(error);
      return { error: true, errorMessage: error?.message };
    }
  };
  const kafilaSsrApi = async (fareresponse) => {
    // let param = Array.isArray(fareresponse?.Param) ? fareresponse?.Param : [fareresponse?.Param]
    const payload = {
      IsFareUpdate: fareresponse?.IsFareUpdate,
      IsAncl: true || fareresponse?.IsAncl,
      Param: fareresponse?.Param,
      SelectedFlight: fareresponse?.SelectedFlight,
      FareBreakup: fareresponse?.FareBreakup,
      GstData: fareresponse?.GstData,
      IsAncl: fareresponse?.IsAncl,
    };
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/kafila/kafilaSSR`,
        payload
      );
      // setresponse(response);
      // setmealdata(response);
      return response;
      // console.log(response);
    } catch (error) {
      console.error(error, "error in kafila ssr");
      return { error: true, errorMessage: error };
    }
  };
  const fetchAirsel = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: `${apiURL.baseURL}/skyTrails/amadeus/airsell`,
        data: payload,
        headers: {
          "Content-Type": "text/xml",
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      return { error: true, errorMessage: error };
    }
  };

  const flightBookGDS = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: "skyTrails/flight/booking",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const flightGetTicketLcc = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: "skyTrails/flight/getticketlcc",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const flightGetTicketNonLcc = async (payload) => {
    try {
      const response = await axios({
        method: "POST",
        url: "skyTrails/flight/getticketnonlcc",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  const flightBookingDataSave = async (payload) => {
    try {
      const token = SecureStorage?.getItem("jwtToken");
      const response = await axios({
        method: "POST",
        url: "skyTrails/api/user/flightBooking",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      return response;
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };
  //Kafila PNR
  const kafilapnr = async (payloadvalue) => {
    try {
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/kafila/kafilaPnrcreation`,
        payloadvalue
      );
      // setresponse(response);
      // console.log("response aagya", response);
      // setpnrResponse(response?.data);
      return response?.data;
      // console.log(response);
    } catch (error) {
      console.error(error, "error in kafila PNR api ");
      return { error: true, errorMessage: error };
    }
  };

  // return flight api

  const returnSearch = async (payload) => {
    // console.log({ payload, emtPayload });
    return axios({
      method: "POST",
      url: "/skyTrails/flight/search/return",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  };

  const flightGetTicketLccReturn = async (payload) => {
    try {
      return axios({
        method: "POST",
        url: "/skyTrails/flight/getticketlcc",
        baseURL: `${apiURL.baseURL}`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return { error: true, errorMessage: error };
    }
  };

  // multicity flight api

  const multicitySearch = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/flight/search/multicity",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const addBookingDetailsKafila = async (payloadkafila) => {
    try {
      const token = SecureStorage?.getItem("jwtToken");
      const response = await axios.post(
        `${apiURL.baseURL}/skyTrails/api/user/kafila/userFlightBookingData`,
        payloadkafila,
        {
          headers: {
            token: token,
          },
        }
      );
    } catch (error) { }
  };

  // multicity flight api

  //Hotel API's Start
  const hotelSearch = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/search/dedup",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelSearchInfo = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/searchinfo",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelRoomInfo = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/room",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelBlockRoom = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/blockroom",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelBookRoom = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/bookroom",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelBookingDetails = (payload) => {
    // console.log("payload of api 👍");
    return axios({
      method: "POST",
      url: "skyTrails/hotel/bookingdetails",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const hotelBookingDetailsSave = (payload) => {
    // const token = secureLocalStorage?.getItem("jwtToken");
    const token = localStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      url: "/skyTrails/api/user/hotelBooking",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  // Holiday Package API
  const searchPackage = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skyTrails/holidaypackage/getallpackages?keyword=${payload}`
    );
  };

  const searchPackageCategory = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skytrails/holidaypackage/categoryfilter?seeAll=true&keyword=${payload}`
    );
  };

  const searchPackageCountry = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skyTrails/domesticAndInternationalPackages?country=${payload}`
    );
  };

  const searchPackageBudget = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skytrails/holidaypackage/filterbyamount?amount=${payload}`
    );
  };
  const getAllPackages = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skyTrails/holidaypackage/getdomesticorinternational/${payload}?limit=1000`
    );
  };
  const getThemePackages = (payload) => {
    return axios.get(
      `${apiURL.baseURL}/skytrails/holidaypackage/specialtagfilter?${payload}`
    );
  };

  // holidayCategory details

  // const holidayCategory = (payload) => {
  //   // console.log("searchPackage" + payload.destination);
  //   // console.log("searchPackage" + payload.days);
  //   const { category } = payload;
  //   // ?filter=${days}&keyword=${destination}
  //   return axios.get(
  //     `${apiURL.baseURL}/skyTrails/beachesPackages?${category}=true`
  //   );
  // };

  // holidayCategory details

  const getOnePackage = (payload) => {
    // console.log("getOnePacked", payload);
    const { id } = payload;
    return axios.get(
      `${apiURL.baseURL}/skytrails/holidaypackage/singlepackage/${id}`
    );
  };

  const bookingHoliday = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/international/pakageBooking",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const passengerData = (payload) => {
    // console.log("Passenger payload", payload);
    return payload;
  };

  // Bus API start from here
  const getBusSearch = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/bus/search",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  //Bus API's Start

  const busBlock = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/bus/block",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const busBook = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/bus/book",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const busBookDetails = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/bus/bookingdetails",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const busBookingDataSave = (payload) => {
    const token = SecureStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      //url: "/skyTrails/api/user/busBooking",
      url:"/skytrails/crmagent/busbooking/create",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  // new hotel grn api's

  const hotelSearchGRN = (payload) => {
    return axios({
      method: "POST",
      url: `/skyTrails/tboandgrn/searchresults`,
      // url: `/skyTrails/grnconnect/searchmultihotel`,
      baseURL: `${apiURL.baseURL}`,
      data: payload.data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const hotelSearchGRNFew = (payload) => {
    return axios({
      method: "POST",
      url: `/skyTrails/grnconnect/hotelsearch`,
      // url: `/skyTrails/grnconnect/searchmultihotel`,
      baseURL: `${apiURL.baseURL}`,
      data: payload.data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelsingleDataGRN = (payload) => {
    // console.log("key")
    // const { data } = payload;
    const searchId = payload.searchID;
    return axios({
      method: "POST",
      url: `/skyTrails/grnconnect/rateRefetchHotel?searchId=${searchId}`,
      baseURL: `${apiURL.baseURL}`,
      data: payload.data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // book room

  const hotelBookRoomGRN = (payload) => {
    // console.log("key")
    const { data } = payload;
    const searchId = payload.searchID;
    const hcode = payload.hotel_code;
    return axios({
      method: "GET",
      // url: `/skyTrails/grnconnect/rateRefetchHotel?searchId=${searchId}`,
      url: `/skyTrails/grnconnect/refetchHotel?searchId=${searchId}&hcode=${hcode}`,
      baseURL: `${apiURL.baseURL}`,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelGalleryGRN = (payload) => {
    // console.log("key")
    const hotel_id = payload.hotel_id;
    return axios({
      method: "GET",
      url: `/skyTrails/grnconnect/hotelimages?hotelCode=${hotel_id}`,
      baseURL: `${apiURL.baseURL}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelBookingGRN = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/grnconnect/hotelbooking",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const hotelBookingDetailsSaveGRN = (payload) => {
    const token = secureLocalStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      // url: "/skyTrails/api/grn/user/grnBookig",
      url: "/skytrails/crmagent/hotelbooking/create",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  // new hotel grn api's

  // fetch tnpl

  const fetchTNPL = () => {
    return axios.get(
      `${apiURL.baseURL}/skyTrails/mihuru/partnerauthentication`
    );
  };

  const tnplUserData = (payload) => {
    // console.log("Passenger payload", payload);
    return payload;
  };

  const tnplOTPVerified = (payload) => {
    // console.log("Passenger payload", payload);
    return payload;
  };

  const tnplPlanGenerator = (payload) => {
    // console.log("Passenger payload", payload);
    return payload;
  };

  // itenerary api's

  const iteneraryPayloadData = (payload) => {
    // console.log("Passenger payload", payload);
    return payload;
  };

  const hotelSearchforItenerary = (payload) => {
    return axios({
      method: "POST",
      url: "skyTrails/hotel/search/dedup",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const itenerarySearch = (payload) => {
    const { origin, destination, noOfDays } = payload;
    return axios({
      method: "GET",
      url: `/skyTrails/api/itinerary/dayWise/getAllCItyWiseItinerary?origin=${origin}&&destination=${destination}&&noOfDays=${noOfDays}`,
      baseURL: `${apiURL.baseURL}`,
      // data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // const hotelSelectedRoom = (payload) => {
  //   return axios({
  //     method: "POST",
  //     url: "skyTrails/hotel/room",
  //     baseURL: `${apiURL.baseURL}`,
  //     data: payload,
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // };
  const hotelSelectedRoom = (payload) => {
    return payload;
  };

  const savehotelRoominItenerary = (payload) => {
    return payload;
  };

  const flightFromData = (payload) => {
    return payload;
  };

  const flightToData = (payload) => {
    return payload;
  };

  const handleFlightDomestic = (payload) => {
    return payload;
  };

  const handleFlightInternational = (payload) => {
    return payload;
  };

  const handleItenaryActivitySelection = (payload) => {
    return payload;
  };

  // onewayflight

  const IterneraryOneWaySearch = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/flight/search/oneway",

      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // onewayflight

  // itenerary api's

  //inventoryAuth

  const InventoryAuth = (payload) => {
    return axios({
      method: "POST",
      url: "/skyTrails/api/inventory/partnerLogin",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  const submitReview = (payload) => {
    const token = secureLocalStorage?.getItem("jwtToken");
    return axios({
      method: "POST",
      url: "/skyTrails/api/user/rating/rateOurApp",
      baseURL: `${apiURL.baseURL}`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
  };

  const fetchFareQuotesAirsetApi = (payload) => {
    return { name: "mohittttttttttttttttt" };
  };

  const fetchflightHotelSuggest = async () => {
    const data = await axios.get(
      `${apiURL.baseURL}/skyTrails/staticContent/flightPayload/listStaticFlightPayload`
    );
    console.log(
      "datattttt",
      apiURL.baseURL,
      data?.data?.result?.flightPayloadResult
    );

    return data?.data?.result?.flightPayloadResult;
  };

  return {
    userIP,
    markUp,
    fetchflightSuggest,
    userB2CLogin,
    profileDataUpdate,
    profilePicUpdate,
    faqReviewApi,
    userB2CLoginWithSocial,
    socialPhoneVerify,
    userB2BToken,
    oneWaySearch,
    oneWaySearchCombined,
    flightQuoteSearch,
    flightRuleSearch,
    flightGetTicketLcc,
    flightBookGDS,
    flightGetTicketNonLcc,
    returnSearch,
    multicitySearch,
    flightGetTicketLccReturn,
    hotelSearch,
    hotelSearchGRN,
    hotelSearchGRNFew,
    hotelsingleDataGRN,
    hotelBookRoomGRN,
    hotelGalleryGRN,
    hotelBookingGRN,
    hotelBookingDetailsSaveGRN,
    hotelSearchInfo,
    hotelRoomInfo,
    hotelBlockRoom,
    hotelBookRoom,
    hotelBookingDetails,
    searchPackage,
    searchPackageCategory,
    searchPackageCountry,
    searchPackageBudget,
    getAllPackages,
    getThemePackages,
    getOnePackage,
    bookingHoliday,
    getBusSearch,
    busBlock,
    busBook,
    busBookDetails,
    busBookingDataSave,
    passengerData,
    hotelBookingDetailsSave,
    flightBookingDataSave,
    fetchTNPL,
    tnplUserData,
    tnplOTPVerified,
    tnplPlanGenerator,
    flightBookingDB,
    flightList,
    airportList,

    iteneraryPayloadData,
    itenerarySearch,
    flightFromData,
    flightToData,
    handleFlightDomestic,
    handleFlightInternational,
    savehotelRoominItenerary,
    handleItenaryActivitySelection,
    hotelSearchforItenerary,

    hotelSelectedRoom,
    IterneraryOneWaySearch,
    submitReview,
    fetchFareQuotesAirsetApi,
    kafilaFareCheck,
    fetchAirsel,
    kafilapnr,
    addBookingDetailsKafila,
    flightSSR,
    kafilaSsrApi,
    userProfile,
    userWallet,
    updateUserWallet,
    rechargeHistoryWallet,
    flightBookingDetailsCommon,
    subtractUserWallet
  };
}

const userApi = api();

export default userApi;
