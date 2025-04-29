import React, { useEffect, useState } from "react";
import NcInputNumber from "../../heroSection/NcInputNumber";
import { TrashIcon } from "@heroicons/react/24/outline";


const HolidayGuestMobile = ({ className = "", onRoomDataChange, }) => {


    const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
    const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);

    const handleChangeData = (value, type) => {
        if (type === "guestAdults") {
            setGuestAdultsInputValue(value);
        }
        if (type === "guestChildren") {
            setGuestChildrenInputValue(value);
        }
    };


    useEffect(() => {
        const payload = {
            adults: guestAdultsInputValue,
            child: guestChildrenInputValue,
        };
        onRoomDataChange(payload);
    }, [guestAdultsInputValue, guestChildrenInputValue]);

    const totalGuests = guestChildrenInputValue + guestAdultsInputValue;

    return (
        <div className={`flex flex-col relative p-5 ${className}`}>
            <span className="mb-5 block font-semibold text-xl sm:text-2xl">
                {`Who's coming?`}
            </span>
            <NcInputNumber
                className="w-full"
                defaultValue={guestAdultsInputValue}
                onChange={(value) => handleChangeData(value, "guestAdults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
            />
            <NcInputNumber
                className="w-full mt-6"
                defaultValue={guestChildrenInputValue}
                onChange={(value) => handleChangeData(value, "guestChildren")}
                max={4}
                label="Children"
                desc="Ages 2–12"
            />
            {/* <button
                type="button"
                className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleAddRoom}
            >
                Add Room
            </button> */}

            {/* <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => close()}
                >
                    Okay
                </button>
            </div> */}

        </div>
    );
};

export default HolidayGuestMobile;
