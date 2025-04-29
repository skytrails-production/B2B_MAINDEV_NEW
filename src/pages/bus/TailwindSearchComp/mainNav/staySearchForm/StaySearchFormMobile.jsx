import React, { forwardRef, useState, useImperativeHandle } from "react";
import GuestsInputMobile from "./GuestInputMobile";
import StayDateRangeMobile from "./StayDateRangeMobile";
import StayLocationMobile from "./StayLocationMobile";
import dayjs from "dayjs";
import axios from "axios";

const StaySearchForm = forwardRef((props, ref) => {
    //
    const [fieldNameShow, setFieldNameShow] = useState("");
    //
    const [rooms, setRooms] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const totalGuests = rooms.reduce(
        (acc, room) => acc + room.adults + room.children,
        0
    );

    const handleRoomDataChange = (roomsData) => {
        setRooms(roomsData);
    };
    const handleLocationSelect = (location) => {
        setSelectedFrom(location);
        console.log("Selected Location:", location);
    };

    const handleDateChange = (dates) => {
        setCheckinDate(dates.startDate);
        setCheckoutDate(dates.endDate);
    };
    // Function to handle form submission
    // const handleSubmit = async () => {
    //     setIsLoading(true);

    //     const payload = selectedFrom?.hotelName
    //         ? {

    //             rooms: rooms,
    //             rates: "concise",
    //             hotel_codes: [`${selectedFrom.hotelCode}`],
    //             currency: "INR",
    //             client_nationality: "IN",
    //             checkin: dayjs(checkinDate).format("YYYY-MM-DD"),
    //             checkout: dayjs(checkoutDate).format("YYYY-MM-DD"),
    //             cutoff_time: 30000,
    //             version: "2.0",
    //         }
    //         : {
    //             "rooms": rooms,
    //             "rates": "concise",
    //             "cityCode": selectedFrom?.grnCityCode,
    //             "currency": "INR",
    //             "client_nationality": "IN",
    //             "checkin": dayjs(checkinDate).format("YYYY-MM-DD"),
    //             "checkout": dayjs(checkoutDate).format("YYYY-MM-DD"),
    //             "cutoff_time": 30000,
    //             "version": "2.0",
    //             "tboCityCode": selectedFrom?.grnCityCode,
    //             "TokenId": "4eea0ad9-3b03-4e8a-baca-eb6614de52a5",
    //             "EndUserIp": "223.178.210.87"

    //         };

    //     try {
    //         const response = await axios.post(
    //             "https://back.theskytrails.com/skyTrails/tboandgrn/searchresults",
    //             payload
    //         );
    //         console.log("API Response:", response.data);
    //     } catch (error) {
    //         console.error("API Error:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            setIsLoading(true);
            const payload = selectedFrom?.hotelName
                ? {
                    rooms: rooms,
                    rates: "concise",
                    hotel_codes: [`${selectedFrom.hotelCode}`],
                    currency: "INR",
                    client_nationality: "IN",
                    checkin: dayjs(checkinDate).format("YYYY-MM-DD"),
                    checkout: dayjs(checkoutDate).format("YYYY-MM-DD"),
                    cutoff_time: 30000,
                    version: "2.0",
                }
                : {
                    rooms: rooms,
                    rates: "concise",
                    cityCode: selectedFrom?.grnCityCode,
                    currency: "INR",
                    client_nationality: "IN",
                    checkin: dayjs(checkinDate).format("YYYY-MM-DD"),
                    checkout: dayjs(checkoutDate).format("YYYY-MM-DD"),
                    cutoff_time: 30000,
                    version: "2.0",
                    tboCityCode: selectedFrom?.grnCityCode,
                    TokenId: "4eea0ad9-3b03-4e8a-baca-eb6614de52a5",
                    EndUserIp: "223.178.210.87"
                };

            try {
                const response = await axios.post(
                    "https://back.theskytrails.com/skyTrails/tboandgrn/searchresults",
                    payload
                );
                console.log("API Response:", response.data);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }));


    console.log(selectedFrom, "selectedFrom")


    const renderInputLocation = () => {
        const isActive = fieldNameShow === "location";
        return (
            <div
                className={`w-full bg-white ${isActive
                    ? "rounded-2xl shadow-lg"
                    : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
                    }`}
            >
                {!isActive ? (
                    <button
                        className="w-full flex justify-between text-sm font-medium p-4"
                        onClick={() => setFieldNameShow("location")}
                    >
                        <span className="text-neutral-400">Where</span>
                        {/* <span>{locationInputTo || "Location"}</span> */}
                        {
                            selectedFrom ?
                                selectedFrom?.type == "city" ?
                                    <span className="block font-medium text-neutral-700 ">
                                        {selectedFrom?.cityName} ({selectedFrom?.grnCountryName !== null ? selectedFrom?.grnCountryName : selectedFrom?.tboCountryName}
                                        )
                                    </span>
                                    :
                                    <span className="block font-medium text-neutral-700 ">
                                        {selectedFrom?.hotelName} ({selectedFrom?.countryName})
                                    </span>
                                : "Location"}
                    </button>
                ) : (
                    <StayLocationMobile
                        onLocationSelect={handleLocationSelect}
                    />

                )}
            </div>
        );
    };

    const renderInputDates = () => {
        const isActive = fieldNameShow === "dates";

        return (
            <div
                className={`w-full bg-white overflow-hidden ${isActive
                    ? "rounded-2xl shadow-lg"
                    : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
                    }`}
            >
                {!isActive ? (
                    <button
                        className="w-full flex justify-between text-sm font-medium p-4"
                        onClick={() => setFieldNameShow("dates")}
                    >
                        <span className="text-neutral-400">When</span>
                        <span>
                            {checkinDate
                                ? `${dayjs(checkinDate).format('DD, MMM')} - ${dayjs(checkoutDate).format('DD, MMM')}`
                                : "Add date"}
                        </span>
                    </button>
                ) : (
                    <StayDateRangeMobile
                        onDateChange={handleDateChange}
                    />
                )}
            </div>
        );
    };

    const renderInputGuests = () => {
        const isActive = fieldNameShow === "guests";

        return (
            <div
                className={`w-full bg-white overflow-hidden ${isActive
                    ? "rounded-2xl shadow-lg"
                    : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
                    }`}
            >
                {!isActive ? (
                    <button
                        className="w-full flex justify-between text-sm font-medium p-4"
                        onClick={() => setFieldNameShow("guests")}
                    >
                        <span className="text-neutral-400">Who</span>
                        <span>{totalGuests || "Add guests"}</span>
                    </button>
                ) : (
                    <GuestsInputMobile onRoomDataChange={handleRoomDataChange} />
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="w-full space-y-5">
                {renderInputLocation()}
                {renderInputDates()}
                {renderInputGuests()}
            </div>
        </div>
    );
});

export default StaySearchForm;
