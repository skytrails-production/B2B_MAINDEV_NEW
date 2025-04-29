import {
  FaBus,
  FaPlane,
  FaHotel,
  FaUserFriends,
  FaArrowRight,
} from "react-icons/fa";
const Loader = ({ serviceType }) => {
  const serviceData = {
    bus: {
      icon: <FaBus className="text-4xl text-white" />,
      color: "from-primary-200  to-primary-700",
    },
    flight: {
      icon: <FaPlane className="text-4xl text-white" />,
      color: "from-primary-200  to-primary-700",
    },
    hotel: {
      icon: <FaHotel className="text-4xl text-white" />,
      color: "from-primary-200  to-primary-700",
    },
    visa: {
      icon: <FaHotel className="text-4xl text-white" />,
      color: "from-primary-200  to-primary-700",
    },
  };

  // Make sure to add these animations to your Tailwind config
  return (
    <div className="flex flex-col py-4 items-center min-h-screen gap-6">
      {/* Spinning Gradient Orb */}
      <div
        className={`relative w-32 h-32 rounded-full bg-gradient-to-tr ${serviceData[serviceType].color} 
          animate-spin-slow`}
      >
        {/* Inner Circle */}
        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center z-50 ">
          <div className="animate-pulse-slow text-black">
            {serviceData[serviceType].icon}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-tr from-white/30 to-transparent rounded-full" />
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-tr from-white/30 to-transparent rounded-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-2 text-center">
        <h2
          className={`text-2xl font-bold bg-gradient-to-r ${serviceData[serviceType].color} 
          bg-clip-text text-transparent animate-text-gradient`}
        >
          Loading {serviceType} bookings
        </h2>
        <p className="text-gray-500">We're gathering your travel information</p>
      </div>
    </div>
  );
};
export default Loader;
