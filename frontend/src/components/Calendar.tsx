import React, { useState, useEffect } from "react";
import "../styles/calendar.css"; // Import the calendar CSS file
import { Entry } from "../types/Entry"; // Import the Entry type
import config from '../config';
import AuthService from '../services/authService';

// Common headers for all requests
const getHeaders = () => {
  const token = AuthService.getInstance().getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Basic ${token}` } : {}),
  };
};

const fetchConfig = {
  credentials: 'include' as RequestCredentials,
};

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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("16:00");
  const [entryText, setEntryText] = useState<string>("");
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean; entryId: number | null}>({
    show: false,
    entryId: null
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  useEffect(() => {
    fetchEntries();
  }, [currentMonth, currentYear]);

  const fetchEntries = async () => {
    try {

      const response = await fetch(
        `${config.apiUrl}/api/entries?month=${currentMonth + 1}&year=${currentYear}`,
        {
          ...fetchConfig,
          method: 'GET',
          headers: getHeaders(),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      console.log('Fetched entries:', data);
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    setShowEntryPopup(true);
    setStartTime("08:00");
    setEndTime("16:00");
    setEntryText("");
    setEditEntry(null);
  };

  const handleEntrySubmit = async () => {
    const entryData = {
      entryStart: `${selectedDate.toISOString().split('T')[0]}T${startTime}:00`,
      entryEnd: `${selectedDate.toISOString().split('T')[0]}T${endTime}:00`,
      userId: 1,
      entryDescription: entryText,
      status: "PENDING",
      user: {
        id: 1
      }
    };

    try {

      const url = editEntry 
        ? `${config.apiUrl}/api/entries/${editEntry.entryId}`
        : `${config.apiUrl}/api/entries`;
            
      const response = await fetch(url, {
        ...fetchConfig,
        method: editEntry ? 'PUT' : 'POST',
        body: JSON.stringify(entryData),
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error('Failed to save entry');
      }
        
      await fetchEntries();
      setShowEntryPopup(false);
      setEntryText("");
      setEditEntry(null);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const handleEditEvent = (entry: Entry) => {
    const startDate = Array.isArray(entry.entryStart) 
        ? new Date(entry.entryStart[0], entry.entryStart[1] - 1, entry.entryStart[2], entry.entryStart[3], entry.entryStart[4])
        : new Date(entry.entryStart);
    
    const endDate = Array.isArray(entry.entryEnd)
        ? new Date(entry.entryEnd[0], entry.entryEnd[1] - 1, entry.entryEnd[2], entry.entryEnd[3], entry.entryEnd[4])
        : new Date(entry.entryEnd);

    setSelectedDate(startDate);
    setStartTime(startDate.toTimeString().slice(0, 5));
    setEndTime(endDate.toTimeString().slice(0, 5));
    setEntryText(entry.entryDescription);
    setEditEntry(entry);
    setShowEntryPopup(true);
  };

  const handleDeleteClick = (entryId: number) => {
    setDeleteConfirmation({ show: true, entryId });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.entryId) {

      try {
        const response = await fetch(
          `${config.apiUrl}/api/entries/${deleteConfirmation.entryId}`,
          {
            ...fetchConfig,
            method: 'DELETE',
            headers: getHeaders(),
          }
        );
        if (!response.ok) throw new Error('Failed to delete entry');
        await fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }

    }
    setDeleteConfirmation({ show: false, entryId: null });
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
  {[...Array(adjustedFirstDay).keys()].map((_, index) => (
    <span key={`empty-${index}`} />
  ))}
  {[...Array(daysInMonth).keys()].map((day) => {
    const formattedDate = new Date(currentYear, currentMonth, day + 1)
      .toISOString()
      .split("T")[0];

      const hasEntry = entries.some((entry) => {
        let entryDate;
        
        if (Array.isArray(entry.entryStart)) {
          
          entryDate = new Date(entry.entryStart[0], entry.entryStart[1] - 1, entry.entryStart[2]);
        } else {
         
          entryDate = new Date(entry.entryStart);
        }
      
        const formattedEntryDate = entryDate.toISOString().split("T")[0];
      
        return formattedEntryDate === formattedDate;
      });

    return (
      <span
        key={day + 1}
        className={`${day + 1 === currentDate.getDate() &&
          currentMonth === currentDate.getMonth() &&
          currentYear === currentDate.getFullYear()
          ? "current-day"
          : ""
        } ${hasEntry ? "has-entry" : ""}`}
        onClick={() => handleDayClick(day + 1)}
      >
        {day + 1}
      </span>
    );
  })}
</div>
      </div>

      {/* Entry Popup - Now contains Start & End Time Inputs */}
      {showEntryPopup && (
        <div className="entry-popup">
          <h2>Work Hours</h2>
          <div className="time-input">
            <label>Start Time</label>
            <input
              type="time"
              className="time-input-field"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="time-input">
            <label>End Time</label>
            <input
              type="time"
              className="time-input-field"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
            {editEntry ? "Update Entry" : "Add Entry"}
          </button>
          <button className="close-entry-popup" onClick={() => setShowEntryPopup(false)}>
            <i className="bx bx-x"></i>
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteConfirmation.show && (
        <div className="delete-popup-overlay">
            <div className="delete-popup">
                <h3>Delete Entry</h3>
                <p>Are you sure you want to delete this entry?</p>
                <div className="delete-popup-buttons">
                    <button 
                        className="delete-confirm-btn"
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </button>
                    <button 
                        className="delete-cancel-btn"
                        onClick={() => setDeleteConfirmation({ show: false, entryId: null })}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Entries List - Show all entries */}
      <div className="entries-list">
        <h3>All Entries</h3>
        {entries.map((entry) => (
          <div key={entry.entryId} className="entry">
            <div className="entry-date-wrapper">
              <div>
                <div className="entry-date">
                  {new Date(Array.isArray(entry.entryStart) 
                    ? new Date(entry.entryStart[0], entry.entryStart[1] - 1, entry.entryStart[2]).toLocaleDateString()
                    : entry.entryStart).toLocaleDateString()}
                </div>
                <div className="entry-time">
                  {Array.isArray(entry.entryStart) 
                    ? `${entry.entryStart[3]}:${entry.entryStart[4].toString().padStart(2, '0')}`
                    : new Date(entry.entryStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                  } - 
                  {Array.isArray(entry.entryEnd)
                    ? `${entry.entryEnd[3]}:${entry.entryEnd[4].toString().padStart(2, '0')}`
                    : new Date(entry.entryEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                  }
                </div>
              </div>
              <div className="entry-status">{entry.status}</div>
            </div>
            <div className="entry-text">{entry.entryDescription}</div>
            <div className="entry-buttons">
              <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(entry)}></i>
              <i className="bx bxs-message-alt-x" onClick={() => handleDeleteClick(entry.entryId)}></i>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="no-entries">No entries yet</div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
