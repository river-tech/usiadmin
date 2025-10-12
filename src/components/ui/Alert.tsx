"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertProps {
  alert: {
    id: string;
    type: 'success' | 'error';
    title: string;
    message: string;
  };
}

export function Alert({ alert }: AlertProps) {
  const { hideAlert } = useAlert();

  const getIcon = () => {
    switch (alert.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    switch (alert.type) {
      case 'success':
        return "bg-green-50 border-green-200 text-green-800";
      case 'error':
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full duration-300",
        getStyles()
      )}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{alert.title}</h4>
        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => hideAlert(alert.id)}
        className="h-6 w-6 p-0 hover:bg-black/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AlertContainer() {
  const { alerts } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
