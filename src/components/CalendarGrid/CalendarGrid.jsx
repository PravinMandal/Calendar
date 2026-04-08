import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  isWithinInterval,
  isBefore,
  format,
  differenceInDays,
  isValid
} from 'date-fns';
import { getHolidaysForDate } from '../../utils/holidays';
import './CalendarGrid.scss';

export default function CalendarGrid({
  currentMonth,
  selectionStart,
  selectionEnd,
  hoverDate,
  setSelectionStart,
  setSelectionEnd,
  setHoverDate,
  selectedDate,
  setSelectedDate,
  isSelectingMode,
  setIsSelectingMode,
  themeColor,
  customEvents = []
}) {
  const safeIsSameDay = (dateLeft, dateRight) => {
    if (!dateLeft || !dateRight || !isValid(new Date(dateLeft)) || !isValid(new Date(dateRight))) return false;
    try { return isSameDay(dateLeft, dateRight); } catch (e) { return false; }
  };

  const safeIsSameMonth = (dateLeft, dateRight) => {
    if (!dateLeft || !dateRight || !isValid(new Date(dateLeft)) || !isValid(new Date(dateRight))) return false;
    try { return isSameMonth(dateLeft, dateRight); } catch (e) { return false; }
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); 
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  let gridDays = [];
  try {
    gridDays = eachDayOfInterval({
      start: gridStart,
      end: gridEnd
    });
  } catch (err) {
    gridDays = [];
  }

  const isSelectedStart = (date) => selectionStart && safeIsSameDay(date, selectionStart);
  const isSelectedEnd = (date) => selectionEnd && safeIsSameDay(date, selectionEnd);
  
  const isSelected = (date) => isSelectedStart(date) || isSelectedEnd(date);
  const isSelectedRange = (date) => {
    try {
      if (!selectionStart || !selectionEnd || !isValid(new Date(selectionStart)) || !isValid(new Date(selectionEnd))) return false;
      const start = isBefore(selectionStart, selectionEnd) ? selectionStart : selectionEnd;
      const end = isBefore(selectionStart, selectionEnd) ? selectionEnd : selectionStart;
      return isWithinInterval(date, { start, end }) 
             && !safeIsSameDay(date, start) 
             && !safeIsSameDay(date, end);
    } catch (error) {
      return false; 
    }
  };

  const calculateSelectedDays = () => {
    if (selectionStart && selectionEnd && isValid(selectionStart) && isValid(selectionEnd)) {
      return Math.abs(differenceInDays(selectionEnd, selectionStart)) + 1;
    }
    return 0;
  };

  const selectedDaysCount = calculateSelectedDays();

  return (
    <div className="calendar-grid">
      {}
      <div className="calendar-grid__weekdays">
        {weekDays.map(day => (
          <div key={day} className="calendar-grid__weekday-label">
            {day}
          </div>
        ))}
      </div>

      {}
      <div className="calendar-grid__days" onMouseLeave={() => setHoverDate(null)}>
        {gridDays.map((date) => {
          const isCurrentMonth = safeIsSameMonth(date, currentMonth);
          const isDayToday = isToday(date);
          const isStart = isSelectedStart(date);
          const isEnd = isSelectedEnd(date);
          const inRange = isSelectedRange(date);
          const isSingleSelected = isSelected(date);
          const isSingleSelectedDate = selectedDate && safeIsSameDay(date, selectedDate);

          let classNames = 'calendar-grid__day';
          if (!isCurrentMonth) classNames += ' calendar-grid__day--outside';
          if (isDayToday) classNames += ' calendar-grid__day--today';
          if (isSingleSelected) classNames += ' calendar-grid__day--selected';
          if (isSingleSelectedDate) classNames += ' calendar-grid__day--selected-single';
          if (inRange) classNames += ' calendar-grid__day--in-range';
          if (isStart && selectionEnd) classNames += ' calendar-grid__day--range-start';
          if (isEnd) classNames += ' calendar-grid__day--range-end';

          const getEventsForDay = (day) => {
            const dayEvents = [];

            customEvents.forEach(event => {
              if (event.isRecurring) {
                const evMMdd = format(new Date(event.date), 'MM-dd');
                const dayMMdd = format(day, 'MM-dd');
                if (evMMdd === dayMMdd || event.date === dayMMdd) {
                  dayEvents.push(event);
                }
              } else {
                if (safeIsSameDay(day, new Date(event.date))) {
                  dayEvents.push(event);
                }
              }
            });

            return dayEvents;
          };

          const allEvents = getEventsForDay(date);
          const handleDateInteraction = (e) => {
            if (!isCurrentMonth) return;
            clearTimeout(window._clickTimer);

            if (e.detail === 1) {
              window._clickTimer = setTimeout(() => {
                if (isSelectingMode) {
                  setIsSelectingMode(false); 
                } else {
                  setSelectionStart(null);
                  setSelectionEnd(null);
                  setSelectedDate(date);
                }
              }, 250);
            } else if (e.detail === 2) {
              setIsSelectingMode(true);
              setSelectionStart(date);
              setSelectionEnd(null);
              setSelectedDate(null);
              setHoverDate(null);
            }
          };

          const handleMouseEnter = () => {
            if (!isCurrentMonth) return;
            if (isSelectingMode) {
              setSelectionEnd(date);
            } else if (selectionStart && !selectionEnd) {
              setHoverDate(date);
            }
          };

          return (
            <div 
              key={date.toString()}
              className={classNames}
              onClick={handleDateInteraction}
              onMouseEnter={handleMouseEnter}
            >
              <span className="calendar-grid__day-number">
                {format(date, 'd')}
              </span>
              
              <div className="event-dots-container">
                {allEvents.map((ev, i) => (
                  <span key={i} className={`event-dot dot-${ev.type}`} title={ev.title}></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {}
      {selectedDaysCount > 0 && (
        <div className="calendar-grid__range-badge">
          {selectedDaysCount} day{selectedDaysCount !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
