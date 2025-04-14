import React, { useState, useEffect } from 'react';
import { Entry } from '../types/Entry';
import config from "../config";
import { getHeaders } from "../utils/auth";
import '../styles/employer-dashboard.css';

const EmployerDashboard: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
    const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await fetch(
                `${config.apiUrl}/api/entries/pending/${localStorage.getItem('organizationId')}`,
                {
                    credentials: 'include',
                    headers: getHeaders(),
                }
            );
            if (!response.ok) throw new Error('Failed to fetch entries');
            const data = await response.json();
            setEntries(data);
            setFilteredEntries(data);
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        filterEntries();
    };

    const handleEmployeeChange = (employee: string) => {
        setSelectedEmployee(employee);
        filterEntries();
    };

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        filterEntries();
    };

    const handleProjectChange = (project: string) => {
        setSelectedProject(project);
        filterEntries();
    };

    const filterEntries = () => {
        let filtered = [...entries];

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(entry => entry.status === selectedStatus);
        }

        if (selectedEmployee !== 'all') {
            filtered = filtered.filter(entry => entry.user.id.toString() === selectedEmployee);
        }

        if (selectedProject !== 'all') {
            filtered = filtered.filter(entry => entry.project?.projectId.toString() === selectedProject);
        }

        if (startDate && endDate) {
            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.entryStart.toString());
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            });
        }

        setFilteredEntries(filtered);
    };

    const handleEntrySelect = (entryId: number) => {
        setSelectedEntries(prev => 
            prev.includes(entryId) 
                ? prev.filter(id => id !== entryId)
                : [...prev, entryId]
        );
    };

    const handleBulkAction = async (status: 'APPROVED' | 'DECLINED') => {
        try {
            const response = await fetch(
                `${config.apiUrl}/api/entries/bulk-status?status=${status}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        ...getHeaders(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedEntries),
                }
            );
            if (!response.ok) throw new Error('Failed to update entries');
            await fetchEntries();
            setSelectedEntries([]);
        } catch (error) {
            console.error('Error updating entries:', error);
        }
    };

    const handleSingleAction = async (entryId: number, status: 'APPROVED' | 'DECLINED') => {
        try {
            const response = await fetch(
                `${config.apiUrl}/api/entries/${entryId}/status?status=${status}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: getHeaders(),
                }
            );
            if (!response.ok) throw new Error('Failed to update entry');
            await fetchEntries();
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    const getUniqueEmployees = () => {
        const employees = new Set(entries.map(entry => entry.user.id));
        return Array.from(employees);
    };

    const getUniqueProjects = () => {
        const projects = new Set(entries.map(entry => entry.project?.projectId).filter(Boolean));
        return Array.from(projects);
    };

    return (
        <div className="employer-dashboard">
            <h1>Entry Approval Dashboard</h1>
            
            <div className="filters">
                <div className="filter-group">
                    <label>Status:</label>
                    <select value={selectedStatus} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="all">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="DECLINED">Declined</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Employee:</label>
                    <select value={selectedEmployee} onChange={(e) => handleEmployeeChange(e.target.value)}>
                        <option value="all">All Employees</option>
                        {getUniqueEmployees().map(id => (
                            <option key={id} value={id}>
                                {entries.find(e => e.user.id === id)?.user.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Project:</label>
                    <select value={selectedProject} onChange={(e) => handleProjectChange(e.target.value)}>
                        <option value="all">All Projects</option>
                        {getUniqueProjects().map(id => (
                            <option key={id} value={id}>
                                {entries.find(e => e.project?.projectId === id)?.project?.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date Range:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleDateChange(e.target.value, endDate)}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleDateChange(startDate, e.target.value)}
                    />
                </div>
            </div>

            {selectedEntries.length > 0 && (
                <div className="bulk-actions">
                    <button onClick={() => handleBulkAction('APPROVED')}>
                        Approve Selected ({selectedEntries.length})
                    </button>
                    <button onClick={() => handleBulkAction('DECLINED')}>
                        Decline Selected ({selectedEntries.length})
                    </button>
                </div>
            )}

            <div className="entries-list">
                {filteredEntries.map(entry => (
                    <div key={entry.entryId} className="entry-card">
                        <input
                            type="checkbox"
                            checked={selectedEntries.includes(entry.entryId)}
                            onChange={() => handleEntrySelect(entry.entryId)}
                        />
                        <div className="entry-info">
                            <h3>{entry.user.username}</h3>
                            <p className="date">
                                {new Date(entry.entryStart.toString()).toLocaleDateString()}
                            </p>
                            <p className="time">
                                {new Date(entry.entryStart.toString()).toLocaleTimeString()} - 
                                {new Date(entry.entryEnd.toString()).toLocaleTimeString()}
                            </p>
                            <p className="project">
                                Project: {entry.project?.projectName || 'N/A'}
                            </p>
                            <p className="description">{entry.entryDescription}</p>
                            <div className="status-badge" data-status={entry.status.toLowerCase()}>
                                {entry.status}
                            </div>
                        </div>
                        <div className="entry-actions">
                            <button
                                onClick={() => handleSingleAction(entry.entryId, 'APPROVED')}
                                disabled={entry.status === 'APPROVED'}
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleSingleAction(entry.entryId, 'DECLINED')}
                                disabled={entry.status === 'DECLINED'}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployerDashboard; 