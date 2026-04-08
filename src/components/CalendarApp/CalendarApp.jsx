import React, { useState, useEffect } from 'react'
import { isValid, startOfMonth, format } from 'date-fns'
import SidebarPanel from '../SidebarPanel/SidebarPanel'
import YearlyEventsPanel from '../YearlyEventsPanel/YearlyEventsPanel'
import CalendarHeader from '../CalendarHeader/CalendarHeader'
import CalendarGrid from '../CalendarGrid/CalendarGrid'
import EventModal from '../EventModal/EventModal'
import './CalendarApp.scss'

const INDIAN_EVENTS = [
  // National Holidays
  { id: 'ind-1', title: 'Republic Day', date: '01-26', type: 'national', isRecurring: true },
  { id: 'ind-2', title: 'Independence Day', date: '08-15', type: 'national', isRecurring: true },
  { id: 'ind-3', title: 'Gandhi Jayanti', date: '10-02', type: 'national', isRecurring: true },
  { id: 'ind-9', title: 'Holi', date: '03-14', type: 'national', isRecurring: true },
  { id: 'ind-10', title: 'Ambedkar Jayanti', date: '04-14', type: 'national', isRecurring: true },
  { id: 'ind-12', title: 'Dussehra', date: '10-12', type: 'national', isRecurring: true },
  { id: 'ind-13', title: 'Diwali', date: '11-01', type: 'national', isRecurring: true },

  // Observances
  { id: 'ind-4', title: 'New Year', date: '01-01', type: 'observance', isRecurring: true },
  { id: 'ind-5', title: "Valentine's Day", date: '02-14', type: 'observance', isRecurring: true },
  { id: 'ind-6', title: 'May Day', date: '05-01', type: 'observance', isRecurring: true },
  { id: 'ind-11', title: 'Yoga Day', date: '06-21', type: 'observance', isRecurring: true },
  { id: 'ind-7', title: 'Teachers Day', date: '09-05', type: 'observance', isRecurring: true },
  { id: 'ind-14', title: "Children's Day", date: '11-14', type: 'observance', isRecurring: true },
  { id: 'ind-8', title: 'Christmas', date: '12-25', type: 'observance', isRecurring: true }
];

const MONTH_IMAGES = [
  'https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?auto=format&fit=crop&q=80&w=2000', // Jan
  'https://images.unsplash.com/photo-1433162653888-a571db5ccccf?auto=format&fit=crop&q=80&w=2000', // Feb
  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&q=80&w=2000', // Mar
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=2000', // Apr
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000', // May
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000', // Jun
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000', // Jul
  'https://images.unsplash.com/photo-1440778303588-435521a205bc?auto=format&fit=crop&q=80&w=2000', // Aug
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000', // Sep
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?auto=format&fit=crop&q=80&w=2000', // Oct
  'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?auto=format&fit=crop&q=80&w=2000', // Nov
  'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=2000'  // Dec
];

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
  { url: 'https://picsum.photos/seed/january/900/400', color: '#0ea5e9', label: 'Alpine Lake' },
  { url: 'https://picsum.photos/seed/february/900/400', color: '#f59e0b', label: 'Desert Dunes' },
  { url: 'https://picsum.photos/seed/forest22/900/400', color: '#10b981', label: 'Forest Mist' },
  { url: 'https://picsum.photos/seed/dusk99/900/400', color: '#8b5cf6', label: 'Dusk Shore' },
  { url: 'https://picsum.photos/seed/blossom5/900/400', color: '#ec4899', label: 'Cherry Blossom' },
  { url: 'https://picsum.photos/seed/golden7/900/400', color: '#f97316', label: 'Golden Fields' },
  { url: 'https://picsum.photos/seed/ocean14/900/400', color: '#06b6d4', label: 'Ocean Horizon' },
  { url: 'https://picsum.photos/seed/autumn8/900/400', color: '#e11d48', label: 'Autumn Reds' },
  { url: 'https://picsum.photos/seed/hills33/900/400', color: '#16a34a', label: 'Hillside Green' },
  { url: 'https://picsum.photos/seed/winter6/900/400', color: '#0369a1', label: 'Winter Lake' },
  { url: 'https://picsum.photos/seed/peaks11/900/400', color: '#7c3aed', label: 'Twilight Peaks' },
  { url: 'https://picsum.photos/seed/snow42/900/400', color: '#dc2626', label: 'Snowy Pines' },
]

function CalendarApp() {
  const today = new Date()

  // Pick theme based on current month index (0–11)
  const monthIndex = today.getMonth()
  const initialTheme = MONTHLY_THEMES[monthIndex]

  const [currentMonth, setCurrentMonth] = useState(today)
  const [flipAnimation, setFlipAnimation] = useState(null)
  const [selectionStart, setSelectionStart] = useState(null)
  const [selectionEnd, setSelectionEnd] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState(today)
  const [themeColor, setThemeColor] = useState(initialTheme.color)
  const [heroUrl, setHeroUrl] = useState(initialTheme.url)
  const [heroLabel, setHeroLabel] = useState(initialTheme.label)
  const [customEvents, setCustomEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    if (newDate.getTime() === currentMonth.getTime()) return;
    if (flipAnimation) return;

    const isNext = newDate > currentMonth;
    const newIdx = newDate.getMonth();
    const newTheme = MONTHLY_THEMES[newIdx];

    // Safety clear active dragging selections on month flips
    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelectingMode(false);
    setSelectedDate(startOfMonth(newDate));

    if (isNext) {
      // ── TEAR OFF (Next) ──
      setFlipAnimation({
        type: 'tear-off',
        data: {
          monthDate: currentMonth,
          themeColor: themeColor,
          heroLabel: heroLabel,
          image: MONTH_IMAGES[currentMonth.getMonth()]
        }
      });

      // Update main background immediately
      setCurrentMonth(newDate);
      setThemeColor(newTheme.color);
      setHeroUrl(newTheme.url);
      setHeroLabel(newTheme.label);

      setTimeout(() => {
        setFlipAnimation(null);
      }, 800);
    } else {
      // ── REATTACH (Prev) ──
      // Render the incoming new month overlay flying up
      setFlipAnimation({
        type: 'reattach',
        data: {
          monthDate: newDate,
          themeColor: newTheme.color,
          heroLabel: newTheme.label,
          image: MONTH_IMAGES[newIdx]
        }
      });

      // Update the main background only *after* animation attaches
      setTimeout(() => {
        setCurrentMonth(newDate);
        setThemeColor(newTheme.color);
        setHeroUrl(newTheme.url);
        setHeroLabel(newTheme.label);
        setFlipAnimation(null);
      }, 800);
    }
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

  const handleTodayClick = () => {
    const now = new Date();
    setCurrentMonth(now);
    setSelectedDate(now);
    handleReset();
  };

  const handleEventClick = (event) => {
    let targetDate;
    const viewedYear = currentMonth.getFullYear();

    if (event.isRecurring || event.type === 'national' || event.type === 'observance') {
      // It's a recurring event. Safely extract Month and Day.
      let month, day;
      if (typeof event.date === 'string' && event.date.length === 5 && event.date.includes('-')) {
        // Hardcoded 'MM-dd' format
        [month, day] = event.date.split('-');
      } else {
        // User created recurring event (ISO string)
        const d = new Date(event.date);
        month = d.getMonth() + 1;
        day = d.getDate();
      }
      // Construct target date using the CURRENTLY VIEWED year
      targetDate = new Date(viewedYear, parseInt(month) - 1, parseInt(day));
    } else {
      // One-time event. Jump to its exact specific year and date.
      targetDate = new Date(event.date);
    }

    if (isValid(targetDate)) {
      handleMonthChange(targetDate);
      setSelectedDate(targetDate);
    }
  };

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

  const allEvents = [...INDIAN_EVENTS, ...customEvents];

  // Shared props object passed to children in later phases
  const calendarProps = {
    currentMonth, onMonthChange: handleMonthChange, onToday: handleTodayClick,
    selectionStart, selectionEnd, hoverDate, setSelectionStart, setSelectionEnd, setHoverDate,
    selectedDate, setSelectedDate,
    isSelectingMode, setIsSelectingMode,
    onDateClickForEvent: handleDateClickForEvent,
    onReset: handleReset, themeColor,
    customEvents: allEvents, onAddCustomEvent: handleAddCustomEvent,
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

  const currentMonthImage = MONTH_IMAGES[currentMonth.getMonth()];

  const renderCalendarPage = (monthDate, themeCol, hLabel, cImage, overlayType) => {
    const isOverlay = !!overlayType;
    const props = isOverlay 
      ? { ...calendarProps, currentMonth: monthDate, themeColor: themeCol } 
      : calendarProps;

    return (
      <div 
        className={`calendar-page ${isOverlay ? 'page-flipper ' + overlayType : ''}`}
        style={isOverlay ? { '--theme-color': themeCol } : {}}
      >
        {/* ── HERO IMAGE SECTION ──────────────────────────────────────── */}
        <div className="calendar-hero">
          <img
            src={cImage}
            alt={format(monthDate, 'MMMM')}
            className="calendar-hero__image"
            draggable={false}
          />
          <div className="calendar-hero__overlay" />
          <div className="calendar-hero__badge">
            <span className="calendar-hero__badge-month">
              {monthDate.toLocaleString('default', { month: 'long' })}
            </span>
            <span className="calendar-hero__badge-year">
              {monthDate.getFullYear()}
            </span>
          </div>
          <span className="calendar-hero__credit">{hLabel}</span>
        </div>

        {/* ── CALENDAR BODY ───────────────────────────────────────────── */}
        <div className="calendar-body">
          <aside className="calendar-body__sidebar" aria-label="Notes panel">
            <SidebarPanel {...props} />
          </aside>
          <div className="calendar-body__main" aria-label="Calendar grid panel">
            <CalendarHeader {...props} />
            <hr className="calendar-body__rule" />
            <CalendarGrid {...props} />
          </div>
          <aside className="calendar-body__sidebar" aria-label="Yearly events panel">
            <YearlyEventsPanel
              customEvents={props.customEvents}
              themeColor={props.themeColor}
              currentMonth={props.currentMonth}
              onEventClick={handleEventClick}
              onDeleteEvent={handleDeleteEvent}
            />
          </aside>
        </div>
      </div>
    );
  };

  return (
    <div
      className="app-wrapper"
      id="calendar-app"
      style={{ '--bg-image': `url(${currentMonthImage})` }}
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

        <div className="calendar-page-container">
          {/* Current (New) Static Page */}
          {renderCalendarPage(currentMonth, themeColor, heroLabel, currentMonthImage, null)}

          {/* Flipping Animated Page (Overlay) */}
          {flipAnimation &&
            renderCalendarPage(
              flipAnimation.data.monthDate,
              flipAnimation.data.themeColor,
              flipAnimation.data.heroLabel,
              flipAnimation.data.image,
              flipAnimation.type
            )
          }
        </div>

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
