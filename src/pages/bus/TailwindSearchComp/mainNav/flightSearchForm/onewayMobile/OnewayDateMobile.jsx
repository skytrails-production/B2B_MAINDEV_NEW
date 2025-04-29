import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "../../../heroSection/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../../heroSection/DatePickerCustomDay";
// import DatePickerCustomHeaderTwoMonth from "../../heroSection/DatePickerCustomHeaderTwoMonth";
// import DatePickerCustomDay from "../../heroSection/DatePickerCustomDay";
const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : null;
};


const OnewayDateMobile = ({
    className = "",
    onDateChange,
}) => {

    const today = new Date();

    const [startDate, setStartDate] = useState(today);

    const onChangeDate = (date) => {
        setStartDate(date);
        if (date) {
            console.log({
                checkin: formatDate(date),
            });
        }
    };

    useEffect(() => {
        if (onDateChange) {
            onDateChange({ startDate });
        }
    }, [startDate, onDateChange]);



    return (
        <div>
            <div className="p-5">
                <span className="block font-semibold text-xl sm:text-2xl">
                    {`When's your trip?`}
                </span>
            </div>
            <div className={`relative flex-shrink-0 flex justify-center z-10 py-5 ${className}`}>
                <DatePicker
                    selected={startDate}
                    onChange={onChangeDate}
                    startDate={startDate}
                    monthsShown={2}
                    inline
                    minDate={today}
                    renderCustomHeader={(p) => (
                        <DatePickerCustomHeaderTwoMonth {...p} />
                    )}
                    renderDayContents={(day, date) => (
                        <DatePickerCustomDay dayOfMonth={day} date={date} />
                    )}
                />
            </div>
        </div>
    );
};


export default OnewayDateMobile
