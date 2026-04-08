import React, { useState, useRef, useEffect } from 'react';
import './EventModal.scss';

export default function EventModal({ onClose, onSave, initialDate = '' }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    
    onSave({
      id: Date.now().toString(),
      title,
      date, 
      type: 'user',
      isRecurring
    });
    onClose();
  };

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="event-modal-overlay">
      <div className="event-modal" ref={modalRef}>
        <h3 className="event-modal__title">Add Custom Event</h3>
        
        <form onSubmit={handleSave} className="event-modal__form">
          <div className="event-modal__field">
            <label htmlFor="event-date">Date</label>
            <input 
              type="date" 
              id="event-date"
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="event-modal__field">
            <label htmlFor="event-title">Event Name</label>
            <input 
              type="text" 
              id="event-title"
              placeholder="E.g., Team Meeting, Birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              maxLength={50}
              required
            />
          </div>

          <div className="event-modal__field event-modal__field--row">
            <label className="event-modal__toggle-label">
              <input 
                type="checkbox" 
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="event-modal__checkbox"
              />
              <span className="event-modal__toggle-text">Repeat Every Year</span>
            </label>
          </div>

          <div className="event-modal__actions">
            <button type="button" className="event-modal__btn event-modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="event-modal__btn event-modal__btn--save">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
