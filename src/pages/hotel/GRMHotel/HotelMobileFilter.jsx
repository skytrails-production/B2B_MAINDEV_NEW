import React, { useState } from "react";
import { Modal, Checkbox, Slider, Input, Radio, Button } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";

const HotelMobileFilter = ({
  // uniqueFacilities,
  onCategoryChange,
  // onFacilityChange,
  onPriceChange,
  onSortChange,
  onSearchTermChange,
  onClearFilters,
  minPrice,
  maxPrice,
  searchTerm,
  selectedCategories,
  // selectedFacilities,
  priceRange,
  sortBy,
}) => {
  const [tempCategories, setTempCategories] = useState(selectedCategories);
  // const [tempFacilities, setTempFacilities] = useState(selectedFacilities);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempSortBy, setTempSortBy] = useState(sortBy);
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);

  const [isStarVisible, setIsStarVisible] = useState(false);
  // const [isFacilitiesVisible, setIsFacilitiesVisible] = useState(false)
  const [isPriceVisible, setIsPriceVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const [starApplied, setStarApplied] = useState(false);
  // const [facilitiesApplied, setFacilitiesApplied] = useState(false);
  const [priceApplied, setPriceApplied] = useState(false);
  const [sortApplied, setSortApplied] = useState(false);

  const handleCategoryChange = (value) => {
    const updatedCategories = tempCategories.includes(value)
      ? tempCategories.filter((category) => category !== value)
      : [...tempCategories, value];
    setTempCategories(updatedCategories);
  };

  // const handleFacilityChange = (value) => {
  //     const updatedFacilities = tempFacilities.includes(value)
  //         ? tempFacilities.filter((facility) => facility !== value)
  //         : [...tempFacilities, value];
  //     setTempFacilities(updatedFacilities);
  // };

  const handlePriceChange = (value) => {
    setTempPriceRange(value);
  };

  const handleSortChange = (value) => {
    setTempSortBy(value);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setTempSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = debounce((value) => {
    setTempSearchTerm(value);
  }, 300);

  // star modal logic

  const showStarModal = () => {
    setIsStarVisible(true);
  };

  const closeStarModal = () => {
    setIsStarVisible(false);
  };

  const handleStarSelection = () => {
    onCategoryChange(tempCategories);
    setClearVisible(true);
    setStarApplied(true);
    closeStarModal();
  };

  // star modal logic

  // const showFacilityModal = () => {
  //     setIsFacilitiesVisible(true);

  // }

  //   const closeFacilityModal = () => {
  //     setIsFacilitiesVisible(false);
  //   };

  // const handleFacilitySelection = () => {
  //     onFacilityChange(tempFacilities);
  //     setClearVisible(true);
  //     setFacilitiesApplied(true);
  //     closeFacilityModal()
  // }

  // price modal logic

  const showPriceModal = () => {
    setIsPriceVisible(true);
  };

  const closePriceModal = () => {
    setIsPriceVisible(false);
  };

  const handlePriceSelection = () => {
    onPriceChange(tempPriceRange);
    setClearVisible(true);
    setPriceApplied(true);
    closePriceModal();
  };

  // price modal logic

  // sort modal logic

  // price modal logic

  const showSortModal = () => {
    setSortModalVisible(true);
  };

  const closeSortModal = () => {
    setSortModalVisible(false);
  };

  const handleSortSelection = () => {
    onSortChange(tempSortBy);
    setClearVisible(true);
    setSortApplied(true);
    closeSortModal();
  };

  // sort modal logic

  const [clearVisible, setClearVisible] = useState(false);
  const handleClearFilters = () => {
    setStarApplied(false);
    // setFacilitiesApplied(false)
    setPriceApplied(false);
    setSortApplied(false);
    onClearFilters();
  };

  return (
    <div className="filterPackageMobileBox">
      {!clearVisible ? (
        <div>
          <p
            className="d-flex fex-row gap-2 align-items-center"
            style={{ color: "gray" }}
          >
            <SlidersOutlined /> <span>Filter</span>
          </p>
        </div>
      ) : (
        <div>
          <p
            className="d-flex fex-row gap-2 align-items-center"
            onClick={handleClearFilters}
          >
            {" "}
            <span>Clear</span>
          </p>
        </div>
      )}

      <div className="selectFilterBoxMobile">
        {/* star Filter Box */}
        <div className="filterCitiesMobile" onClick={showStarModal}>
          <p
            style={{
              border: starApplied ? "1px solid #e73c34" : "1px solid gray",
              color: starApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Star Rating
          </p>
        </div>
        <Modal
          // title="Select Cities"
          centered
          maskClosable={false}
          open={isStarVisible}
          onOk={handleStarSelection}
          onCancel={closeStarModal}
          footer={[
            <Button key="back" onClick={closeStarModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleStarSelection}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="PackagetagFilters">
            <p className="">Star Rating</p>
            <Checkbox
              value="3"
              checked={tempCategories.includes(3)}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            >
              3 Stars
            </Checkbox>
            <Checkbox
              value="4"
              checked={tempCategories.includes(4)}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            >
              4 Stars
            </Checkbox>
            <Checkbox
              value="5"
              checked={tempCategories.includes(5)}
              onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            >
              5 Stars
            </Checkbox>
          </div>
        </Modal>

        {/* facilities filter box  */}

        {/* <div className="filterCitiesMobile" onClick={showFacilityModal} >
                    <p
                        style={{
                            border: facilitiesApplied ? "1px solid #e73c34" : "1px solid gray",
                            color: facilitiesApplied ? "#e73c34" : "gray",
                            cursor: "pointer"
                        }}
                    >Facilities</p>
                </div>
                <Modal
                    centered
                    maskClosable={false}
                    open={isFacilitiesVisible}
                    onOk={handleFacilitySelection}
                    onCancel={closeFacilityModal}
                    footer={[
                        <Button key="back" onClick={closeFacilityModal}>Cancel</Button>,
                        <Button key="submit" type="primary" onClick={handleFacilitySelection}>Apply Filter</Button>,
                    ]}
                >
                    <div className="scrollableContainer">
                        <div className="PackagetagFilters">
                            <p className="">Select Facilities</p>
                            {uniqueFacilities.map((facility) => (
                                facility !== undefined &&
                                <Checkbox
                                    key={facility}
                                    value={facility}
                                    checked={tempFacilities.includes(facility)}
                                    onChange={(e) => handleFacilityChange(e.target.value)}
                                >
                                    {facility}
                                </Checkbox>
                            ))}
                        </div>
                    </div>


                </Modal> */}

        {/* facilities filter box  */}

        {/* price filter box  */}

        <div className="filterCitiesMobile" onClick={showPriceModal}>
          <p
            style={{
              border: priceApplied ? "1px solid #e73c34" : "1px solid gray",
              color: priceApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Price Range
          </p>
        </div>
        <Modal
          // title="Select Cities"
          centered
          maskClosable={false}
          open={isPriceVisible}
          onOk={handlePriceSelection}
          onCancel={closePriceModal}
          footer={[
            <Button key="back" onClick={closePriceModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handlePriceSelection}>
              Apply Filter
            </Button>,
          ]}
        >
          <div className="holidayFilterSlider">
            <p className="">Select Price Range</p>
            <Slider
              range
              step={400}
              min={minPrice}
              max={maxPrice}
              value={tempPriceRange}
              onChange={handlePriceChange}
            />

            <div className="d-flex flex-row justify-content-between align-items-center ">
              <span style={{ fontWeight: "600", fontSize: "13px" }}>
                ₹ {tempPriceRange?.[0]}
              </span>
              <span style={{ fontWeight: "600", fontSize: "13px" }}>
                ₹ {tempPriceRange?.[1]}
              </span>
            </div>
          </div>
        </Modal>

        {/* price filter box  */}

        {/* sort filter box  */}

        {/* price filter box  */}

        <div className="filterCitiesMobile" onClick={showSortModal}>
          <p
            style={{
              border: sortApplied ? "1px solid #e73c34" : "1px solid gray",
              color: sortApplied ? "#e73c34" : "gray",
              cursor: "pointer",
            }}
          >
            Sort by price
          </p>
        </div>
        <Modal
          // title="Select Cities"
          centered
          maskClosable={false}
          open={sortModalVisible}
          onOk={handlePriceSelection}
          onCancel={closeSortModal}
          footer={[
            <Button key="back" onClick={closeSortModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSortSelection}>
              Apply Sorting
            </Button>,
          ]}
        >
          <div className="holidayFilterSlider">
            <p className="">Select Price Range</p>
            <Radio
              value="lowToHigh"
              checked={tempSortBy === "lowToHigh"}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              Low to High
            </Radio>
            <Radio
              value="highToLow"
              checked={tempSortBy === "highToLow"}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              High to Low
            </Radio>
          </div>
        </Modal>

        {/* sort filter box  */}
      </div>

      {/* <div onClick={() => openModal("sort")} style={{ padding: "10px", border: "1px solid black" }}>
                Sort by Price
            </div>
            <div onClick={() => openModal("search")} style={{ padding: "10px", border: "1px solid black" }}>
                Search by Name
            </div> */}

      {/* Sort Modal */}
      {/* <Modal
                title="Sort by Price"
                visible={visibleModal === "sort"}
                onOk={applyFilters}
                onCancel={closeModal}
            >
                <Radio
                    value="lowToHigh"
                    checked={tempSortBy === "lowToHigh"}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    Low to High
                </Radio>
                <Radio
                    value="highToLow"
                    checked={tempSortBy === "highToLow"}
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    High to Low
                </Radio>
            </Modal> */}

      {/* Search Modal */}
      {/* <Modal
                title="Search by Name"
                visible={visibleModal === "search"}
                onOk={applyFilters}
                onCancel={closeModal}
            >
                <Input
                    type="text"
                    value={tempSearchTerm}
                    onChange={handleSearchChange}
                />
            </Modal> */}
    </div>
  );
};

export default HotelMobileFilter;
