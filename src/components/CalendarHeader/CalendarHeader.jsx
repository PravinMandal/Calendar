import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { subMonths, addMonths, format, setMonth, setYear } from 'date-fns';
import './CalendarHeader.scss';

export default function CalendarHeader({ currentMonth, onMonthChange }) {
  const [isJumpOpen, setIsJumpOpen] = useState(false);

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const handleJumpMonth = (e) => {
    onMonthChange(setMonth(currentMonth, parseInt(e.target.value)));
  };

  const handleJumpYear = (e) => {
    onMonthChange(setYear(currentMonth, parseInt(e.target.value)));
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2026, i, 1);
    return { value: i, label: format(date, 'MMMM') };
  });

  const years = Array.from({ length: 30 }, (_, i) => 2010 + i);

  return (
    <div className="calendar-header">
      <div className="calendar-header__nav">
        <button 
          className="calendar-header__nav-btn" 
          onClick={handlePrevMonth}
          aria-label="Previous Month"
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          className="calendar-header__nav-btn" 
          onClick={handleNextMonth}
          aria-label="Next Month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendar-header__title">
        <span className="calendar-header__month">{format(currentMonth, 'MMMM')}</span>
        <span className="calendar-header__year">{format(currentMonth, 'yyyy')}</span>
        
        <div className="calendar-header__jump-container">
          <button 
            className={`calendar-header__jump-btn ${isJumpOpen ? 'active' : ''}`}
            onClick={() => setIsJumpOpen(!isJumpOpen)}
            aria-label="Jump to date"
          >
            <CalendarIcon size={16} />
          </button>
          
          {isJumpOpen && (
            <div className="calendar-header__jump-dropdown">
              <select 
                value={currentMonth.getMonth()} 
                onChange={handleJumpMonth}
                className="calendar-header__jump-select"
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select 
                value={currentMonth.getFullYear()} 
                onChange={handleJumpYear}
                className="calendar-header__jump-select"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
