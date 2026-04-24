import React, { useRef, useEffect } from 'react';
import '../EventModal/EventModal.scss'; // Reuse the exact same frosted glass CSS

export default function ReminderModal({ event, onClose }) {
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

  if (!event) return null;

  return (
    <div className="event-modal-overlay" style={{ zIndex: 9999 }}>
      <div className="event-modal" ref={modalRef}>
        <h3 className="event-modal__title">⏰ Event Reminder</h3>
        
        <div style={{ padding: '25px 0', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px', fontWeight: '600' }}>{event.title}</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.85 }}>
            Scheduled for {event.time}
          </p>
        </div>

        <div className="event-modal__actions" style={{ marginTop: '10px' }}>
          <button 
            type="button" 
            className="event-modal__btn event-modal__btn--save" 
            onClick={onClose}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
