import "./App.css";
import { Route, Routes, useNavigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import HotelHome from "./pages/HotelHome";
import Home from "./pages/Home";
import HolidayHome from "./pages/HolidayHome";

import ResultOnewayMain from "./pages/flight/ResultOnewayMain";
import ReturnFlightResult from "./pages/flight/ReturnFlightMain";
import ReturnFilghtMainDummy from "./pages/flight/ReturnFilghtMainDummy";
import { ipAction, tokenAction } from "./Redux/IP/actionIp";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import FlightBookWrapper from "./pages/flight/flightSearchForm/reviewDetails/FlightBookWrapper";

import Bus from "./pages/bus/Bus";

//import Bus from "./pages/bus/bus";
import BusResultMain from "./pages/bus/BusResult/BusResultMain";
import BusFinalReview from "./pages/bus/busFinalReview/BusFinalReview";

import BusPassengerDetail from "./pages/bus/busPassengerDetails/BusPassengerDetails";
import HolidayPackageResultMain from "./pages/holiday/HolidayPackageSearchResult/HolidayPackageResultMain";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import HolidayDetailsEnquiry from "./pages/holiday/holidayDetailsEnquiryPages/HolidayDetailsEnquiry";
import HotelResultMain from "./pages/hotel/GRMHotel/HotelResultMain";
import HotelBookRoomGRN from "./pages/hotel/GRMHotel/HotelBookRoomGRN";
import BookingDetailsGRN from "./pages/hotel/GRMHotel/BookingDetailsGRN";
import BookingReviewGRN from "./pages/hotel/GRMHotel/BookingReviewGRN";
import HotelTicketDB from "./pages/hotel/GRMHotel/HotelTicketDB";
import HotelSelectroomMain from "./pages/hotel/GRMHotel/tboHotel/hotelselectroom/HotelSelectroomMain";
import TboGuestDetails from "./pages/hotel/GRMHotel/tboHotel/tboGuestDetails/TboGuestDetails";
import TboBookingHotel from "./pages/hotel/GRMHotel/tboHotel/bookHotel/TboBookingHotel";
import TboTicketGeneration from "./pages/hotel/GRMHotel/tboHotel/bookHotel/TboTicketGeneration";

import { getMarkUpAction } from "./Redux/markup/markupAction";
import PayButton from "./utility/PayButton";
import Itinerary from "./components/Itinerary";
import FlightBookTicket from "./pages/flight/FlightBookTicket";
import ProtectedLayout from "./components/ProtectedLayout";
import MainLayout from "./components/MainLayout";
import BookingHistory from "./components/bookingHistory/BookingHistory";
import DownloadHotelPdf from "./components/bookingHistory/DownloadHotelPdf";
import VisaForm from "./pages/visa/VisaForm2";
import VisaForm1 from "./pages/visa/VisaForm1";
import VisaHome from "./pages/visa/VisaHome";
import FlightHistoryViewDetails from "./components/bookingHistory/FlightHistoryViewDetails";

import ResultOnewayMainDummy from "./pages/flight/ResultOnewayMainDummy";
import FlightBookWrapperDummy from "./pages/flight/dummy-flight/FlightBookWrapperDummy";
import LoginPage from "./pages/Auth/LoginPage";
import HomeDummy from "./pages/flight/dummy-flight/HomeDummy";

import HotelHoldHome from "./pages/HotelHoldHome";


function App() {
  const reducerState = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ipAction());
    dispatch(getMarkUpAction());
    // dispatch(faqRatingListReq());
  }, []);

  useEffect(() => {
    const payload = {
      EndUserIp: reducerState?.ip?.ipData,
    };
    dispatch(tokenAction(payload));
  }, [reducerState?.ip?.ipData]);
  const MainLayoutDummy = () => {
    const isDummy = sessionStorage.getItem("isDummy");
    const redirectURL = sessionStorage.getItem("redirectURL");
    const navigate = useNavigate();

    useEffect(() => {
      if (!isDummy) {
        navigate(`/`, { replace: true });
      }
    }, [isDummy, navigate]);

    if (isDummy != "true") {
      return null; // Or loading spinner while redirecting
    }

    return (
      <>
        <Outlet />
      </>
    );
  };
  return (
    <>
      <Routes>
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/log-in" element={<LoginPage />} />

        {/* Protected Pages */}
        <Route element={<ProtectedLayout />}>
          {/* <Route element={<MainLayoutDummy />}> */}
          <Route path="/dummy-flight" element={<HomeDummy />} />

          <Route
            path="/flight-details-dummy"
            element={
              <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">Dummy Flight Details</h1>
              </div>
            }
          />

          <Route
            path="/flight-details-dummy/one-way/:city/:passengers"
            // element={<ResultOnewayMain />}
            element={<ResultOnewayMainDummy />}
          />
          <Route
            path="/flight-dummy/review-details"
            element={<FlightBookWrapperDummy />}
          />
          <Route path="/flight-dummy/ticket" element={<FlightBookTicket />} />
          <Route
            path="/flight-details-dummy/round-trip/:city/:passengers"
            element={<ReturnFilghtMainDummy />}
          />
          {/* </Route> */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hotelform" element={<HotelHome />} />
            <Route path="/holidayform" element={<HolidayHome />} />
            <Route
              path="/flight-details/one-way/:city/:passengers"
              element={<ResultOnewayMain />}
            />

            <Route
              path="/flight/review-details"
              element={<FlightBookWrapper />}
            />
            <Route
              path="/flight-details/round-trip/:city/:passengers"
              element={<ReturnFlightResult />}
            />
            <Route path="/flight/ticket" element={<FlightBookTicket />} />
            <Route
              path="/flight/history/details"
              element={<FlightHistoryViewDetails />}
            />

            <Route path="/bus" element={<Bus />} />
            <Route path="/busresult" element={<BusResultMain />} />
            <Route
              path="/BusPassengerDetail"
              element={<BusPassengerDetail />}
            />
            <Route path="/BusReviewBooking" element={<BusFinalReview />} />

            <Route
              path="/holidaypackages/:type/:keyword"
              element={<HolidayPackageResultMain />}
            />
            <Route
              path="/holidaypackages/packagedetails/:destinationDays"
              element={<HolidayDetailsEnquiry />}
            />

            <Route
              path="/st-hotel/hotelresult/:cityName"
              element={<HotelResultMain />}
            />
            <Route
              path="/st-hotel/hotelresult/selectroom"
              element={<HotelBookRoomGRN />}
            />
            <Route
              path="/st-hotel/hotelresult/selectroom/guestDetails"
              element={<BookingDetailsGRN />}
            />
            <Route
              path="/st-hotel/hotelresult/selectroom/guestDetails/review"
              element={<BookingReviewGRN />}
            />
            <Route
              path="/st-hotel/hotelresult/selectroom/guestDetails/review/ticket"
              element={<HotelTicketDB />}
            />

            {/* TBO Hotel */}
            <Route
              path="/st-hotel/hotelresult/HotelBooknow"
              element={<HotelSelectroomMain />}
            />
            <Route
              path="/st-hotel/hotelresult/HotelBooknow/Reviewbooking"
              element={<TboGuestDetails />}
            />
            <Route
              path="/st-hotel/hotelresult/HotelBooknow/Reviewbooking/bookhotel"
              element={<TboBookingHotel />}
            />
            <Route
              path="/st-hotel/hotelresult/HotelBooknow/Reviewbooking/GuestDetail/ticket"
              element={<TboTicketGeneration />}
            />
            <Route
              path="/st-hotel/hotelresult/selectroom/guestDetails/review/ticket"
              element={<HotelTicketDB />}
            />
            <Route
              exact
              path="/st-hotel/hotelresult/HotelBooknow/Reviewbooking/GuestDetail/ticket"
              element={<TboTicketGeneration />}
            />

            <Route path="/testPayment" element={<PayButton />} />

            <Route path="/bookinghistory" element={<BookingHistory />}></Route>
            <Route
              path="/bookinghistory/hotelPdf"
              element={<DownloadHotelPdf />}
            ></Route>
            <Route path="/visa" element={<VisaHome />}></Route>
            <Route path="/visa/userdetails" element={<VisaForm1 />}></Route>
            <Route
              path="/visa/userdetails/visadetails"
              element={<VisaForm />}
            ></Route>

            {/* hold hotel grn  */}
            {/* <Route path="/hotelhold" element={<HotelHoldHome />} /> */}
            {/* hold hotel grn  */}
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
