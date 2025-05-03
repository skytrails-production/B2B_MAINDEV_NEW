import React, { useState } from "react";
import { Modal, Button } from "antd";
import "antd/dist/reset.css"; // Ensure you have the Ant Design CSS loaded
import "./customCalender.scss"

const CustomCalender = ({ visible, onClose, onSelectDateRange, startDate, endDate }) => {

    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const currentDate = new Date(); // Current date

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const generateMonths = () => {
        const months = [];
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        for (let i = 0; i < 13; i++) {
            const month = new Date(currentYear, currentMonth + i, 1);
            months.push(month);
        }
        return months;
    };

    const isDateInRange = (dayDate) => {
        if (selectedStartDate && selectedEndDate) {
            return dayDate >= selectedStartDate && dayDate <= selectedEndDate;
        }
        return false;
    };

    const handleDateSelect = (date) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(date);
            setSelectedEndDate(null);
            onSelectDateRange(date, null); // Pass start date and null for end date
        } else if (selectedStartDate && !selectedEndDate) {
            if (date < selectedStartDate) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(date);
                onSelectDateRange(date, selectedStartDate); // Swap dates if end date is earlier
            } else {
                setSelectedEndDate(date);
                onSelectDateRange(selectedStartDate, date); // Pass both dates
            }
        }
    };

    const renderMonth = (month, index) => {
        const monthDays = [];
        const daysInMonth = new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0
        ).getDate();
        const firstDayIndex = new Date(
            month.getFullYear(),
            month.getMonth(),
            1
        ).getDay();

        for (let i = 0; i < firstDayIndex; i++) {
            monthDays.push(<div key={`empty-${index}-${i}`} className="day" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(month.getFullYear(), month.getMonth(), i);
            const isSelectedStart =
                selectedStartDate &&
                selectedStartDate.toDateString() === dayDate.toDateString();
            const isSelectedEnd =
                selectedEndDate &&
                selectedEndDate.toDateString() === dayDate.toDateString();
            const isInRange = isDateInRange(dayDate);
            const isPast =
                dayDate < currentDate &&
                dayDate.toDateString() !== currentDate.toDateString();

            monthDays.push(
                <div
                    key={`day-${index}-${i}`}
                    className={[
                        "day",
                        (isSelectedStart || isSelectedEnd) && "selectedDay",
                        isInRange && "inRangeDay",
                        isPast && "disabledDay",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    onClick={() => !isPast && handleDateSelect(dayDate)}
                    style={{ pointerEvents: isPast ? "none" : "auto" }}
                >
                    <span
                        className={[
                            "dayText",
                            isSelectedStart || isSelectedEnd || isInRange
                                ? "selectedDayText"
                                : "",
                            isPast ? "disabledDayText" : "",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >
                        {i}
                    </span>
                </div>
            );
        }

        return (
            <div key={`month-${index}`} className="monthContainer">
                <div className="monthLabel">
                    {month.toLocaleString("default", { month: "long" })}{" "}
                    {month.getFullYear()}
                </div>
                <div className="daysContainer">{monthDays}</div>
            </div>
        );
    };




    return (
        <div className="">
            <Modal className="customCalenderModal" open={visible} onCancel={onClose} footer={null}>
                <div className="weekdaysContainer">
                    {weekdays.map((day, index) => (
                        <div key={index} className="weekday">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="scrollableContainer">
                    {generateMonths().map((month, index) => renderMonth(month, index))}
                </div>
                <div className="calenderButton">
                    <div className="dateDisplay">
                        <span>{startDate}</span>
                        <span>{endDate == "Invalid Date" ? "" : endDate}</span>
                    </div>
                    <Button onClick={onClose} disabled={endDate == "Invalid Date"}>Select</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomCalender;
