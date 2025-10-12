"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Alert {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (alert: Omit<Alert, 'id'>) => void;
  hideAlert: (id: string) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Date.now().toString();
    const newAlert = { ...alert, id };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto hide after duration (default 5 seconds)
    const duration = alert.duration || 5000;
    setTimeout(() => {
      hideAlert(id);
    }, duration);
  };

  const hideAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    showAlert({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    showAlert({ type: 'error', title, message, duration });
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, hideAlert, showSuccess, showError }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
