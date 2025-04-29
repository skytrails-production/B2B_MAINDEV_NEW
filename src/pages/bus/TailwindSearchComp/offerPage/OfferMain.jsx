import React, { useEffect, useState } from "react";
import Heading from "../shared/Heading";
import OfferCard from "./OfferCard";
import "./offerMain.css";
import axios from "axios";
import { apiURL } from "../../../Constants/constant";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../../node_modules/swiper/swiper-bundle.min.css";
import { useNavigate } from "react-router-dom";

const OfferMain = ({
  heading = "Exclusive Offers",
  subHeading = "Best Offers recommended for you",
  className = "",
  itemPerRow = 4,
  active,
  sliderStyle = "style1",
}) => {
  const [filterType, setFilterType] = useState(active);
  const localData = sessionStorage.getItem("advertise");
  const localDataArray = JSON.parse(localData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiURL.baseURL}/skyTrails/api/combine/combieOffers`
        );
        const data = response.data.result;
        const jsonData = JSON.stringify(data);
        sessionStorage.setItem("advertise", jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [localData]);

  const filteredData = localDataArray?.filter(
    (item) => item.addType === filterType || item.addType === "FORALL"
  );

  const filterOptions = ["DEALS", "FLIGHTS", "BUS", "HOTELS", "HOLIDAYS"];

  return (
    <div className={`nc-SectionSliderNewCategories mt-16 mb-12 ${className}`}>
      <Heading desc={subHeading} isCenter={true}>
        {heading}
      </Heading>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-2 md:space-x-4 mb-4">
        {filterOptions.map((type) => (
          <button
            key={type}
            className={`px-3 sm:px-4 md:px-4 lg:px-4 xl:px-4 py-2 md:py-2 lg:py-2 xl:py-2 text-[12px] md:text-base font-medium md:font-semibold ${
              filterType === type
                ? "bg-primary-6000 hover:bg-primary-700 text-white border rounded-3xl "
                : " text-black"
            }`}
            onClick={() => setFilterType(type)}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      <div class="swiper favSwiper-active mt-5">
        <div class="swiper-wrapper fade-container relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            spaceBetween={15}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              0: {
                slidesPerView: 1,
              },
            }}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
            navigation={true}
          >
            {filteredData?.map((item, indx) => (
              <SwiperSlide>
                <OfferCard data={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="flex justify-center my-5">
        <button
          onClick={() => navigate("/offers")}
          className="bg-primary-6000 hover:bg-primary-700 rounded-full px-4 py-2 text-white"
        >
          See All Offers
        </button>
      </div>
    </div>
  );
};

export default OfferMain;
