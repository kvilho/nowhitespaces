import React, { useState } from "react";
import "../styles/main.css";
import "../styles/calendar.css"; // Import the calendar CSS file

// Define types for entry data
interface CalendarEntry {
  id: number;
  date: Date;
  time: string;
  text: string;
}

const Calendar: React.FC = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthsOfYear = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [showEntryPopup, setShowEntryPopup] = useState<boolean>(false);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [entryTime, setEntryTime] = useState<{ hours: string; minutes: string }>({
    hours: "00",
    minutes: "00",
  });
  const [entryText, setEntryText] = useState<string>("");
  const [editEntry, setEditEntry] = useState<CalendarEntry | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate);
      setShowEntryPopup(true);
      setEntryTime({ hours: "00", minutes: "00" });
      setEntryText("");
      setEditEntry(null);
    }
  };

  const handleEntrySubmit = () => {
    const newEntry: CalendarEntry = {
      id: editEntry ? editEntry.id : Date.now(),
      date: selectedDate,
      time: `${entryTime.hours.padStart(2, "0")}:${entryTime.minutes.padStart(2, "0")}`,
      text: entryText,
    };

    let updatedEntries = [...entries];

    if (editEntry) {
      updatedEntries = updatedEntries.map((entry) =>
        entry.id === editEntry.id ? newEntry : entry
      );
    } else {
      updatedEntries.push(newEntry);
    }

    updatedEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

    setEntries(updatedEntries);
    setEntryTime({ hours: "00", minutes: "00" });
    setEntryText("");
    setShowEntryPopup(false);
    setEditEntry(null);
  };

  const handleEditEvent = (entry: CalendarEntry) => {
    setSelectedDate(new Date(entry.date));
    setEntryTime({
      hours: entry.time.split(":")[0],
      minutes: entry.time.split(":")[1],
    });
    setEntryText(entry.text);
    setEditEntry(entry);
    setShowEntryPopup(true);
  };

  const handleDeleteEntry = (entryId: number) => {
    const updatedEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(updatedEntries);
  };

  return (
    <div className="calendar-app">
      <div className="calendar">
        <h1 className="heading">Calendar</h1>
        <div className="navigate-date">
          <h2 className="Month">{monthsOfYear[currentMonth]}</h2>
          <h2 className="Year">{currentYear}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day) => (
            <span
              key={day + 1}
              className={
                day + 1 === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()
                  ? "current-day"
                  : ""
              }
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Entry Popup */}
      {showEntryPopup && (
        <div className="entry-popup">
          <div className="time-input">
            <div className="entry-popup-time">Time</div>
            <input
              type="number"
              name="hours"
              min={0}
              max={24}
              className="hours"
              value={entryTime.hours}
              onChange={(e) => setEntryTime({ ...entryTime, hours: e.target.value })}
            />
            <input
              type="number"
              name="minutes"
              min={0}
              max={60}
              className="minutes"
              value={entryTime.minutes}
              onChange={(e) => setEntryTime({ ...entryTime, minutes: e.target.value })}
            />
          </div>
          <textarea
            placeholder="Enter a description (max 60 letters)"
            value={entryText}
            onChange={(e) => {
              if (e.target.value.length <= 60) {
                setEntryText(e.target.value);
              }
            }}
          />
          <button className="entry-popup-btn" onClick={handleEntrySubmit}>
            {editEntry ? "Update entry" : "Add entry"}
          </button>
          <button className="close-entry-popup" onClick={() => setShowEntryPopup(false)}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      {/* Entries List */}
      {entries.map((entry) => (
        <div className="entry" key={entry.id}>
          <div className="entry-date-wrapper">
            <div className="entry-date">{`${monthsOfYear[entry.date.getMonth()]} ${entry.date.getDate()}, ${entry.date.getFullYear()}`}</div>
            <div className="entry-time">{entry.time}</div>
          </div>
          <div className="entry-text">{entry.text}</div>
          <div className="entry-buttons">
            <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(entry)}></i>
            <i className="bx bxs-message-alt-x" onClick={() => handleDeleteEntry(entry.id)}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;
