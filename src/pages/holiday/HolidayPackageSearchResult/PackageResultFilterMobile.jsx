import React, { useState } from "react";
import { Select, Modal, Button, Slider, Checkbox } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import "./packageResultfiltermobile.scss";
const { Option } = Select;

const PackageResultFilterMobile = ({
  uniqueDestinations,
  selectedDestinations,
  setSelectedDestinations,
  priceRange,
  onPriceChange,
  minPrice,
  maxPrice,
  onFilterChange,
  selectedTag,
  onTagChange,
  selectedDays,
  onDaysChange,
  onClearFilters,
}) => {
  const [isCitiesModalVisible, setIsCitiesModalVisible] = useState(false);
  const [localSelectedDestinations, setLocalSelectedDestinations] =
    useState(selectedDestinations);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [isThemesModalVisible, setIsThemesModalVisible] = useState(false);
  const [localSelectedTag, setLocalSelectedTag] = useState(selectedTag);
  const [isDaysModalVisible, setIsDaysModalVisible] = useState(false);
  const [localSelectedDays, setLocalSelectedDays] = useState(selectedDays);
  const [isCitiesFilterApplied, setIsCitiesFilterApplied] = useState(false);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(false);
  const [isThemesFilterApplied, setIsThemesFilterApplied] = useState(false);
  const [isDaysFilterApplied, setIsDaysFilterApplied] = useState(false);

  const [clearVisible, setClearVisible] = useState(false);

  // Cities modal and functions
  const showCitiesModal = () => {
    setLocalSelectedDestinations(selectedDestinations);
    setIsCitiesModalVisible(true);
  };

  const handleCitiesOk = () => {
    setSelectedDestinations(localSelectedDestinations);
    onFilterChange(
      localSelectedDestinations,
      localPriceRange,
      localSelectedTag,
      "",
      "",
      selectedDays
    ); // Apply filter
    setIsCitiesModalVisible(false);
    setIsCitiesFilterApplied(true);
    setClearVisible(true);
  };

  const handleCitiesCancel = () => {
    setIsCitiesModalVisible(false);
  };

  const handleDestinationChange = (values) => {
    setLocalSelectedDestinations(values);
  };

  // Price modal and functions
  const showPriceModal = () => {
    setLocalPriceRange(priceRange);
    setIsPriceModalVisible(true);
  };

  const handlePriceOk = () => {
    onPriceChange(localPriceRange);
    onFilterChange(
      selectedDestinations,
      localPriceRange,
      localSelectedTag,
      "",
      "",
      selectedDays
    ); // Apply filter
    setIsPriceModalVisible(false);
    setIsPriceFilterApplied(true);
    setClearVisible(true);
  };

  const handlePriceCancel = () => {
    setIsPriceModalVisible(false);
  };

  const handlePriceChange = (value) => {
    setLocalPriceRange(value);
  };

  // Themes modal and functions
  const showThemesModal = () => {
    setLocalSelectedTag(selectedTag);
    setIsThemesModalVisible(true);
  };

  const handleThemesOk = () => {
    onTagChange(localSelectedTag);
    onFilterChange(
      selectedDestinations,
      localPriceRange,
      localSelectedTag,
      "",
      "",
      selectedDays
    ); // Apply filter
    setIsThemesModalVisible(false);
    setIsThemesFilterApplied(true);
    setClearVisible(true);
  };

  const handleThemesCancel = () => {
    setIsThemesModalVisible(false);
  };

  const handleTagChange = (e) => {
    setLocalSelectedTag(e.target.value);
  };

  // Days modal and functions
  const showDaysModal = () => {
    // setLocalSelectedDays(selectedDays);
    setIsDaysModalVisible(true);
  };

  const handleDaysOk = () => {
    // console.log(localSelectedDays, "localselecteddays");
    // onDaysChange(selectedDays);
    onFilterChange(
      selectedDestinations,
      localPriceRange,
      localSelectedTag,
      "",
      "",
      localSelectedDays
    ); // Apply filter
    setIsDaysModalVisible(false);
    setIsDaysFilterApplied(true);
    setClearVisible(true);
  };

  const handleDaysCancel = () => {
    setIsDaysModalVisible(false);
  };
  const handleDaysChange = (e) => {
    const value = e.target.value;
    let newDay = [...localSelectedDays];
    if (newDay.includes(value)) {
      newDay = newDay.filter((day) => day !== value);
    } else {
      newDay.push(value);
    }
    console.log(newDay, "newDay");

    setLocalSelectedDays(newDay);
    // onDaysChange(value);
  };

  // Clear filter function
  const handleClearFilter = () => {
    setSelectedDestinations([]);
    setLocalSelectedDestinations([]);
    setLocalPriceRange([minPrice, maxPrice]);
    setLocalSelectedTag("");
    // setLocalSelectedDays([]);
    onClearFilters();
    onFilterChange([], [minPrice, maxPrice], "", []);
    setIsCitiesFilterApplied(false);
    setIsPriceFilterApplied(false);
    setIsThemesFilterApplied(false);
    setIsDaysFilterApplied(false);
    setClearVisible(false);
  };

  // console.log(localPriceRange, "localPriceRange")

  return (
    <div className="filterPackageMobileBox">
      {!clearVisible ? (
        <div>
          <p
            className="gap-2 d-flex fex-row align-items-center"
            style={{ color: "gray" }}
          >
            <SlidersOutlined /> <span>Filter</span>
          </p>
        </div>
      ) : (
        <div>
          <p
            className="gap-2 d-flex fex-row align-items-center"
            onClick={handleClearFilter}
          >
            {" "}
            <span>Clear</span>
          </p>
        </div>
      )}

      <div className="selectFilterBoxMobile">
        {/* Cities Filter Box */}
        <div className="filterCitiesMobile" onClick={showCitiesModal}>
          <p
            style={{
              border: isCitiesFilterApplied
                ? "1px solid #e73c34"
                : "1px solid gray",
              color: isCitiesFilterApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Select Cities
          </p>
        </div>

        {/* Cities Modal */}
        <Modal
          title="Select Cities"
          centered
          maskClosable={false}
          open={isCitiesModalVisible}
          onOk={handleCitiesOk}
          onCancel={handleCitiesCancel}
          footer={[
            <Button key="back" onClick={handleCitiesCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleCitiesOk}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="holidayFilterSelectMulti">
            <p className="">Cities</p>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Please select destinations"
              value={localSelectedDestinations}
              onChange={handleDestinationChange}
            >
              {uniqueDestinations.map((destination) => (
                <Option key={destination} value={destination}>
                  {destination}
                </Option>
              ))}
            </Select>
          </div>
        </Modal>

        {/* Price Filter Box */}
        <div className="filterCitiesMobile" onClick={showPriceModal}>
          <p
            style={{
              border: isPriceFilterApplied
                ? "1px solid #e73c34"
                : "1px solid gray",
              color: isPriceFilterApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Filter By Price
          </p>
        </div>
        {/* Price Modal */}

        <Modal
          title="Filter By Price"
          centered
          open={isPriceModalVisible}
          onOk={handlePriceOk}
          onCancel={handlePriceCancel}
          footer={[
            <Button key="back" onClick={handlePriceCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handlePriceOk}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="holidayFilterSlider">
            <p>Filter By Price</p>
            <Slider
              range
              step={400}
              min={minPrice}
              max={maxPrice}
              value={localPriceRange}
              onChange={handlePriceChange}
            />
            <div className="flex-row d-flex justify-content-between align-items-center ">
              <span style={{ fontWeight: "600", fontSize: "13px" }}>
                ₹ {localPriceRange?.[0]}
              </span>
              <span style={{ fontWeight: "600", fontSize: "13px" }}>
                ₹ {localPriceRange?.[1]}
              </span>
            </div>
          </div>
        </Modal>

        {/* Themes Filter Box */}
        <div className="filterCitiesMobile" onClick={showThemesModal}>
          <p
            style={{
              border: isThemesFilterApplied
                ? "1px solid #e73c34"
                : "1px solid gray",
              color: isThemesFilterApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Select Themes
          </p>
        </div>

        {/* Themes Modal */}
        <Modal
          title="Select Themes"
          centered
          open={isThemesModalVisible}
          onOk={handleThemesOk}
          onCancel={handleThemesCancel}
          footer={[
            <Button key="back" onClick={handleThemesCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleThemesOk}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="PackagetagFilters">
            <p>Themes</p>
            <Checkbox
              value="honeymoon"
              checked={localSelectedTag === "honeymoon"}
              onChange={handleTagChange}
            >
              Honeymoon
            </Checkbox>
            <Checkbox
              value="family"
              checked={localSelectedTag === "family"}
              onChange={handleTagChange}
            >
              Family
            </Checkbox>
            <Checkbox
              value="family"
              checked={localSelectedTag === "luxury"}
              onChange={handleTagChange}
            >
              Luxury
            </Checkbox>
            <Checkbox
              value="family"
              checked={localSelectedTag === "budget"}
              onChange={handleTagChange}
            >
              Budget
            </Checkbox>
            <Checkbox
              value="anniversary"
              checked={localSelectedTag === "group"}
              onChange={handleTagChange}
            >
              Group
            </Checkbox>
            <Checkbox
              value="couples"
              checked={localSelectedTag === "couples"}
              onChange={handleTagChange}
            >
              Couples
            </Checkbox>
            <Checkbox
              value="solo"
              checked={localSelectedTag === "solo"}
              onChange={handleTagChange}
            >
              Solo
            </Checkbox>
          </div>
        </Modal>

        {/* Days Filter Box */}
        <div className="filterCitiesMobile" onClick={showDaysModal}>
          <p
            style={{
              border: isDaysFilterApplied
                ? "1px solid #e73c34"
                : "1px solid gray",
              color: isDaysFilterApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Filter By Days
          </p>
        </div>

        {/* Days Modal */}
        <Modal
          title="Filter By Days"
          centered
          open={isDaysModalVisible}
          onOk={handleDaysOk}
          onCancel={handleDaysCancel}
          footer={[
            <Button key="back" onClick={handleDaysCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleDaysOk}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="PackagetagFilters">
            <p>Filter By Days</p>
            <Checkbox
              value="0-5"
              checked={localSelectedDays.includes("0-5")}
              onChange={handleDaysChange}
            >
              0-5 days
            </Checkbox>
            <Checkbox
              value="5-7"
              checked={localSelectedDays.includes("5-7")}
              onChange={handleDaysChange}
            >
              5-7 days
            </Checkbox>
            <Checkbox
              value="7-10"
              checked={localSelectedDays.includes("7-10")}
              onChange={handleDaysChange}
            >
              7-10 days
            </Checkbox>
            <Checkbox
              value="10+"
              checked={localSelectedDays.includes("10+")}
              onChange={handleDaysChange}
            >
              10+ days
            </Checkbox>
          </div>
        </Modal>
      </div>
      {/* Clear Filter Button */}
      {/* <Button onClick={handleClearFilter}>Clear Filter</Button> */}
    </div>
  );
};

export default PackageResultFilterMobile;
