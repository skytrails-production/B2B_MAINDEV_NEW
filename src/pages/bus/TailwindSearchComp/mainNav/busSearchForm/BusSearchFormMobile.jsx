import React, { forwardRef, useState, useImperativeHandle } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BusLocationMobile from "./BusLocationMobile";
import BusDateRangeMobile from "./BusDateRangeMobile";

const BusSearchFormMobile = forwardRef((props, ref) => {

    const [fieldNameShow, setFieldNameShow] = useState("");


    const [fromCity, setFromCity] = useState(null);
    const [toCity, setToCity] = useState(null);
    const [departDate, setDepartDate] = useState(null);


    const navigate = useNavigate()


    const handleFromSelect = (location) => {
        setFromCity(location);
    };
    const handleToSelect = (location) => {
        setToCity(location);
    };


    const handleDateChange = (dates) => {
        setDepartDate(dates.startDate);
    };



    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            const payload = {
                // EndUserIp: reducerState?.ip?.ipData,
                // TokenId: reducerState?.ip?.tokenData,
                DateOfJourney: dayjs(departDate).format("YYYY/MM/DD"),
                DestinationId: fromCity.CityId,
                OriginId: toCity.CityId,
            };

            console.log(payload, "clicked")
            // sessionStorage.setItem(
            //     "busOnewayData",
            //     JSON.stringify([
            //         {
            //             CityId: selectedFrom.CityId,
            //             CityName: selectedFrom.CityName,
            //             __v: selectedFrom.__v,
            //             _id: selectedFrom._id,
            //         },
            //         {
            //             CityId: selectedTo.CityId,
            //             CityName: selectedTo.CityName,
            //             __v: selectedTo.__v,
            //             _id: selectedTo._id,
            //         },
            //         newDepartDate,
            //     ])
            // );

            // navigate("/busresult");
            // dispatch(busSearchAction(payload));

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
                        <span>{fromCity?.CityName || "Location"}</span>

                    </button>
                ) : (
                    <BusLocationMobile
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
                        <span>{toCity?.CityName || "Location"}</span>

                    </button>
                ) : (
                    <BusLocationMobile
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
                    <BusDateRangeMobile
                        onDateChange={handleDateChange}
                    />
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

            </div>
        </div>
    );
});

export default BusSearchFormMobile;
