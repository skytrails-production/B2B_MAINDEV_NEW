import React, { useState, useEffect } from "react";
import PackageResultFilter from "./PackageResultFilter";
import HolidayResult from "./HolidayResult";
// import "./holidayResult.scss";
import { useParams } from "react-router-dom";
import { apiURL } from "../../../Constants/constant";
import { useDispatch, useSelector } from "react-redux";
import { FaPen } from "react-icons/fa";
import {
  searchPackageAction,
  searchPackageActionBudget,
  searchPackageActionCategory,
  searchPackageActionTopCountries,
} from "../../../Redux/SearchPackage/actionSearchPackage";
import { clearHolidayReducer } from "../../../Redux/OnePackageSearchResult/actionOneSearchPackage";

const HolidayPackageResultMain = () => {
  const reducerState = useSelector((state) => state);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [flightIncluded, setFlightIncluded] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [packageData, setPackagedata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooManyFilter, setToomanyFilter] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [data, setData] = useState([]);
  const { keyword, type } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearHolidayReducer());
  }, []);
  useEffect(() => {
    setLoading(true);
  }, [keyword]);

  useEffect(() => {
    if (type == "cities") {
      dispatch(searchPackageAction(keyword));
    }
    if (type == "category") {
      dispatch(searchPackageActionCategory(keyword));
    }
    if (type == "country") {
      dispatch(searchPackageActionTopCountries(keyword));
    }
    if (type == "budget") {
      dispatch(searchPackageActionBudget(keyword));
    }
    sessionStorage.setItem("searchPackageData", JSON.stringify(keyword));
  }, [dispatch, keyword, type]);

  const Package =
    reducerState?.searchResult?.packageSearchResult?.data?.data ||
    reducerState?.searchResult?.packageSearchResult?.data?.results ||
    reducerState?.searchResult?.packageSearchResult?.data?.data ||
    [];

  useEffect(() => {
    if (Package.length > 0) {
      setLoading(false);
      setPackagedata(Package);
    }
  }, [Package]);

  console.log(Package, "package");

  const uniqueDestinations =
    Package?.length > 0
      ? [
          ...new Set(
            Package?.flatMap((pkg) =>
              pkg?.destination?.map((dest) => dest?.addMore)
            )
          ),
        ]
      : [];

  const handleFilterChange = (
    selectedDestinations,
    priceRange,
    tag,
    includeFlight,
    days
  ) => {
    let filtered = Package;

    if (selectedDestinations?.length > 0) {
      filtered = filtered?.filter((pkg) =>
        selectedDestinations.every((dest) =>
          pkg?.destination?.some((d) => d.addMore === dest)
        )
      );
      setIsFilterApplied(true);
    }

    if (includeFlight) {
      if (includeFlight === "flight") {
        filtered = filtered?.filter((pkg) =>
          pkg?.inclusions?.some((t) => t.flight === "true")
        );
        setIsFilterApplied(true);
      } else if (includeFlight === "no-flight") {
        filtered = filtered?.filter(
          (pkg) => !pkg?.inclusions?.some((t) => t.flight === "true")
        );
        setIsFilterApplied(true);
      }
    }

    if (tag) {
      filtered = filtered?.filter((pkg) =>
        pkg.specialTag.some((t) => t[tag] === true)
      );
      setIsFilterApplied(true);
    }

    if (days?.length > 0) {
      filtered = filtered?.filter((pkg) => {
        const daysInRange = days?.some((range) => {
          switch (range) {
            case "0-5":
              return pkg?.days >= 0 && pkg?.days <= 5;
            case "5-7":
              return pkg?.days >= 5 && pkg?.days <= 7;
            case "7-10":
              return pkg?.days >= 7 && pkg?.days <= 10;
            case "10+":
              return pkg?.days >= 10;
            default:
              return false;
          }
        });
        setIsFilterApplied(true);
        return daysInRange;
      });
    }

    setPackagedata(filtered);
  };

  const getMinMaxPrices = (Pack) => {
    if (!Pack || Pack.length === 0) {
      return { min: 0, max: 0 };
    }

    const validPackage = Pack?.filter(
      (pkg) => pkg && pkg?.packageAmount?.[0]?.amount
    );

    if (validPackage.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = validPackage?.map((pkg) => pkg.packageAmount?.[0].amount);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  const { min, max } = getMinMaxPrices(Package);

  useEffect(() => {
    setPriceRange([min, max]);
  }, [min, max]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleTagChange = (value) => {
    setSelectedTag(value);
  };

  const handleFlightChange = (value) => {
    setFlightIncluded(value);
  };

  const handleDaysChange = (value) => {
    setSelectedDays((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  const handleClearFilters = () => {
    setPackagedata(Package);
    setPriceRange([min, max]);
    setSelectedTag(null);
    setFlightIncluded(null);
    setSelectedDays([]);
    setSearchTerm("");
    setSelectedDestinations([]);
  };

  useEffect(() => {
    if (Package?.length != 0 && packageData?.length == 0 && isFilterApplied) {
      setToomanyFilter(true);
    } else {
      setToomanyFilter(false);
    }
  }, [Package, packageData]);

  return (
    <div>
      {/* <Navbar /> */}
      {/* <PackageResultSearchFormMain cityData={data} /> */}
      <>
        <div className="container ">
          <div className="mt-3 row">
            <div className="p-0 col-lg-3 visibleBig">
              <PackageResultFilter
                uniqueDestinations={uniqueDestinations}
                onFilterChange={handleFilterChange}
                onPriceChange={handlePriceChange}
                minPrice={min}
                maxPrice={max}
                priceRange={priceRange}
                selectedTag={selectedTag}
                flightIncluded={flightIncluded}
                onTagChange={handleTagChange}
                onFlightChange={handleFlightChange}
                selectedDays={selectedDays}
                onDaysChange={handleDaysChange}
                onSearchTermChange={handleSearchTermChange}
                selectedDestinations={selectedDestinations}
                setSelectedDestinations={setSelectedDestinations}
                onClearFilters={handleClearFilters}
              />
            </div>
            {/* <div className="col-lg-12 visibleSmall stickyForMobile">
            <PackageResultFilterMobile
              uniqueDestinations={uniqueDestinations}
              onFilterChange={handleFilterChange}
              onPriceChange={handlePriceChange}
              minPrice={min}
              maxPrice={max}
              priceRange={priceRange}
              selectedTag={selectedTag}
              onTagChange={handleTagChange}
              selectedDays={selectedDays}
              onDaysChange={handleDaysChange}
              onSearchTermChange={handleSearchTermChange}
              selectedDestinations={selectedDestinations}
              setSelectedDestinations={setSelectedDestinations}
              onClearFilters={handleClearFilters}
            />
          </div> */}

            {tooManyFilter ? (
              <div className="col-lg-9">
                <div className="noHotels">
                  <h3>Too many filter Applied !</h3>
                  <p>
                    Please remove some <FaPen />
                  </p>
                </div>
              </div>
            ) : (
              <div className="col-lg-9">
                <HolidayResult
                  packages={packageData}
                  searchTerm={searchTerm}
                  priceRange={priceRange}
                />
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default HolidayPackageResultMain;
