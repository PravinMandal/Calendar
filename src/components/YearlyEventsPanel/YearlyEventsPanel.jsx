import React from 'react';
import { format, isSameMonth } from 'date-fns';
import { Trash2 } from 'lucide-react';
import './YearlyEventsPanel.scss';

export default function YearlyEventsPanel({ customEvents = [], currentMonth, themeColor, onEventClick, onDeleteEvent }) {
  // Sort all events chronologically
  const sortedEvents = [...customEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter events to only show ones in the currently viewed month
  const upcomingEvents = sortedEvents.filter(ev => {
    if (!ev.date) return false;
    
    let evMonthIdx;
    if (ev.isRecurring && ev.date.length === 5) {
      // MM-dd pattern
      evMonthIdx = parseInt(ev.date.split('-')[0], 10) - 1;
    } else {
      // YYYY-MM-DD pattern
      evMonthIdx = parseInt(ev.date.split('-')[1], 10) - 1;
    }

    return evMonthIdx === currentMonth.getMonth();
  });

  return (
    <div className="yearly-events-panel">
      <div 
        className="yearly-events-panel__header"
        style={{ borderBottom: `2px solid var(--theme-color)`, paddingBottom: '16px' }}
      >
        <span className="yearly-events-panel__title" style={{ fontSize: '1.4rem' }}>All Events</span>
      </div>

      <div className="events-scroll-container">
        
        {/* Section 1: Upcoming (This Month) */}
        <div className="yearly-events-panel__section">
          <h3 className="yearly-events-panel__subtitle">Upcoming</h3>
          {upcomingEvents.length > 0 ? (
            <ul className="yearly-events-panel__event-list">
              {upcomingEvents.map((eventObj, idx) => {
                const eventDate = new Date(eventObj.date + 'T00:00:00'); 
                return (
                  <li key={`upc-${idx}`} className="yearly-events-panel__event-item event-item" onClick={() => onEventClick(eventObj)}>
                    <span 
                      className="yearly-events-panel__event-dot" 
                      style={{ backgroundColor: themeColor }}
                    ></span>
                    <div className="yearly-events-panel__event-text">
                      <strong>{eventObj.title}</strong>
                      <span>{eventObj.date.length === 5 ? eventObj.date : format(eventDate, 'MMM d, yyyy')}</span>
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
                );
              })}
            </ul>
          ) : (
            <p className="yearly-events-panel__empty-msg">No upcoming events this month.</p>
          )}
        </div>

        {/* Section 2: Yearly Calendar */}
        <div className="yearly-events-panel__section" style={{ marginTop: '24px' }}>
          <h3 className="yearly-events-panel__subtitle">Yearly Calendar</h3>
          {sortedEvents.length > 0 ? (
            <ul className="yearly-events-panel__event-list">
              {sortedEvents.map((eventObj, idx) => {
                const eventDate = new Date(eventObj.date + 'T00:00:00'); 
                return (
                  <li key={`yr-${idx}`} className="yearly-events-panel__event-item event-item" onClick={() => onEventClick(eventObj)}>
                    <span 
                      className="yearly-events-panel__event-dot" 
                      style={{ backgroundColor: themeColor }}
                    ></span>
                    <div className="yearly-events-panel__event-text">
                      <strong>{eventObj.title}</strong>
                      <span>{eventObj.date.length === 5 ? eventObj.date : format(eventDate, 'MMM d, yyyy')}</span>
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
                );
              })}
            </ul>
          ) : (
            <p className="yearly-events-panel__empty-msg">No events scheduled yet.</p>
          )}
        </div>
        
      </div>
    </div>
  );
}
