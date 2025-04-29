import {
  FaBus,
  FaPlane,
  FaHotel,
  FaUserFriends,
  FaArrowRight,
  FaCcVisa,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
const NoBookings = ({ serviceType }) => {
  const serviceData = {
    bus: {
      icon: <FaBus className="text-6xl text-white transform -rotate-12" />,
      color: "from-blue-500 to-purple-600",
      link: "/bus",
    },
    flight: {
      icon: <FaPlane className="text-6xl text-white transform -rotate-12" />,
      color: "from-cyan-500 to-blue-600",
      link: "/",
    },
    hotel: {
      icon: <FaHotel className="text-6xl text-white transform -rotate-12" />,
      color: "from-green-500 to-teal-600",
      link: "/hotelform",
    },
    visa: {
      icon: <FaCcVisa className="text-6xl text-white transform -rotate-12" />,
      color: "from-green-500 to-teal-600",
      link: "/visa",
    },
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 text-center">
      <div className="relative w-64 h-64">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full 
        blur-xl opacity-50 animate-pulseLoader"
        />
        <div
          className="relative z-10 p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
        shadow-2xl shadow-blue-100"
        >
          {/* <FaBus className="text-6xl text-white transform -rotate-12" /> */}
          {serviceData[serviceType].icon}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          No {serviceType} Bookings Found
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          It seems you haven't made any {serviceType} reservations yet. Start
          planning your next journey!
        </p>
      </div>

      <button
        className="px-8 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full
      hover:shadow-lg hover:scale-105 transform transition-all duration-300 font-semibold
      hover:from-blue-600 hover:to-purple-700"
        onClick={() => navigate(serviceData[serviceType]?.link)}
      >
        Explore {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}{" "}
        Options
      </button>
    </div>
  );
};

export default NoBookings;
