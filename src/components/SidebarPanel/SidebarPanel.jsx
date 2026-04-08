import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { getHolidaysForMonth } from '../../utils/holidays';
import './SidebarPanel.scss';

export default function SidebarPanel({ currentMonth, themeColor, customEvents = [], openEventModal, selectedDate, onDeleteEvent }) {
  const [notes, setNotes] = useState('');

  const storageKey = `calendar-notes-${format(currentMonth, 'MM-yyyy')}`;

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    setNotes(savedNotes || '');
  }, [storageKey]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(storageKey, newNotes);
  };

  const safeDate = selectedDate || new Date();

  const monthHolidays = getHolidaysForMonth(currentMonth.getMonth());
  const selectedDateHolidays = monthHolidays.filter(h => h.date === safeDate.getDate() && currentMonth.getMonth() === safeDate.getMonth());
  
  const selectedDateEvents = [];
  
  customEvents.forEach(ev => {
    if (!ev.date) return;
    
    if (ev.isRecurring) {
      const evMMdd = ev.date.length === 5 ? ev.date : format(new Date(ev.date), 'MM-dd');
      if (format(safeDate, 'MM-dd') === evMMdd) {
        selectedDateEvents.push(ev);
      }
    } else {
      const [evYear, evMonth, evDay] = ev.date.split('-');
      const evDateObj = new Date(parseInt(evYear, 10), parseInt(evMonth, 10) - 1, parseInt(evDay, 10));
      if (isSameDay(evDateObj, safeDate)) {
        selectedDateEvents.push(ev);
      }
    }
  });

  const parsedEvents = selectedDateEvents.map(ev => ({
    id: ev.id,
    name: ev.title,
    date: safeDate.getDate(),
    month: safeDate.getMonth(),
    type: ev.type,
    isCustom: ev.type === 'user'
  }));

  const allSelectedEvents = [...selectedDateHolidays, ...parsedEvents].sort((a, b) => a.date - b.date);

  const uniqueEvents = allSelectedEvents.reduce((acc, current) => {
    const titleToUse = current.name || '';
    const normalizedTitle = titleToUse.toLowerCase().replace(' day', '').trim();
    
    const duplicateIndex = acc.findIndex(item => {
      const itemTitle = item.name || '';
      return itemTitle.toLowerCase().replace(' day', '').trim() === normalizedTitle;
    });
    
    if (duplicateIndex === -1) {
      return acc.concat([current]);
    } else {
      if (current.type === 'user') {
        const newAcc = [...acc];
        newAcc[duplicateIndex] = current;
        return newAcc;
      }
      return acc;
    }
  }, []);

  return (
    <div className="sidebar-panel">
      
      {}
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
        placeholder="Notes, goals, or reminders for this month..."
        value={notes}
        onChange={handleNotesChange}
        aria-label="Monthly notes"
      />

      {}
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
        
        {uniqueEvents.length > 0 ? (
          <ul className="sidebar-panel__event-list">
            {uniqueEvents.map((eventObj, idx) => (
              <li key={idx} className="sidebar-panel__event-item">
                <span 
                  className="sidebar-panel__event-dot" 
                  style={{ backgroundColor: eventObj.isCustom ? themeColor : '#f87171' }}
                ></span>
                <div className="sidebar-panel__event-text">
                  <strong>{eventObj.name}</strong>
                  <span>{format(safeDate, 'MMM d')}</span>
                </div>
                {eventObj.type === 'user' && (
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
