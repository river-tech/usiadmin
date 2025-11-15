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

  const normalizeMessage = (msg: unknown): string => {
    if (msg == null) return '';
    if (typeof msg === 'string') return msg;
    // try common error shapes
    if (typeof msg === 'object') {
      const candidate = (msg as { detail?: unknown; message?: unknown; msg?: unknown });
      const detail =
        (typeof candidate.detail === 'string' && candidate.detail) ||
        (typeof candidate.message === 'string' && candidate.message) ||
        (typeof candidate.msg === 'string' && candidate.msg);
      if (detail) {
        return detail;
      }
    }
    try {
      return JSON.stringify(msg);
    } catch {
      return String(msg);
    }
  };

  const showAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Date.now().toString();
    const newAlert: Alert = {
      id,
      type: alert.type,
      title: String(alert.title ?? ''),
      message: normalizeMessage(alert.message),
      duration: alert.duration,
    };
    
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

  const showError = (title: string, message: unknown, duration?: number) => {
    showAlert({ type: 'error', title, message: normalizeMessage(message), duration });
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
