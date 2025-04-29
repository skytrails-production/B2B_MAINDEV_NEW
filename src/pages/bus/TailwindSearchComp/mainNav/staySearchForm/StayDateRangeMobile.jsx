import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import DatePickerCustomHeaderTwoMonth from "../../heroSection/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "../../heroSection/DatePickerCustomDay";

const StayDateRangeMobile = ({
    className = "",
    onDateChange,
}) => {
    const today = new Date();
    const twoDaysLater = new Date(today);
    twoDaysLater.setDate(today.getDate() + 2);

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(twoDaysLater);

    const onChangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
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


export default StayDateRangeMobile
