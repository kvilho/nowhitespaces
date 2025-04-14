import React, { useState, useEffect, useMemo } from "react";
import "../styles/calendar.css"; // Import the calendar CSS file
import { Entry } from "../types/Entry"; // Import the Entry type
import config from '../config';
import authService from '../services/authService';
import projectService from '../services/projectService';
import { Project } from '../services/projectService';

// Common headers for all requests
const getHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const fetchConfig = {
  credentials: 'include' as RequestCredentials,
};

interface DeleteConfirmation {
  show: boolean;
  entryId: number | null;
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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("16:00");
  const [entryText, setEntryText] = useState<string>("");
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    show: false,
    entryId: null
  });
  const [sortMethod, setSortMethod] = useState<string>("date-asc");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [project, setProject] = useState<Entry | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  useEffect(() => {
    fetchEntries();
    fetchUserProjects();
  }, [currentMonth, currentYear]);

  const fetchEntries = async () => {
    try {
      const userId = authService.getUserId();
      if (!userId) {
        console.error('No user ID found');
        window.location.href = '/login';
        return;
      }
      const response = await fetch(
        `${config.apiUrl}/api/entries?userId=${userId}&month=${currentMonth + 1}&year=${currentYear}`,
        {
          ...fetchConfig,
          method: 'GET',
          headers: getHeaders(),
        }
      );
      if (!response.ok) {
        if (response.status === 401) {
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

  const fetchUserProjects = async () => {
    try {
      const projects = await projectService.getMyProjects();
      setUserProjects(projects);
      if (projects.length > 0) {
        setSelectedProject(projects[0]); // Select first project by default
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const filterEntries = () => {
    return entries.filter((entry) => {
      const entryDate = formatDate(entry.entryStart as string | Date);
      const startDateObj = startDate ? new Date(startDate + 'T00:00:00Z') : null;
      const endDateObj = endDate ? new Date(endDate + 'T23:59:59Z') : null;

      const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
      const matchesProject = filterProject === 'all' || entry.project?.projectId.toString() === filterProject;
      const matchesDateRange = (!startDateObj || entryDate >= startDateObj) && 
                             (!endDateObj || entryDate <= endDateObj);

      return matchesStatus && matchesProject && matchesDateRange;
    });
  };

  const sortEntries = (entries: Entry[]) => {
    switch (sortMethod) {
      case "date-asc": // Sort by date in ascending order
        return [...entries].sort((a, b) => {
          const dateA = Array.isArray(a.entryStart)
            ? new Date(a.entryStart[0], a.entryStart[1] - 1, a.entryStart[2], a.entryStart[3] || 0, a.entryStart[4] || 0)
            : new Date(a.entryStart);
          const dateB = Array.isArray(b.entryStart)
            ? new Date(b.entryStart[0], b.entryStart[1] - 1, b.entryStart[2], b.entryStart[3] || 0, b.entryStart[4] || 0)
            : new Date(b.entryStart);
          return dateA.getTime() - dateB.getTime();
        });
      case "date-desc": // Sort by date in descending order
        return [...entries].sort((a, b) => {
          const dateA = Array.isArray(a.entryStart)
            ? new Date(a.entryStart[0], a.entryStart[1] - 1, a.entryStart[2], a.entryStart[3] || 0, a.entryStart[4] || 0)
            : new Date(a.entryStart);
          const dateB = Array.isArray(b.entryStart)
            ? new Date(b.entryStart[0], b.entryStart[1] - 1, b.entryStart[2], b.entryStart[3] || 0, b.entryStart[4] || 0)
            : new Date(b.entryStart);
          return dateB.getTime() - dateA.getTime();
        });
      case "status":
        return [...entries].sort((a, b) => {
          // First sort by status
          const statusComparison = a.status.localeCompare(b.status);
          if (statusComparison !== 0) {
            return statusComparison;
          }
          // If statuses are the same, sort by date
          const dateA = Array.isArray(a.entryStart)
            ? new Date(a.entryStart[0], a.entryStart[1] - 1, a.entryStart[2], a.entryStart[3] || 0, a.entryStart[4] || 0)
            : new Date(a.entryStart);
          const dateB = Array.isArray(b.entryStart)
            ? new Date(b.entryStart[0], b.entryStart[1] - 1, b.entryStart[2], b.entryStart[3] || 0, b.entryStart[4] || 0)
            : new Date(b.entryStart);
          return dateA.getTime() - dateB.getTime();
        });
      case "description": // Sort by description
        return [...entries].sort((a, b) => a.entryDescription.localeCompare(b.entryDescription));
      default:
        return entries;
    }
  };

  // Helper function to format date consistently
  const formatDate = (date: string | Date | number[]): Date => {
    if (Array.isArray(date)) {
      return new Date(Date.UTC(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0));
    }
    if (date instanceof Date) {
      return date;
    }
    return new Date(date + 'Z'); // Ensure UTC
  };

  // Helper function to format time display
  const formatTimeDisplay = (date: string | Date | number[]): string => {
    const dateObj = formatDate(date);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Memoize filtered and sorted entries
  const processedEntries = useMemo(() => {
    return sortEntries(filterEntries());
  }, [entries, filterStatus, filterProject, startDate, endDate, sortMethod]);

  const getUniqueProjects = () => {
    const projects = new Set(entries.map(entry => entry.project?.projectId).filter(Boolean));
    return Array.from(projects);
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
    
    const clickedDate = new Date(Date.UTC(currentYear, currentMonth, day));
    setSelectedDate(clickedDate);
    setShowEntryPopup(true);
    setStartTime("08:00");
    setEndTime("16:00");
    setEntryText("");
    setEditEntry(null);
  };

  const handleEntrySubmit = async () => {
    // Format the date without timezone offset
    const formattedDate = `${selectedDate.getUTCFullYear()}-${(selectedDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.getUTCDate().toString().padStart(2, "0")}`;
  
    const userId = authService.getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    if (!selectedProject) {
      console.error('No project selected');
      return;
    }

    const entryData = {
      entryStart: `${formattedDate}T${startTime}:00`,
      entryEnd: `${formattedDate}T${endTime}:00`,
      entryDescription: entryText,
      status: "PENDING",
      userId: parseInt(userId),
      projectId: selectedProject.projectId
    };
  
    try {
      const url = editEntry
        ? `${config.apiUrl}/api/entries/${editEntry.entryId}`
        : `${config.apiUrl}/api/entries`;
  
      const response = await fetch(url, {
        ...fetchConfig,
        method: editEntry ? "PUT" : "POST",
        body: JSON.stringify(entryData),
        headers: getHeaders(),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error("Failed to save entry");
      }
  
      await fetchEntries();
      setShowEntryPopup(false);
      setEntryText("");
      setEditEntry(null);
    } catch (error) {
      console.error("Error saving entry:", error);
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortMethod(e.target.value);
  };

  return (
    <div className="calendar-app">
      <div className="calendar-container">
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
            const formattedDate = new Date(Date.UTC(currentYear, currentMonth, day + 1))
              .toISOString()
              .split("T")[0]; // Ensure the date is treated as UTC

            const hasEntry = entries.some((entry) => {
              let entryDate;

              if (Array.isArray(entry.entryStart)) {
                entryDate = new Date(Date.UTC(entry.entryStart[0], entry.entryStart[1] - 1, entry.entryStart[2]));
              } else {
                entryDate = new Date(entry.entryStart + "Z"); // Treat string dates as UTC
              }

              const formattedEntryDate = entryDate.toISOString().split("T")[0];

              return formattedEntryDate === formattedDate;
            });

            return (
              <span
                key={day + 1}
                className={`${day + 1 === currentDate.getUTCDate() &&
                  currentMonth === currentDate.getUTCMonth() &&
                  currentYear === currentDate.getUTCFullYear()
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

      <div className="entries-list-container">
        <h3>
          My Entries
          <div className="filters">
            <select
              className="filter-dropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="DECLINED">Declined</option>
            </select>

            <select
              className="filter-dropdown"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {getUniqueProjects().map(id => (
                <option key={id} value={id}>
                  {entries.find(e => e.project?.projectId === id)?.project?.projectName}
                </option>
              ))}
            </select>

            <div className="date-filters">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>

            <select
              className="sort-dropdown"
              value={sortMethod}
              onChange={handleSortChange}
            >
              <option value="date-asc">Date (Ascending)</option>
              <option value="date-desc">Date (Descending)</option>
              <option value="status">Status</option>
              <option value="description">Description</option>
            </select>
          </div>
        </h3>
        <div className="entries-list">
          {processedEntries.map((entry: Entry) => (
            <div key={entry.entryId} className="entry">
              <div className="entry-date-wrapper">
                <div>
                  <div className="entry-date">
                    {formatDate(entry.entryStart as string | Date).toLocaleDateString()}
                  </div>
                  <div className="entry-time">
                    {formatTimeDisplay(entry.entryStart as string | Date)} - {formatTimeDisplay(entry.entryEnd as string | Date)}
                  </div>
                </div>
                <div className="entry-status" data-status={entry.status.toLowerCase()}>{entry.status}</div>
              </div>
              <div className="entry-text">{entry.entryDescription}</div>
              {entry.project && (
                <div className="entry-project">Project: {entry.project.projectName}</div>
              )}
              <div className="entry-buttons">
                <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(entry)}></i>
                <i className="bx bxs-message-alt-x" onClick={() => handleDeleteClick(entry.entryId)}></i>
              </div>
            </div>
          ))}
          {filterEntries().length === 0 && (
            <div className="no-entries">No entries found</div>
          )}
        </div>
      </div>

      {/* Entry Popup - Now contains Project Selection */}
      {showEntryPopup && (
        <div className="entry-popup">
          <h2>Work Hours</h2>
          <div className="project-select">
            <label>Project</label>
            <select
              value={selectedProject?.projectId || ''}
              onChange={(e) => {
                const project = userProjects.find(p => p.projectId === parseInt(e.target.value));
                setSelectedProject(project || null);
              }}
              required
            >
              {userProjects.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </div>
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
          <button className="entry-popup-btn" onClick={handleEntrySubmit} disabled={!selectedProject}>
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
    </div>
  );
};

export default Calendar;
