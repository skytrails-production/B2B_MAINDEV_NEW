
import React, { useEffect, useState, useMemo } from "react";
import { Modal, Checkbox, Slider, Input, Radio, Button } from "antd";
import { SlidersOutlined } from '@ant-design/icons';
import { before6Am, sixamto12pm, twelvePmto6pm, after6Pm, ac, nonac, sleeper, seater } from "./busFilterIcons"

const BusFilterSmall = ({ onFilter, busData }) => {

    const [busType, setBusType] = useState([]);
    const [departureTime, setDepartureTime] = useState([]);
    const [arrivalTime, setArrivalTime] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortPrice, setSortPrice] = useState(null);
    const [travelName, setTravelName] = useState([]);
    const [searchTravel, setSearchTravel] = useState("");
    const [boardingLocation, setBoardingLocation] = useState([]);
    const [searchBoarding, setSearchBoarding] = useState("");
    const [droppingLocation, setDroppingLocation] = useState([]);
    const [searchDropping, setSearchDropping] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [debouncedSearchTravel, setDebouncedSearchTravel] = useState(searchTravel);

    const [busTypeVisible, setBusTypeVisible] = useState(false);
    const [departureTimeVisible, setDepartureTimeVisible] = useState(false);
    const [arrivalTimeVisible, setArrivalTimeVisible] = useState(false);
    const [priceRangeVisible, setPriceRangeVisible] = useState(false);
    const [busNameVisible, setBusNameVisible] = useState(false);
    const [busTypeApplied, setBusTypeApplied] = useState(false);
    const [departureTimeApplied, setDepartureTimeApplied] = useState(false);
    const [arrivalTimeApplied, setArrivalTimeApplied] = useState(false);
    const [priceRangeApplied, setPriceRangeApplied] = useState(false);
    const [busNameApplied, setBusNameApplied] = useState(false);



    const calculatePriceRange = () => {
        const min = Math.min(
            ...busData.map((bus) => bus.BusPrice.PublishedPriceRoundedOff)
        );
        const max = Math.max(
            ...busData.map((bus) => bus.BusPrice.PublishedPriceRoundedOff)
        );
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);
    };

    useEffect(() => {
        calculatePriceRange();
    }, [])


    // bus type modal

    const showBusTypeModal = () => {
        setBusTypeVisible(true);

    }
    const closeBusTypeModal = () => {
        setBusTypeVisible(false)
    }

    // departure time modal

    const showDepartureTimeModal = () => {
        setDepartureTimeVisible(true);

    }
    const closeDepartureTimeModal = () => {
        setDepartureTimeVisible(false)
    }
    // arrival time modal

    const showArrivalTimeModal = () => {
        setArrivalTimeVisible(true);

    }
    const closeArrivalTimeModal = () => {
        setArrivalTimeVisible(false)
    }

    // arrival time modal

    const showPriceRangeModal = () => {
        setPriceRangeVisible(true);

    }
    const closePriceRangeModal = () => {
        setPriceRangeVisible(false)
    }


    // bus name modal

    const showBusNameModal = () => {
        setBusNameVisible(true);

    }
    const closeBusNameModal = () => {
        setBusNameVisible(false)
    }


    const handleBusTypeChange = (e) => {
        const value = e.target.value;
        setBusType((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
        applyFilters({
            busType: e.target.checked
                ? [...busType, value]
                : busType.filter((item) => item !== value),
        });
    };

    const handleDepartureTimeChange = (e) => {
        const value = e.target.value;
        setDepartureTime((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
        applyFilters({
            departureTime: e.target.checked
                ? [...departureTime, value]
                : departureTime.filter((item) => item !== value),
        });
    };

    const handleArrivalTimeChange = (e) => {

        const value = e.target.value;
        setArrivalTime((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
        applyFilters({
            arrivalTime: e.target.checked
                ? [...arrivalTime, value]
                : arrivalTime.filter((item) => item !== value),
        });
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
        applyFilters({ priceRange: value });
    };


    const handleTravelNameChange = (e) => {
        const value = e.target.value;
        setTravelName((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
        applyFilters({
            travelName: e.target.checked
                ? [...travelName, value]
                : travelName.filter((item) => item !== value),
        });
    };

    const handleSearchTravelChange = (e) => {
        const value = e.target.value;
        setSearchTravel(value);
        applyFilters({ searchTravel: value });


    };


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTravel(searchTravel);
        }, 200);

        // Clean up the timeout if searchTravel changes before the 200ms
        return () => {
            clearTimeout(handler);
        };
    }, [searchTravel]);

    const uniqueTravelNames = useMemo(
        () =>
            [...new Set(busData?.map((bus) => bus.TravelName))]?.filter((name) =>
                name?.toLowerCase()?.includes(debouncedSearchTravel?.toLowerCase())
            ),
        [busData, debouncedSearchTravel]
    );



    const [clearVisible, setClearVisible] = useState(false);


    const applyFilters = (newFilters) => {
        const filters = {
            busType,
            // departureTime,
            // arrivalTime,
            // priceRange,
            // sortPrice,
            // travelName,
            // searchTravel,
            // boardingLocation,
            // searchBoarding,
            // droppingLocation,
            // searchDropping,
            ...newFilters,
        };
        onFilter(filters);
    };
    return (
        <div>
            <div className="filterPackageMobileBox">

                {
                    !clearVisible ?
                        (
                            <div>
                                <p className="gap-2 d-flex fex-row align-items-center" style={{ color: "gray" }}><SlidersOutlined /> <span>Filter</span></p>
                            </div>
                        ) : (
                            <div>
                                <p className="gap-2 d-flex fex-row align-items-center"> <span>Clear</span></p>
                            </div>
                        )
                }

                <div className="selectFilterBoxMobile">
                    {/* bus type Filter Box */}
                    <div
                        className="filterCitiesMobile"
                        onClick={showBusTypeModal}
                    >
                        <p
                            style={{
                                border: busTypeApplied ? "1px solid #e73c34" : "1px solid gray",
                                color: busTypeApplied ? "#e73c34" : "gray",
                                cursor: "pointer"
                            }}
                        >Bus Type</p>
                    </div>
                    <Modal
                        // title="Select Cities"
                        centered
                        maskClosable={false}
                        open={busTypeVisible}
                        // onOk={handleStarSelection}
                        onCancel={closeBusTypeModal}
                        footer={[
                            <Button key="back" onClick={closeBusTypeModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={closeBusTypeModal}>Apply Filter</Button>,
                        ]}
                    >
                        <div className="busDepartureMain" style={{ background: "#fff" }}>
                            <p className="">By Bus Type</p>
                            <div>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={busType.includes("A/C")}
                                            onChange={handleBusTypeChange}
                                            value="A/C"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {ac}
                                            </span>
                                            <span>A/C</span>
                                        </div>
                                    </div>
                                </label>

                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={busType.includes("Non A/C")}
                                            onChange={handleBusTypeChange}
                                            value="Non A/C"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {nonac}
                                            </span>
                                            <span> Non A/C</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={busType.includes("Sleeper")}
                                            onChange={handleBusTypeChange}
                                            value="Sleeper"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {sleeper}
                                            </span>
                                            <span>Sleeper</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={busType.includes("Seater")}
                                            onChange={handleBusTypeChange}
                                            value="Seater"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {seater}
                                            </span>
                                            <span> Seater</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </Modal>

                    {/* departure time filter  */}
                    <div
                        className="filterCitiesMobile"
                        onClick={showDepartureTimeModal}
                    >
                        <p
                            style={{
                                border: departureTimeApplied ? "1px solid #e73c34" : "1px solid gray",
                                color: departureTimeApplied ? "#e73c34" : "gray",
                                cursor: "pointer"
                            }}
                        >Departure Time</p>
                    </div>
                    <Modal
                        // title="Select Cities"
                        centered
                        maskClosable={false}
                        open={departureTimeVisible}
                        // onOk={handleStarSelection}
                        onCancel={closeDepartureTimeModal}
                        footer={[
                            <Button key="back" onClick={closeDepartureTimeModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={closeBusTypeModal}>Apply Filter</Button>,
                        ]}
                    >
                        <div className="busDepartureMain" style={{ background: "#fff" }}>
                            <p className="">Departure Time</p>
                            <div>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={departureTime.includes("before6am")}
                                            onChange={handleDepartureTimeChange}
                                            value="before6am"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {before6Am}
                                            </span>
                                            <span>Before 6 AM</span>
                                        </div>
                                    </div>
                                </label>

                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={departureTime.includes("6amTo12pm")}
                                            onChange={handleDepartureTimeChange}
                                            value="6amTo12pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {sixamto12pm}
                                            </span>
                                            <span> 6 AM to 12 PM</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={departureTime.includes("12pmTo6pm")}
                                            onChange={handleDepartureTimeChange}
                                            value="12pmTo6pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {twelvePmto6pm}
                                            </span>
                                            <span>12 PM to 6 PM</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={departureTime.includes("after6pm")}
                                            onChange={handleDepartureTimeChange}
                                            value="after6pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {after6Pm}
                                            </span>
                                            <span> After 6 PM</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </Modal>

                    {/* arrival time filter  */}
                    <div
                        className="filterCitiesMobile"
                        onClick={showArrivalTimeModal}
                    >
                        <p
                            style={{
                                border: arrivalTimeApplied ? "1px solid #e73c34" : "1px solid gray",
                                color: arrivalTimeApplied ? "#e73c34" : "gray",
                                cursor: "pointer"
                            }}
                        >Arrival Time</p>
                    </div>
                    <Modal
                        // title="Select Cities"
                        centered
                        maskClosable={false}
                        open={arrivalTimeVisible}
                        // onOk={handleStarSelection}
                        onCancel={closeArrivalTimeModal}
                        footer={[
                            <Button key="back" onClick={closeArrivalTimeModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={closeArrivalTimeModal}>Apply Filter</Button>,
                        ]}
                    >


                        <div className="busDepartureMain" style={{ background: "#fff" }}>
                            <p className="">Arrival Time</p>
                            <div>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={arrivalTime.includes("before6am")}
                                            onChange={handleArrivalTimeChange}
                                            value="before6am"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {before6Am}
                                            </span>
                                            <span>Before 6 AM</span>
                                        </div>
                                    </div>
                                </label>

                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={arrivalTime.includes("6amTo12pm")}
                                            onChange={handleArrivalTimeChange}
                                            value="6amTo12pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {sixamto12pm}
                                            </span>
                                            <span> 6 AM to 12 PM</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={arrivalTime.includes("12pmTo6pm")}
                                            onChange={handleArrivalTimeChange}
                                            value="12pmTo6pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {twelvePmto6pm}
                                            </span>
                                            <span>12 PM to 6 PM</span>
                                        </div>
                                    </div>
                                </label>
                                <label className="sidebar-label-container ps-0">
                                    <div className="svgBOx">
                                        <input
                                            type="checkbox"
                                            checked={arrivalTime.includes("after6pm")}
                                            onChange={handleArrivalTimeChange}
                                            value="after6pm"
                                        />
                                        <div>
                                            <span className="checkedSVG pe-2">
                                                {after6Pm}
                                            </span>
                                            <span> After 6 PM</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </Modal>

                    {/* price range filter  */}
                    <div
                        className="filterCitiesMobile"
                        onClick={showPriceRangeModal}
                    >
                        <p
                            style={{
                                border: priceRangeApplied ? "1px solid #e73c34" : "1px solid gray",
                                color: priceRangeApplied ? "#e73c34" : "gray",
                                cursor: "pointer"
                            }}
                        >Price Range</p>
                    </div>
                    <Modal
                        // title="Select Cities"
                        centered
                        maskClosable={false}
                        open={priceRangeVisible}
                        // onOk={handleStarSelection}
                        onCancel={closePriceRangeModal}
                        footer={[
                            <Button key="back" onClick={closePriceRangeModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={closePriceRangeModal}>Apply Filter</Button>,
                        ]}
                    >
                        <div className="holidayFilterSlider" >
                            <p>Filter By Price</p>
                            <Slider
                                range
                                defaultValue={[minPrice, maxPrice]}
                                min={minPrice}
                                max={maxPrice}
                                onChange={handlePriceChange}
                            />

                            <div className="flex-row d-flex justify-content-between align-items-center ">
                                <span style={{ fontWeight: "600", fontSize: "13px" }}>₹ {priceRange?.[0]}</span>
                                <span style={{ fontWeight: "600", fontSize: "13px" }}>₹ {priceRange?.[1]}</span>
                            </div>
                        </div>
                    </Modal>


                    {/* bus name filter  */}
                    <div
                        className="filterCitiesMobile"
                        onClick={showBusNameModal}
                    >
                        <p
                            style={{
                                border: busNameApplied ? "1px solid #e73c34" : "1px solid gray",
                                color: busNameApplied ? "#e73c34" : "gray",
                                cursor: "pointer"
                            }}
                        >Bus Name</p>
                    </div>
                    <Modal
                        // title="Select Cities"
                        centered
                        maskClosable={false}
                        open={busNameVisible}
                        // onOk={handleStarSelection}
                        onCancel={closeBusNameModal}
                        footer={[
                            <Button key="back" onClick={closeBusNameModal}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={closeBusNameModal}>Apply Filter</Button>,
                        ]}
                    >
                        <div className="PackagetagFilters" style={{ background: "#fff" }}>
                            <p className="">Bus Name</p>
                            <div className="bustravelNameBox">
                                <Input
                                    placeholder="Search Travel Name"
                                    value={searchTravel}
                                    onChange={handleSearchTravelChange}
                                />
                                <div>
                                    {uniqueTravelNames.map((name) => (
                                        <Checkbox key={name} checked={travelName.includes(name)} onChange={handleTravelNameChange} value={name}>
                                            {name}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default BusFilterSmall
