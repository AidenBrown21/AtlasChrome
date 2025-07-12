// src/context/AppContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  // --- Theme Management ---
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const newColor = theme === 'light' ? '#EDEDED' : '#1e1e1e';
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', newColor);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Notification Management ---
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.visible]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, visible: true });
  };


  // --- Value provided to all components ---
  const value = {
    theme,
    toggleTheme,
    notification,
    showNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);