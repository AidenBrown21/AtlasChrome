// src/components/Notification/Notification.js

import React from 'react';
import './Notification.css';

function Notification({ message, visible }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`notification ${visible ? 'show' : ''}`}>
      ✅ {message}
    </div>
  );
}

export default Notification;