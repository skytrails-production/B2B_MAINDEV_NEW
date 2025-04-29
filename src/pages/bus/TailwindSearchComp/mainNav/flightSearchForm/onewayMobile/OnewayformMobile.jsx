import React, { forwardRef, useState, useImperativeHandle } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FLightFromMobile from "../FLightFromMobile";
import FLightToMobile from "../FLightToMobile";
import OnewayDateMobile from "./OnewayDateMobile";
import GuestFlightSmall from "../GuestFlightSmall";

const OnewayformMobile = forwardRef((props, ref) => {

    const [fieldNameShow, setFieldNameShow] = useState("");
    const [fromCity, setFromCity] = useState(null);
    const [toCity, setToCity] = useState(null);
    const [departDate, setDepartDate] = useState(null);
    const [guest, setGuest] = useState(null)


    const navigate = useNavigate()


    const handleFromSelect = (location) => {
        setFromCity(location);

        setFieldNameShow("")
    };
    const handleToSelect = (location) => {
        setToCity(location);
        setFieldNameShow("")
    };

    console.log(toCity, "to city")


    const handleDateChange = (dates) => {
        setDepartDate(dates.startDate);
        // setFieldNameShow("")
    };


    const handleGuestDetails = (roomsData) => {
        setGuest(roomsData);
        // setFieldNameShow("")
    };



    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {


            console.log(fromCity, "from city")
            console.log(toCity, "to city")
            console.log(departDate, "depart date ")
            console.log(guest, "guest guest ")


        }
    }));

    const renderFromLocation = () => {
        const isActive = fieldNameShow === "locationOne";
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
                        onClick={() => setFieldNameShow("locationOne")}
                    >
                        <span className="text-neutral-400">Where</span>
                        <span>{fromCity?.name || "Location"}</span>

                    </button>
                ) : (
                    <FLightFromMobile
                        onLocationSelect={handleFromSelect}
                    />

                )}
            </div>
        );
    };




    const renderToLocation = () => {
        const isActive = fieldNameShow === "locationTwo";
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
                        onClick={() => setFieldNameShow("locationTwo")}
                    >
                        <span className="text-neutral-400">Where</span>
                        <span>{toCity?.name || "Location"}</span>

                    </button>
                ) : (
                    <FLightToMobile
                        onLocationSelect={handleToSelect}
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
                            {departDate
                                ? `${dayjs(departDate).format('DD, MMM')}`
                                : "Add date"}
                        </span>
                    </button>
                ) : (
                    <OnewayDateMobile
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
                        <span>{guest?.adults + guest?.children + guest?.infant || "Add guests"}</span>
                    </button>
                ) : (
                    <GuestFlightSmall onGuestDataChange={handleGuestDetails} />
                )}
            </div>
        );
    };


    return (
        <div>
            <div className="w-full space-y-5">
                {renderFromLocation()}
                {renderToLocation()}
                {renderInputDates()}
                {renderInputGuests()}

            </div>
        </div>
    );
});

export default OnewayformMobile;
