import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  appTitle = 'AL-FARAH-CONSTRUCTION-AND-GENERAL-TRANSPORT';
  userName = 'Hassan Ahmed';
  userEmail = 'hassan.ahmed@example.com';
  userInitials = 'HA';
  
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  isNotificationOpen = false;
  notificationCount = 0;
  notifications: Notification[] = [];
  recentNotifications: Notification[] = [];

  constructor(
    public router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Initialize user data - in a real app, this would come from a service
    this.setUserInitials();
    this.loadNotifications();
  }

  private setUserInitials() {
    const names = this.userName.split(' ');
    this.userInitials = names.map(name => name.charAt(0).toUpperCase()).join('');
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    // Close mobile menu and notification if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    if (this.isNotificationOpen) {
      this.isNotificationOpen = false;
    }
  }

  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    // Close mobile menu and dropdown if open
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Close dropdown and notification if open
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    if (this.isNotificationOpen) {
      this.isNotificationOpen = false;
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const userMenuButton = document.getElementById('user-menu-button');
    const notificationButton = document.getElementById('notification-button');
    
    // Check if click is outside the dropdown
    if (userMenuButton && !userMenuButton.contains(target) && !target.closest('.absolute')) {
      this.isDropdownOpen = false;
    }
    
    // Check if click is outside the notification dropdown
    if (notificationButton && !notificationButton.contains(target) && !target.closest('.notification-dropdown')) {
      this.isNotificationOpen = false;
    }
  }

  // Close menus on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.isNotificationOpen = false;
  }

  private loadNotifications() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      this.notificationCount = this.notifications.filter(n => !n.read).length;
      // Get recent 5 notifications for dropdown
      this.recentNotifications = this.notifications.slice(0, 5);
    });
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
      this.loadNotifications();
    }
  }

  viewNotificationDetails(notification: Notification) {
    // Set the selected notification in service
    this.notificationService.setSelectedNotification(notification);
    // Mark as read
    this.markAsRead(notification);
    // Close notification dropdown
    this.isNotificationOpen = false;
    // Navigate to notifications page
    this.router.navigate(['/notifications']);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'error': return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'info': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
