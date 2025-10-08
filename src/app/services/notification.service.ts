import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([
    {
      id: '1',
      title: 'New vehicle assigned',
      message: 'Vehicle #VH001 has been assigned to your fleet',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      type: 'info',
      read: false,
      category: 'Fleet Management'
    },
    {
      id: '2',
      title: 'Maintenance scheduled',
      message: 'Vehicle #VH003 maintenance is scheduled for tomorrow',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      type: 'success',
      read: false,
      category: 'Maintenance'
    },
    {
      id: '3',
      title: 'Driver update',
      message: 'Driver Ahmed has updated his availability',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      type: 'warning',
      read: false,
      category: 'Driver Management'
    },
    {
      id: '4',
      title: 'Fuel expense report',
      message: 'Monthly fuel expense report is ready for review',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      type: 'info',
      read: true,
      category: 'Reports'
    },
    {
      id: '5',
      title: 'Vehicle inspection due',
      message: 'Vehicle #VH005 requires inspection within 3 days',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      type: 'error',
      read: true,
      category: 'Maintenance'
    },
    {
      id: '6',
      title: 'New driver onboarded',
      message: 'Driver Muhammad Ali has been added to the system',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      type: 'success',
      read: true,
      category: 'Driver Management'
    },
    {
      id: '7',
      title: 'Route optimization',
      message: 'Route optimization suggestions available for review',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      type: 'info',
      read: true,
      category: 'Operations'
    },
    {
      id: '8',
      title: 'Insurance renewal',
      message: 'Vehicle insurance for 5 vehicles expires in 30 days',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      type: 'warning',
      read: true,
      category: 'Insurance'
    }
  ]);

  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.read).length;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next([...notifications]);
    }
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => n.read = true);
    this.notificationsSubject.next([...notifications]);
  }

  deleteNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
  }

  getNotificationsByType(type: string): Notification[] {
    return this.notificationsSubject.value.filter(n => n.category === type);
  }

  getNotificationsByDateRange(startDate: Date, endDate: Date): Notification[] {
    return this.notificationsSubject.value.filter(n => 
      n.timestamp >= startDate && n.timestamp <= endDate
    );
  }
}
