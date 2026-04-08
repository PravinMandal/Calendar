import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { subMonths, addMonths, format, setMonth, setYear } from 'date-fns';
import './CalendarHeader.scss';

export default function CalendarHeader({ currentMonth, onMonthChange, onToday }) {
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsJumpOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  const handleJumpMonth = (val) => {
    onMonthChange(setMonth(currentMonth, val));
  };

  const handleJumpYear = (val) => {
    onMonthChange(setYear(currentMonth, val));
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

      <button className="today-btn" onClick={onToday}>
        Today
      </button>

      <div className="calendar-header__title">
        <span className="calendar-header__month">{format(currentMonth, 'MMMM')}</span>
        <span className="calendar-header__year">{format(currentMonth, 'yyyy')}</span>
        
        <div className="calendar-header__jump-container" ref={dropdownRef}>
          <button 
            className={`calendar-header__jump-btn ${isJumpOpen ? 'active' : ''}`}
            onClick={() => setIsJumpOpen(!isJumpOpen)}
            aria-label="Jump to date"
          >
            <CalendarIcon size={16} />
          </button>
          
          {isJumpOpen && (
            <div className="calendar-header__jump-dropdown">
              
              <div className="custom-dropdown">
                <div 
                  className="custom-dropdown__trigger"
                  onClick={() => setOpenMenu(openMenu === 'month' ? null : 'month')}
                >
                  {format(currentMonth, 'MMMM')}
                </div>
                {openMenu === 'month' && (
                  <ul className="custom-dropdown__menu">
                    {months.map(m => (
                      <li 
                        key={m.value}
                        className={currentMonth.getMonth() === m.value ? 'selected' : ''}
                        onClick={() => { handleJumpMonth(m.value); setOpenMenu(null); setIsJumpOpen(false); }}
                      >
                        {m.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="custom-dropdown">
                <div 
                  className="custom-dropdown__trigger"
                  onClick={() => setOpenMenu(openMenu === 'year' ? null : 'year')}
                >
                  {currentMonth.getFullYear()}
                </div>
                {openMenu === 'year' && (
                  <ul className="custom-dropdown__menu year-menu">
                    {years.map(y => (
                      <li 
                        key={y}
                        className={currentMonth.getFullYear() === y ? 'selected' : ''}
                        onClick={() => { handleJumpYear(y); setOpenMenu(null); setIsJumpOpen(false); }}
                      >
                        {y}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
