import React, { useState } from 'react'
import "../styles/main.css";
import "../styles/calendar.css"; // Import the calendar CSS file


const Calendar: React.FC = () => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthsOfYear = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December", 
    ]; 
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    }

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    }

    return (
        <div className="calendar-app">
            <div className="calendar">
                <h1 className="heading">Calendar</h1>
                <div className="navigate-date">
                    <h2 className="Month">May</h2>
                    <h2 className="Year">2024</h2>
                    <div className="buttons">
                        <i className="bx bx-chevron-left" onClick={prevMonth}></i>
                        <i className="bx bx-chevron-right" onClick={nextMonth}></i>
                    </div>
                </div>
                <div className="weekdays">
                   {daysOfWeek.map((day) => (
                     <span key={day}>{day}</span>
                    ))};
                </div>
                <div className="days">
                    {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                        <span key={`empty-${index}`}/>
                    ))};
                    {[...Array(daysInMonth).keys()].map((day) => (
                        <span key={day + 1}>{day + 1}</span>
                    ))}
                </div>
            </div>
            <div className="entry">
                <div className="entry-popup">
                    <div className="time-input">
                        <div className="entry-popup-time">Time</div>
                        <input type="number" name='hours' min={0} max={24} className="hours" />
                        <input type="number" name='minutes' min={0} max={60} className="minutes" />
                    </div>
                    <textarea placeholder='Enter a description (max 60 letters)'></textarea>
                    <button className="entry-popup-btn">Add Entry</button>
                    <button className="close-entry-popup">
                    <i className="bx bx-x"></i>
                    </button>
                </div>
                <div className="entry">
                    <div className="entry-date-wrapper">
                        <div className="entry-date">May 15, 2024</div>
                        <div className="entry-time">10:00</div>
                    </div>
                    <div className="entry-text">Description</div>
                    <div className="entry-buttons">
                        <i className="bx bxs-edit-alt"></i>
                        <i className="bx bxs-message-alt-x"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;