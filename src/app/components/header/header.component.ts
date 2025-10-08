import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

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

  constructor(
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Initialize user data - in a real app, this would come from a service
    this.setUserInitials();
    this.loadNotificationCount();
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

  private loadNotificationCount() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notificationCount = notifications.filter(n => !n.read).length;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
