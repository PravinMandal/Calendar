import React, { useState, useEffect } from 'react'
import SidebarPanel from '../SidebarPanel/SidebarPanel'
import YearlyEventsPanel from '../YearlyEventsPanel/YearlyEventsPanel'
import CalendarHeader from '../CalendarHeader/CalendarHeader'
import CalendarGrid from '../CalendarGrid/CalendarGrid'
import EventModal from '../EventModal/EventModal'
import './CalendarApp.scss'

/**
 * CalendarApp — Physical wall calendar root component
 *
 * State:
 *   currentMonth   — Date representing viewed month/year
 *   selectionStart — Date | null — range start
 *   selectionEnd   — Date | null — range end
 *   hoverDate      — Date | null — live hover preview for range
 *   themeColor     — hex string injected as --theme-color CSS var
 *
 * The themeColor drives ALL accent colors in child components via
 * `var(--theme-color)` — buttons, selected day highlight, notes header, etc.
 * In Phase 5 this will be auto-derived from the hero image dominant color.
 */

// Curated monthly themes — hero image (picsum.photos — reliable seeded IDs)
// Paired with a matching accent color. Index 0 = January … 11 = December
const MONTHLY_THEMES = [
  { url: 'https://picsum.photos/seed/january/900/400',   color: '#0ea5e9', label: 'Alpine Lake' },
  { url: 'https://picsum.photos/seed/february/900/400',  color: '#f59e0b', label: 'Desert Dunes' },
  { url: 'https://picsum.photos/seed/forest22/900/400',  color: '#10b981', label: 'Forest Mist' },
  { url: 'https://picsum.photos/seed/dusk99/900/400',    color: '#8b5cf6', label: 'Dusk Shore' },
  { url: 'https://picsum.photos/seed/blossom5/900/400',  color: '#ec4899', label: 'Cherry Blossom' },
  { url: 'https://picsum.photos/seed/golden7/900/400',   color: '#f97316', label: 'Golden Fields' },
  { url: 'https://picsum.photos/seed/ocean14/900/400',   color: '#06b6d4', label: 'Ocean Horizon' },
  { url: 'https://picsum.photos/seed/autumn8/900/400',   color: '#e11d48', label: 'Autumn Reds' },
  { url: 'https://picsum.photos/seed/hills33/900/400',   color: '#16a34a', label: 'Hillside Green' },
  { url: 'https://picsum.photos/seed/winter6/900/400',   color: '#0369a1', label: 'Winter Lake' },
  { url: 'https://picsum.photos/seed/peaks11/900/400',   color: '#7c3aed', label: 'Twilight Peaks' },
  { url: 'https://picsum.photos/seed/snow42/900/400',    color: '#dc2626', label: 'Snowy Pines' },
]

function CalendarApp() {
  const today = new Date()

  // Pick theme based on current month index (0–11)
  const monthIndex = today.getMonth()
  const initialTheme = MONTHLY_THEMES[monthIndex]

  const [currentMonth, setCurrentMonth]     = useState(today)
  const [selectionStart, setSelectionStart] = useState(null)
  const [selectionEnd, setSelectionEnd]     = useState(null)
  const [hoverDate, setHoverDate]           = useState(null)
  const [selectedDate, setSelectedDate]     = useState(today)
  const [themeColor, setThemeColor]         = useState(initialTheme.color)
  const [heroUrl, setHeroUrl]               = useState(initialTheme.url)
  const [heroLabel, setHeroLabel]           = useState(initialTheme.label)
  const [customEvents, setCustomEvents]     = useState([])
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [isSelectingMode, setIsSelectingMode] = useState(false)
  const [selectedEventDate, setSelectedEventDate] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('calendar-custom-events');
      if (saved) {
        setCustomEvents(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load events:', e);
    }
  }, []);

  // ── Handlers (wired up in later phases) ──────────────────────────────────
  const handleMonthChange = (newDate) => {
    setCurrentMonth(newDate)
    
    // Safety clear active dragging selections on month flips
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelectingMode(false);

    // Sync theme to new month
    const idx = newDate.getMonth()
    const theme = MONTHLY_THEMES[idx]
    setThemeColor(theme.color)
    setHeroUrl(theme.url)
    setHeroLabel(theme.label)
  }

  const handleDateClickForEvent = (date) => {
    // Format date properly for the native input type="date"
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
    
    setSelectedEventDate(formattedDate);
    setIsModalOpen(true);
  }

  const handleReset = () => {
    setSelectionStart(null)
    setSelectionEnd(null)
    setHoverDate(null)
  }

  const handleEventClick = (eventDateStr) => {
    // Parse the 'YYYY-MM-DD' back into true javascript Date object
    const [year, month, day] = eventDateStr.split('-');
    const parsedDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    
    // Jump calendar view
    handleMonthChange(parsedDate);
    // Auto select the day
    setSelectedDate(parsedDate);
    // Drop any current selections
    setSelectionStart(null);
    setSelectionEnd(null);
  }

  const handleAddCustomEvent = (newEvent) => {
    const updatedEvents = [...customEvents, newEvent];
    setCustomEvents(updatedEvents);
    localStorage.setItem('calendar-custom-events', JSON.stringify(updatedEvents));
  };

  const handleDeleteEvent = (eventToDelete) => {
    const updatedEvents = customEvents.filter(ev => {
      if (eventToDelete.id && ev.id) return ev.id !== eventToDelete.id;
      return ev.title !== eventToDelete.name; // fallback for parsed/hydrated UI lists using .name mapped from .title
    });
    setCustomEvents(updatedEvents);
    localStorage.setItem('calendar-custom-events', JSON.stringify(updatedEvents));
  };

  // Shared props object passed to children in later phases
  const calendarProps = {
    currentMonth, onMonthChange: handleMonthChange,
    selectionStart, selectionEnd, hoverDate, setSelectionStart, setSelectionEnd, setHoverDate,
    selectedDate, setSelectedDate,
    isSelectingMode, setIsSelectingMode,
    onDateClickForEvent: handleDateClickForEvent,
    onReset: handleReset, themeColor,
    customEvents, onAddCustomEvent: handleAddCustomEvent,
    onDeleteEvent: handleDeleteEvent,
    openEventModal: () => { 
      const formattedDate = [
        selectedDate.getFullYear(),
        String(selectedDate.getMonth() + 1).padStart(2, '0'),
        String(selectedDate.getDate()).padStart(2, '0')
      ].join('-');
      setSelectedEventDate(formattedDate); 
      setIsModalOpen(true); 
    }
  }

  return (
    <div 
      className="app-wrapper" 
      id="calendar-app"
      style={{ '--bg-image': `url(${heroUrl})` }}
    >

      {/* ── WALL CALENDAR ─────────────────────────────────────────────── */}
      {/* themeColor injected as a CSS custom property for all children   */}
      <div
        className="wall-calendar"
        style={{ '--theme-color': themeColor }}
        role="application"
        aria-label="Interactive Wall Calendar"
      >

        {/* ── SPIRAL BINDING ──────────────────────────────────────────── */}
        <div className="spiral-binding" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="spiral-binding__ring">
              <div className="spiral-binding__hole" />
            </div>
          ))}
        </div>

        {/* ── HERO IMAGE SECTION ──────────────────────────────────────── */}
        <div className="calendar-hero">
          <img
            src={heroUrl}
            alt={`${heroLabel} — monthly hero`}
            className="calendar-hero__image"
            draggable={false}
          />
          {/* Gradient overlay at bottom so body text stays readable */}
          <div className="calendar-hero__overlay" />
          {/* Month label badge over image */}
          <div className="calendar-hero__badge">
            <span className="calendar-hero__badge-month">
              {currentMonth.toLocaleString('default', { month: 'long' })}
            </span>
            <span className="calendar-hero__badge-year">
              {currentMonth.getFullYear()}
            </span>
          </div>
          {/* Image credit label */}
          <span className="calendar-hero__credit">{heroLabel}</span>
        </div>

        {/* ── CALENDAR BODY ───────────────────────────────────────────── */}
        <div className="calendar-body">

          {/* 1. Left: Notes / Sidebar */}
          <aside className="calendar-body__sidebar" aria-label="Notes panel">
            <SidebarPanel {...calendarProps} />
          </aside>

          {/* 2. Middle: Header + Grid */}
          <div className="calendar-body__main" aria-label="Calendar grid panel">
            <CalendarHeader {...calendarProps} />
            <hr className="calendar-body__rule" />
            <CalendarGrid {...calendarProps} />
          </div>

          {/* 3. Right: Yearly Events */}
          <aside className="calendar-body__sidebar" aria-label="Yearly events panel">
            <YearlyEventsPanel 
              customEvents={customEvents} 
              themeColor={themeColor} 
              currentMonth={currentMonth}
              onEventClick={handleEventClick} 
            />
          </aside>

        </div>
        {/* end .calendar-body */}

        {isModalOpen && (
          <EventModal 
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddCustomEvent}
            initialDate={selectedEventDate}
          />
        )}

      </div>
      {/* end .wall-calendar */}

    </div>
  )
}

export default CalendarApp
