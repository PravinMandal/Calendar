import React, { useState } from 'react';
import './EventModal.scss';

export default function EventModal({ onClose, onSave, initialDate = '' }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    
    onSave({
      id: Date.now().toString(),
      title,
      date // standard YYYY-MM-DD
    });
    onClose();
  };

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
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
