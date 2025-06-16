// src/components/Notification/Notification.js

import React from 'react';
import './Notification.css';

function Notification({ message, type, visible }) {
  if (!message) {
    return null;
  }

  // Define icons for each notification type
  const iconMap = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    // We add the 'type' as a class name here
    <div className={`notification ${type} ${visible ? 'show' : ''}`}>
      {iconMap[type] || 'ℹ️'} {message}
    </div>
  );
}

export default Notification;