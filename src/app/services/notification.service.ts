import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  detailedMessage?: string;
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
      message: 'Vehicle #AF-001 has been assigned to your fleet',
      detailedMessage: 'A new vehicle has been successfully assigned to your fleet. Vehicle Details: Vehicle Number: AF-001, Make: Toyota, Model: Hilux, Year: 2025, Registration: UAE-ABC-001, Type: Double Cabin Pickup (5 Seater), Fuel Type: Diesel, Current Status: Available. The vehicle has been inspected and is in excellent condition with all necessary documentation completed. Ready for driver assignment.',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      type: 'info',
      read: false,
      category: 'Fleet Management'
    },
    {
      id: '2',
      title: 'Maintenance scheduled',
      message: 'Vehicle #AF-003 maintenance is scheduled for tomorrow',
      detailedMessage: 'Regular maintenance has been scheduled for Vehicle #AF-003. Vehicle Details: Make: Volvo, Model: FMX, Year: 2025, Registration: UAE-DEF-003, Type: Heavy Truck, Current Status: Maintenance, Assigned Driver: Ahmed Hassan (License: CDL-12345, Phone: +971-50-1234567). Maintenance includes: Oil change, brake inspection, tire rotation, and general vehicle health check. Scheduled for tomorrow at 9:00 AM. Bring vehicle to Service Center by 8:30 AM. Estimated completion: 2-3 hours.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      type: 'success',
      read: false,
      category: 'Maintenance'
    },
    {
      id: '3',
      title: 'Driver update',
      message: 'Driver Ahmed has updated his availability',
      detailedMessage: 'Driver Ahmed Hassan has updated his work availability schedule. Driver Details: ID: DR-001, License Number: CDL-12345, Phone: +971-50-1234567, Current Status: On Duty, Currently assigned to: Vehicle AF-003 (Volvo FMX). New Schedule: Available for night shifts (6 PM - 6 AM) starting next week. This change affects 3 scheduled routes: Route 1 (Construction Site 1 to Camp A), Route 2 (Material Yard to Site 2), Route 3 (Equipment Depot to Site 3). Please review the driver roster and update route assignments accordingly.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      type: 'warning',
      read: false,
      category: 'Driver Management'
    },
    {
      id: '4',
      title: 'Fuel expense report',
      message: 'Vehicle AF-007 monthly fuel expense report is ready',
      detailedMessage: 'The monthly fuel expense report for Vehicle AF-007 (Scania P-Series) for October 2025 is now available for review. Vehicle Details: Vehicle Number: AF-007, Make: Scania, Model: P-Series, Year: 2025, Registration: UAE-GHI-007, Type: Heavy Truck, Current Driver: Hassan Ali (DR-008), Phone: +971-50-5555555. Fuel Consumption Summary: Total Fuel Used: 1,850 liters, Total Cost: AED 5,550, Average Efficiency: 8.5 km/L, Distance Covered: 15,725 km, Cost per Kilometer: AED 0.35. Comparison with September: 8% increase due to extended construction site routes. Route Details: Primary Route (Construction Site 1 to Material Yard) - 45%, Secondary Route (Equipment Depot to Site 2) - 35%, Emergency/Ad-hoc Routes - 20%. Please review and approve for accounting purposes.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      type: 'info',
      read: true,
      category: 'Reports'
    },
    {
      id: '6',
      title: 'New driver onboarded',
      message: 'Driver Muhammad Ali has been added to the system',
      detailedMessage: 'New driver Muhammad Ali Khan has been successfully onboarded to the system. Driver Details: ID: DR-006, License Number: CDL-67890, Phone: +971-50-9876543, Status: Available, Experience: 5 years commercial driving. He holds a valid commercial driving license (CDL) and has completed all required safety training including: Defensive Driving Course, Vehicle Inspection Training, Emergency Response Training. He is available for immediate assignment and has been added to the active driver roster. Recommended for: Station Wagon, Mini Bus, and 3 Ton Pickup assignments. Please assign initial routes and ensure vehicle handover procedures are completed.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      type: 'success',
      read: true,
      category: 'Driver Management'
    },
    {
      id: '8',
      title: 'Insurance renewal required',
      message: 'Vehicle AF-007 insurance expires in 30 days',
      detailedMessage: 'URGENT INSURANCE RENEWAL REQUIRED: Vehicle AF-007 (Scania P-Series) insurance policy is approaching expiration and requires immediate attention. This vehicle must maintain valid insurance coverage to remain operational. Failure to renew on time will result in vehicle being taken off-road until coverage is restored, causing operational disruption and potential fines from RTA.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      type: 'warning',
      read: true,
      category: 'Insurance'
    },
    {
      id: '9',
      title: 'Driver license expired today',
      message: 'Driver Hassan Ali\'s license has expired today',
      detailedMessage: 'URGENT: Driver Hassan Ali\'s commercial driving license (CDL-54321) has expired today (October 10, 2025). Driver Details: ID: DR-008, Phone: +971-50-5555555, Currently assigned to: AF-009 (Caterpillar 320D). This driver is NOT authorized to operate any vehicles until license renewal is completed. Please immediately reassign vehicle AF-009 to another qualified driver and arrange license renewal. Contact RTA at +971-4-800-9000 for renewal process.',
      timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
      type: 'error',
      read: false,
      category: 'Driver Management'
    },
    {
      id: '10',
      title: 'Driver license expiring soon',
      message: 'Driver Ali Ahmed\'s license expires in 3 days',
      detailedMessage: 'Driver Ali Ahmed\'s commercial driving license (CDL-98765) will expire on October 13, 2025 (3 days from now). Driver Details: ID: DR-009, Phone: +971-50-6666666, Currently assigned to: AF-015 (JCB 3CX). License renewal process should be initiated immediately to avoid service disruption. Please contact RTA at +971-4-800-9000 or visit nearest RTA center for renewal. Required documents: Current license, Emirates ID, medical certificate.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      type: 'warning',
      read: false,
      category: 'Driver Management'
    }
  ]);

  public notifications$ = this.notificationsSubject.asObservable();
  
  private selectedNotificationSubject = new BehaviorSubject<Notification | null>(null);
  public selectedNotification$ = this.selectedNotificationSubject.asObservable();

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

  setSelectedNotification(notification: Notification | null): void {
    this.selectedNotificationSubject.next(notification);
  }
}
