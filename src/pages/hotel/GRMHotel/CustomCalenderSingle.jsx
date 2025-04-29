import React, { useState } from "react";
import { Modal, Button } from "antd";
import "antd/dist/reset.css"; // Ensure you have the Ant Design CSS loaded
import "./customCalender.scss"

const CustomCalenderSingle = ({ visible, onClose, onSelectDate, startDate, }) => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const currentDate = new Date();

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

    const renderMonth = (month) => {
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
            monthDays.push(<div key={`empty-${i}`} className="day" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(month.getFullYear(), month.getMonth(), i);
            const isSelected =
                selectedDate && selectedDate.toDateString() === dayDate.toDateString();
            const isToday = dayDate.toDateString() === currentDate.toDateString();
            const isPast =
                dayDate < currentDate && dayDate.toDateString() !== currentDate.toDateString();

            monthDays.push(
                <div
                    key={`day-${i}`}
                    className={[
                        "day",
                        (isSelected) && "selectedDay",

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
                            isSelected
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
            <div key={month.getMonth()} className="monthContainer">


                <div className="monthLabel">
                    {month.toLocaleString('default', { month: 'long' })}{' '}
                    {month.getFullYear()}
                </div>
                <div className="daysContainer">{monthDays}</div>
            </div>
        );
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        onSelectDate(date);
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
                    {generateMonths().map(renderMonth)}
                </div>
                <div className="calenderButton">
                    <div className="dateDisplay">
                        <span>{startDate}</span>
                    </div>
                    <Button onClick={onClose} >Select</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CustomCalenderSingle;
