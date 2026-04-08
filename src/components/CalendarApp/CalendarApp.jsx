import React, { useState, useEffect } from 'react'
import { isValid, startOfMonth, format } from 'date-fns'
import SidebarPanel from '../SidebarPanel/SidebarPanel'
import YearlyEventsPanel from '../YearlyEventsPanel/YearlyEventsPanel'
import CalendarHeader from '../CalendarHeader/CalendarHeader'
import CalendarGrid from '../CalendarGrid/CalendarGrid'
import EventModal from '../EventModal/EventModal'
import './CalendarApp.scss'

const INDIAN_EVENTS = [
  { id: 'ind-1', title: 'Republic Day', date: '01-26', type: 'national', isRecurring: true },
  { id: 'ind-2', title: 'Independence Day', date: '08-15', type: 'national', isRecurring: true },
  { id: 'ind-3', title: 'Gandhi Jayanti', date: '10-02', type: 'national', isRecurring: true },
  { id: 'ind-9', title: 'Holi', date: '03-14', type: 'national', isRecurring: true },
  { id: 'ind-10', title: 'Ambedkar Jayanti', date: '04-14', type: 'national', isRecurring: true },
  { id: 'ind-12', title: 'Dussehra', date: '10-12', type: 'national', isRecurring: true },
  { id: 'ind-13', title: 'Diwali', date: '11-01', type: 'national', isRecurring: true },

  { id: 'ind-4', title: 'New Year', date: '01-01', type: 'observance', isRecurring: true },
  { id: 'ind-5', title: "Valentine's Day", date: '02-14', type: 'observance', isRecurring: true },
  { id: 'ind-6', title: 'May Day', date: '05-01', type: 'observance', isRecurring: true },
  { id: 'ind-11', title: 'Yoga Day', date: '06-21', type: 'observance', isRecurring: true },
  { id: 'ind-7', title: 'Teachers Day', date: '09-05', type: 'observance', isRecurring: true },
  { id: 'ind-14', title: "Children's Day", date: '11-14', type: 'observance', isRecurring: true },
  { id: 'ind-8', title: 'Christmas', date: '12-25', type: 'observance', isRecurring: true }
];

const MONTH_IMAGES = [
  '/images/jan_bg.jpg',
  '/images/feb_bg.jpg',
  '/images/mar_bg.jpg',
  '/images/apr_bg.jpg',
  '/images/may_bg.jpg',
  '/images/jun_bg.jpg',
  '/images/jul_bg.jpg',
  '/images/aug_bg.jpg',
  '/images/sep_bg.jpg',
  '/images/oct_bg.jpg',
  '/images/nov_bg.jpg',
  '/images/dec_bg.jpg'
];

const MONTHLY_THEMES = [
  { url: 'https://picsum.photos/seed/january/900/400', color: '#77c9f0ff'},
  { url: 'https://picsum.photos/seed/february/900/400', color: '#2ca617ff'},
  { url: 'https://picsum.photos/seed/forest22/900/400', color: '#e479d1ff'},
  { url: 'https://picsum.photos/seed/dusk99/900/400', color: '#f8d94dff'},
  { url: 'https://picsum.photos/seed/blossom5/900/400', color: '#48b8ecff'},
  { url: 'https://picsum.photos/seed/golden7/900/400', color: '#eea527ff'},
  { url: 'https://picsum.photos/seed/ocean14/900/400', color: '#06b6d4'},
  { url: 'https://picsum.photos/seed/autumn8/900/400', color: '#42b6f4ff'},
  { url: 'https://picsum.photos/seed/hills33/900/400', color: '#20bfdbff'},
  { url: 'https://picsum.photos/seed/winter6/900/400', color: '#e3d025ff'},
  { url: 'https://picsum.photos/seed/peaks11/900/400', color: '#bef6f3ff'},
  { url: 'https://picsum.photos/seed/snow42/900/400', color: '#9fd7faff'},
]

function CalendarApp() {
  const today = new Date()

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

  const handleMonthChange = (newDate) => {
    if (newDate.getTime() === currentMonth.getTime()) return;
    if (flipAnimation) return;

    const isNext = newDate > currentMonth;
    const newIdx = newDate.getMonth();
    const newTheme = MONTHLY_THEMES[newIdx];

    setSelectionStart(null);
    setSelectionEnd(null);
    setIsSelectingMode(false);
    setSelectedDate(startOfMonth(newDate));

    if (isNext) {

      setFlipAnimation({
        type: 'tear-off',
        data: {
          monthDate: currentMonth,
          themeColor: themeColor,
          heroLabel: heroLabel,
          image: MONTH_IMAGES[currentMonth.getMonth()]
        }
      });

      setCurrentMonth(newDate);
      setThemeColor(newTheme.color);
      setHeroUrl(newTheme.url);
      setHeroLabel(newTheme.label);

      setTimeout(() => {
        setFlipAnimation(null);
      }, 800);
    } else {

      setFlipAnimation({
        type: 'reattach',
        data: {
          monthDate: newDate,
          themeColor: newTheme.color,
          heroLabel: newTheme.label,
          image: MONTH_IMAGES[newIdx]
        }
      });

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
      let month, day;
      if (typeof event.date === 'string' && event.date.length === 5 && event.date.includes('-')) {
        [month, day] = event.date.split('-');
      } else {
        const d = new Date(event.date);
        month = d.getMonth() + 1;
        day = d.getDate();
      }
      targetDate = new Date(viewedYear, parseInt(month) - 1, parseInt(day));
    } else {
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
      return ev.title !== eventToDelete.name; 
    });
    setCustomEvents(updatedEvents);
    localStorage.setItem('calendar-custom-events', JSON.stringify(updatedEvents));
  };

  const allEvents = [...INDIAN_EVENTS, ...customEvents];

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
        {}
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

        {}
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

      <div
        className={`wall-calendar ${flipAnimation ? 'is-animating' : ''}`}
        style={{ '--theme-color': themeColor }}
        role="application"
        aria-label="Interactive Wall Calendar"
      >

        {}
        <div className="spiral-binding" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="spiral-binding__ring">
              <div className="spiral-binding__hole" />
            </div>
          ))}
        </div>

        <div className="calendar-page-container">
          {}
          {renderCalendarPage(currentMonth, themeColor, heroLabel, currentMonthImage, null)}

          {}
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
      {}

    </div>
  )
}

export default CalendarApp
