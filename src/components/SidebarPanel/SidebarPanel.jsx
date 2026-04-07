import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { getHolidaysForMonth } from '../../utils/holidays';
import './SidebarPanel.scss';

export default function SidebarPanel({ currentMonth, themeColor, customEvents = [], openEventModal, selectedDate, onDeleteEvent }) {
  const [notes, setNotes] = useState('');

  // The localstorage key depends on the viewed month
  const storageKey = `calendar-notes-${format(currentMonth, 'MM-yyyy')}`;

  // Load notes when the month changes
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    setNotes(savedNotes || '');
  }, [storageKey]);

  // Save notes to localStorage whenever they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(storageKey, newNotes);
  };

  // Fallback to today if selectedDate is null (e.g. during range selection)
  const safeDate = selectedDate || new Date();

  const monthHolidays = getHolidaysForMonth(currentMonth.getMonth());
  const selectedDateHolidays = monthHolidays.filter(h => h.date === safeDate.getDate() && currentMonth.getMonth() === safeDate.getMonth());
  
  // Filter custom events to ONLY those matching safeDate
  const selectedDateEvents = customEvents.filter(ev => {
    if (!ev.date) return false;
    const [evYear, evMonth, evDay] = ev.date.split('-');
    const evDateObj = new Date(parseInt(evYear, 10), parseInt(evMonth, 10) - 1, parseInt(evDay, 10));
    return isSameDay(evDateObj, safeDate);
  }).map(ev => ({
    id: ev.id,
    name: ev.title,
    date: parseInt(ev.date.split('-')[2], 10),
    month: safeDate.getMonth(),
    isCustom: true
  }));

  const allSelectedEvents = [...selectedDateHolidays, ...selectedDateEvents].sort((a, b) => a.date - b.date);

  return (
    <div className="sidebar-panel">
      
      {/* Dynamic theme color border at the top of notes area to tie it together */}
      <div 
        className="sidebar-panel__header"
        style={{ borderBottom: `2px solid var(--theme-color)` }}
      >
        <span className="sidebar-panel__title">Notes</span>
        <span className="sidebar-panel__month">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
      </div>

      <textarea
        className="sidebar-panel__textarea"
        placeholder="Jot down notes, goals, or memos for this month..."
        value={notes}
        onChange={handleNotesChange}
        aria-label="Monthly notes"
      />

      {/* Events / Holidays Section */}
      <div className="sidebar-panel__events">
        <div 
          className="sidebar-panel__header"
          style={{ borderBottom: `2px solid var(--theme-color)`, marginTop: '24px' }}
        >
          <span className="sidebar-panel__title">
            {selectedDate ? `Events for ${format(safeDate, 'MMM d')}` : 'Events'}
          </span>
          <button 
            className="sidebar-panel__add-btn"
            onClick={openEventModal}
            aria-label="Add Event"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {allSelectedEvents.length > 0 ? (
          <ul className="sidebar-panel__event-list">
            {allSelectedEvents.map((eventObj, idx) => (
              <li key={idx} className="sidebar-panel__event-item">
                <span 
                  className="sidebar-panel__event-dot" 
                  style={{ backgroundColor: eventObj.isCustom ? themeColor : '#f87171' }}
                ></span>
                <div className="sidebar-panel__event-text">
                  <strong>{eventObj.name}</strong>
                  <span>{format(safeDate, 'MMM d')}</span>
                </div>
                {eventObj.isCustom && (
                  <button 
                    className="event-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteEvent) onDeleteEvent(eventObj);
                    }}
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="sidebar-panel__empty-msg">No events scheduled.</p>
        )}
      </div>
    </div>
  );
}
