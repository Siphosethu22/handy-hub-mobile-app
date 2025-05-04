
import React, { createContext, useState, useContext, useEffect } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: "job" | "system" | "payment";
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from local storage on initial load
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error("Failed to parse notifications from localStorage", error);
      }
    } else {
      // Add initial demo notifications
      const initialNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to HandyHub",
          message: "Thank you for joining us! Start exploring services around you.",
          read: false,
          timestamp: new Date().toISOString(),
          type: "system"
        },
        {
          id: "2",
          title: "New Plumber Available",
          message: "A new plumber joined in your area. Check their profile!",
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "job"
        }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem("notifications", JSON.stringify(initialNotifications));
    }
  }, []);

  // Save notifications to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
