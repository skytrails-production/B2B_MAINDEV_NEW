import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../../node_modules/swiper/swiper-bundle.min.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PiAirplaneInFlight } from "react-icons/pi";
import { LiaHotelSolid } from "react-icons/lia";
import { IoBusOutline } from "react-icons/io5";
import { FaUmbrellaBeach } from "react-icons/fa";
import CardOne1 from "./CardOne";

const SkeletonLoader = () => {
  return (
    <div className="relative flex flex-shrink-0 w-full h-64 space-x-4 overflow-hidden bg-gray-200 animate-pulse aspect-w-5 aspect-h-5 sm:aspect-h-6 rounded-2xl group"></div>
  );
};
const Testi = ({
  heading = "Testimonials",
  subHeading = "What our happy user says!",
  className = "",
  itemPerRow = 3,
  sliderStyle = "style1",
}) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [rating, setRating] = useState([]);
  const Rating = useSelector((state) => state?.faqRating?.faqRating?.rating);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    // fetchData();
    if (Rating) {
      setLoading(false);
    }
  }, [Rating]);

  // Effect that updates the title based on the current pathname
  useEffect(() => {
    switch (pathname) {
      case "/":
        setTitle("FLIGHTS");
        setIcon(<PiAirplaneInFlight />);
        // setTitle("flight");
        break;
      case "/st-hotel":
        setTitle("HOTELS");
        setIcon(<LiaHotelSolid />);
        break;
      case "/bus":
        setTitle("BUSES");
        setIcon(<IoBusOutline />);
        break;
      case "/holidaypackages":
        setTitle("HOLIDAYPACKAGE");
        setIcon(<FaUmbrellaBeach />);
        break;
      default:
        setTitle("FLIGHTS");
        setIcon(<PiAirplaneInFlight />);
        break;
    }
  }, [pathname]);

  useEffect(() => {
    if (Rating?.length > 0 && title) {
      let newRating = Rating?.filter((item) => {
        return title === item?.section;
      });
      setRating(newRating);
    }
  }, [Rating, title]);

  return (
    <section className="py-14 ">
      <div className="mx-auto custom-container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-y-0  flex-column md:flex-row justify-between gap-x-8 max-w-full mx-auto">
          <div className="w-full lg:w-2/5">
            {/* <span className="text-base text-center md:text-left text-gray-500 font-medium mb-4 block">
              Testimonial
            </span> */}
            <h2 className="text-2xl md:text-4xl text-center md:text-left font-bold text-gray-900 leading-8 md:leading-[3.25rem] mb-8">
              5k+ Customers gave their{" "}
              <span className=" text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-violet-600">
                Feedback
              </span>
            </h2>
          </div>
          <div className="w-full ">
            <div className="swiper favSwiper-active mt-2">
              <div className="swiper-wrapper  relative">
                <div className="custom-navigation">
                  <button className="custom-prev">
                    <div className="h-6 w-6 flex justify-center items-center">
                      <i className="fa fa-chevron-left"></i>
                    </div>
                  </button>
                  <button className=" custom-next">
                    <div className="h-6 w-6 flex justify-center items-center">
                      <i className="fa fa-chevron-right"></i>
                    </div>
                  </button>
                </div>
                <Swiper
                  modules={[Autoplay, Pagination, Navigation]}
                  loop={true}
                  spaceBetween={25}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                    1224: {
                      slidesPerView: 3,
                    },
                    0: {
                      slidesPerView: 1,
                    },
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    prevEl: ".custom-prev",
                    nextEl: ".custom-next",
                  }}
                >
                  {loading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <SwiperSlide key={index}>{SkeletonLoader()}</SwiperSlide>
                    ))
                  ) : (
                    <>
                      {rating?.map((item, index) => (
                        <SwiperSlide key={index}>
                          <CardOne1 item={item} icon={icon} index={index} />
                        </SwiperSlide>
                      ))}
                    </>
                  )}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testi;
