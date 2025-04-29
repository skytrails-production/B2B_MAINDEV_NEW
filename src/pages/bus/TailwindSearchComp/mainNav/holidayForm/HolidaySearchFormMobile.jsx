import React, { forwardRef, useState, useImperativeHandle } from "react";
import dayjs from "dayjs";
import axios from "axios";
import HolidayLocationMobile from "./HolidayLocationMobile";
import HolidayDateRangeMobile from "./HolidayDateRangeMobile";
import HolidayGuestMobile from "./HolidayGuestMobile";
import { useNavigate } from "react-router-dom";

const HolidaySearchFormMobile = forwardRef((props, ref) => {

    const [fieldNameShow, setFieldNameShow] = useState("");
    const [travellers, setTravellers] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(null);
    const [checkinDate, setCheckinDate] = useState(null);
    const [checkoutDate, setCheckoutDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    console.log(travellers, "travellers")

    const navigate = useNavigate()

    const handleRoomDataChange = (roomsData) => {
        setTravellers(roomsData);
    };


    const handleLocationSelect = (location) => {
        setSelectedFrom(location);
    };




    const totalGuests = travellers.adults + travellers.childs;


    const handleDateChange = (dates) => {
        setCheckinDate(dates.startDate);
        setCheckoutDate(dates.endDate);
    };




    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {

            if (selectedFrom) {
                navigate(`/holidaypackages/cities/${selectedFrom}`);
            }

        }
    }));

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
                        <span>{selectedFrom || "Location"}</span>

                    </button>
                ) : (
                    <HolidayLocationMobile
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
                    <HolidayDateRangeMobile
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
                    <HolidayGuestMobile onRoomDataChange={handleRoomDataChange} />
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

export default HolidaySearchFormMobile;
