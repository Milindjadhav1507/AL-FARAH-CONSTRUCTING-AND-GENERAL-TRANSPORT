import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule,],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  viewMode: 'list' | 'timeline' = 'list';
  selectedFilter: string = 'all';
  selectedType: string = 'all';
  searchTerm: string = '';
  showDeleteConfirm: boolean = false;
  notificationToDelete: string | null = null;
  isLoading: boolean = true;
  unreadCount: number = 0;
  selectedNotification: Notification | null = null;
  showDetailsModal: boolean = false;
  
  filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];
  
  typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'info', label: 'Information' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  categories = ['Fleet Management', 'Maintenance', 'Driver Management', 'Reports', 'Operations', 'Insurance'];

  constructor(
    private notificationService: NotificationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadNotifications();
    // Listen for selected notification from header
    this.notificationService.selectedNotification$.subscribe(notification => {
      if (notification) {
        this.showNotificationDetails(notification);
        // Clear the selected notification after showing
        setTimeout(() => {
          this.notificationService.setSelectedNotification(null);
        }, 100);
      }
    });
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      this.unreadCount = this.notifications.filter(n => !n.read).length;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters() {
    let filtered = [...this.notifications];

    // Filter by read status
    if (this.selectedFilter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (this.selectedFilter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Filter by type
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === this.selectedType);
    }

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        n.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredNotifications = filtered;
  }

  setViewMode(mode: 'list' | 'timeline') {
    this.viewMode = mode;
  }

  markAsRead(notification: Notification) {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
      this.loadNotifications();
      
      // Show success toast
      this.toastService.success('Notification marked as read!');
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.loadNotifications();
    
    // Show success toast
    this.toastService.success('All notifications marked as read!');
  }

  confirmDelete(notificationId: string) {
    this.notificationToDelete = notificationId;
    this.showDeleteConfirm = true;
  }

  deleteNotification() {
    if (this.notificationToDelete) {
      this.notificationService.deleteNotification(this.notificationToDelete);
      this.loadNotifications();
      this.cancelDelete();
      
      // Show success toast
      this.toastService.success('Notification deleted successfully!');
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.notificationToDelete = null;
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
      case 'info': return 'text-blue-500 bg-blue-100';
      case 'success': return 'text-green-500 bg-green-100';
      case 'warning': return 'text-yellow-500 bg-yellow-100';
      case 'error': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
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

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.applyFilters();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showDeleteConfirm) {
      this.cancelDelete();
    }
    if (this.showDetailsModal) {
      this.closeDetailsModal();
    }
  }

  showNotificationDetails(notification: Notification) {
    this.selectedNotification = notification;
    this.showDetailsModal = true;
    // Auto mark as read when viewing details
    if (!notification.read) {
      this.markAsRead(notification);
    }
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedNotification = null;
  }
}
