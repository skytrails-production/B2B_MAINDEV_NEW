import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { clearHotelRoomAndGallery } from "../../../Redux/HotelGRN/hotel";
import { FaPen } from "react-icons/fa";
import { clearHotelRoom } from "../../../Redux/Hotel/hotel";
import HotelResultCardBoxHold from "./HotelResultCardBoxHold";

export default function HotelRestCardMain({
  hotels,
  selectedCategories,
  priceRange,
  sortBy,
  searchTerm,
  selectedLocations,
}) {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);
  const [tooManyFilter, setToomanyFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    if (
      selectedCategories.length > 0 ||
      priceRange[0] !== 0 ||
      priceRange[1] !== Infinity ||
      searchTerm
    ) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [selectedCategories, priceRange, searchTerm]);

  let filteredHotels = hotels?.filter((hotel) => {
    // Normalize fields for both formats
    const name = hotel?.name || hotel?.HotelName;
    const category = hotel?.category || hotel?.StarRating;
    const price =
      hotel?.min_rate?.price || hotel?.Price?.PublishedPriceRoundedOff || 0;
    const image =
      hotel?.images?.url || hotel?.HotelPicture || hotel?.images?.main_image;

    if (!category || category < 3) {
      return false;
    }
    if (hotel?.min_rate?.non_refundable) {
      return false;
    }

    if (!image || image.trim() === "") {
      return false;
    }

    if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(category)
    ) {
      return false;
    }

    if (selectedLocations.length > 0) {
      const locationMatch = selectedLocations.some((location) =>
        [hotel?.name, hotel?.address, hotel?.HotelName, hotel?.HotelAddress]
          .filter(Boolean) // Exclude null/undefined values
          .some((field) => field.includes(location))
      );
      if (!locationMatch) {
        return false;
      }
    }

    if (price >= priceRange[0] && price <= priceRange[1]) {
      return true;
    }
    return false;
  });

  if (sortBy === "lowToHigh") {
    filteredHotels.sort((a, b) => {
      const priceA = a?.min_rate?.price ?? a?.PublishedPriceRoundedOff ?? 0;
      const priceB = b?.min_rate?.price ?? b?.PublishedPriceRoundedOff ?? 0;
      return priceA - priceB;
    });
  } else if (sortBy === "highToLow") {
    filteredHotels.sort((a, b) => {
      const priceA = a?.min_rate?.price ?? a?.PublishedPriceRoundedOff ?? 0;
      const priceB = b?.min_rate?.price ?? b?.PublishedPriceRoundedOff ?? 0;
      return priceB - priceA;
    });
  }

  useEffect(() => {
    dispatch(clearHotelRoomAndGallery());
    dispatch(clearHotelRoom());
  }, []);

  useEffect(() => {
    if (filteredHotels.length > 0) {
      setLoader(false);
    }
  }, [filteredHotels]);

  useEffect(() => {
    if (
      hotels?.length !== 0 &&
      filteredHotels?.length === 0 &&
      isFilterApplied
    ) {
      setToomanyFilter(true);
    } else {
      setToomanyFilter(false);
    }
  }, [hotels, filteredHotels]);

  let totalAdults = 0;
  let totalChildren = 0;

  hotels?.RoomGuests?.forEach((room) => {
    totalAdults += room?.NoOfAdults || 0;
    totalChildren += room?.NoOfChild || 0;
  });

  return (
    <>
      <>
        {tooManyFilter ? (
          <div className="col-lg-9">
            <div className="mt-5 mb-52 text-center">
              <p className="text-sm md:text-base font-semibold mb-2">
                Too many filter Applied !
              </p>
              <p className="text-sm md:text-sm flex flex-row gap-2 justify-center text-primary-6000 items-center">
                Please remove some <FaPen />
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredHotels?.length > 0 &&
              filteredHotels.map((result, index) => (
                <div key={index} className="col-lg-6">
                  <HotelResultCardBoxHold result={result} />
                </div>
              ))}
          </div>
        )}
      </>
    </>
  );
}
