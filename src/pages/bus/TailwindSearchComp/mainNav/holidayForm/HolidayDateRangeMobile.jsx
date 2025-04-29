import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "../../heroSection/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../heroSection/DatePickerCustomDay";


// Helper function to format dates as "YYYY-MM-DD"
const formatDate = (date) => {
    return date ? date.toISOString().split("T")[0] : null;
};


const HolidayDateRangeMobile = ({
    className = "",
    onDateChange,
}) => {
    const today = new Date();
    const startDateValue = new Date(today);
    const endDateValue = new Date(today);

    startDateValue.setDate(today.getDate() + 20); // 20 days ahead
    endDateValue.setDate(today.getDate() + 22);   // 22 days ahead

    const [startDate, setStartDate] = useState(startDateValue);
    const [endDate, setEndDate] = useState(endDateValue);


    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
        if (start && end) {
            console.log({
                checkin: formatDate(start),
                checkout: formatDate(end),
            });
        }
    };

    useEffect(() => {
        if (onDateChange) {
            onDateChange({ startDate, endDate });
        }
    }, [startDate, endDate, onDateChange]);

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
                    endDate={endDate}
                    selectsRange
                    monthsShown={2}
                    showPopperArrow={false}
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


export default HolidayDateRangeMobile
