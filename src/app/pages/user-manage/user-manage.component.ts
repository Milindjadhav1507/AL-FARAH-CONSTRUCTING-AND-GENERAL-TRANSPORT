import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  joinDate: Date;
  lastLogin?: Date;
  permissions: string[];
  // Additional detailed information
  nationality?: string;
  emiratesID?: string;
  dateOfBirth?: Date;
  address?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  manager?: string;
  employeeID?: string;
  workLocation?: string;
  contractType?: 'Permanent' | 'Contract' | 'Temporary';
  salary?: number;
  bankAccount?: string;
  bankName?: string;
  visaStatus?: string;
  visaExpiry?: Date;
  passportNumber?: string;
  passportExpiry?: Date;
}

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.css'
})
export class UserManageComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100];

  // Modal States
  showAddEditModal: boolean = false;
  showDetailsModal: boolean = false;
  isEditMode: boolean = false;
  selectedUser: User | null = null;

  // Form Data
  newUser: Partial<User> = {};

  // Master Data
  roles: string[] = ['Admin', 'Manager', 'Supervisor', 'Operator', 'Accountant', 'HR', 'Mechanic'];
  departments: string[] = ['Administration', 'Operations', 'Finance', 'HR', 'Maintenance', 'Logistics', 'IT'];
  statuses: Array<'Active' | 'Inactive' | 'Suspended'> = ['Active', 'Inactive', 'Suspended'];
  allPermissions: string[] = [
    'View Dashboard',
    'Manage Vehicles',
    'Manage Drivers',
    'Manage Users',
    'Manage Routes',
    'View Reports',
    'Manage Fuel',
    'Manage Maintenance',
    'Manage Finance',
    'System Settings'
  ];

  // Expose Math to template
  Math = Math;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.generateUsers();
    this.filteredUsers = [...this.users];
  }

  // Generate sample users
  generateUsers(): void {
    const firstNames = ['Salman', 'Shah Rukh', 'Aamir', 'Akshay', 'Hrithik', 'Ranbir', 'Ranveer', 'Ajay', 'Saif Ali', 'Varun'];
    const lastNames = ['Khan', 'Kumar', 'Kapoor', 'Roshan', 'Singh', 'Devgan', 'Dhawan', 'Shroff', 'Malhotra', 'Rao'];
    const nationalities = ['UAE', 'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Egypt', 'Jordan', 'Sri Lanka'];
    const contractTypes: Array<'Permanent' | 'Contract' | 'Temporary'> = ['Permanent', 'Contract', 'Temporary'];
    const bankNames = ['Emirates NBD', 'Abu Dhabi Commercial Bank', 'Dubai Islamic Bank', 'Mashreq Bank', 'First Abu Dhabi Bank'];
    const visaStatuses = ['Valid', 'Under Process', 'Renewal Pending', 'Expired'];
    const workLocations = ['Dubai - Head Office', 'Dubai - Site Office', 'Abu Dhabi Branch', 'Sharjah Branch'];
    const managers = ['Salman Khan', 'Shah Rukh Kumar', 'Aamir Kapoor', 'Akshay Roshan', 'Hrithik Singh'];

    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const username = `${firstName.toLowerCase()}${i}`;
      
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 1095)); // 0-3 years

      const lastLogin = new Date();
      lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 30));

      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (25 + Math.floor(Math.random() * 20))); // 25-45 years

      const visaExpiry = new Date();
      visaExpiry.setDate(visaExpiry.getDate() + Math.floor(Math.random() * 730)); // 0-2 years

      const passportExpiry = new Date();
      passportExpiry.setDate(passportExpiry.getDate() + Math.floor(Math.random() * 1825)); // 0-5 years

      const user: User = {
        id: `U-${String(i).padStart(3, '0')}`,
        username: username,
        fullName: `${firstName} ${lastName}`,
        email: `${username}@alfarah.ae`,
        phone: `+971 ${Math.floor(Math.random() * 9) + 50} ${Math.floor(Math.random() * 9000000) + 1000000}`,
        role: this.roles[i % this.roles.length],
        department: this.departments[i % this.departments.length],
        status: i % 7 === 0 ? 'Inactive' : i % 11 === 0 ? 'Suspended' : 'Active',
        joinDate: joinDate,
        lastLogin: Math.random() > 0.2 ? lastLogin : undefined,
        permissions: this.getRandomPermissions(),
        // Additional detailed information
        nationality: nationalities[i % nationalities.length],
        emiratesID: `784-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000000) + 1000000}-${i % 10}`,
        dateOfBirth: dateOfBirth,
        address: `Building ${i}, Street ${Math.floor(i / 10) + 1}, Dubai, UAE`,
        emergencyContact: `+971 ${Math.floor(Math.random() * 9) + 50} ${Math.floor(Math.random() * 9000000) + 1000000}`,
        emergencyContactName: `${firstNames[(i + 3) % firstNames.length]} ${lastNames[(i + 2) % lastNames.length]}`,
        manager: managers[i % managers.length],
        employeeID: `EMP-${String(i).padStart(4, '0')}`,
        workLocation: workLocations[i % workLocations.length],
        contractType: contractTypes[i % contractTypes.length],
        salary: Math.floor(Math.random() * 15000) + 5000, // 5000-20000 AED
        bankAccount: `AE${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 900000000000000) + 100000000000000}`,
        bankName: bankNames[i % bankNames.length],
        visaStatus: visaStatuses[i % visaStatuses.length],
        visaExpiry: visaExpiry,
        passportNumber: `${String.fromCharCode(65 + (i % 26))}${Math.floor(Math.random() * 9000000) + 1000000}`,
        passportExpiry: passportExpiry
      };

      this.users.push(user);
    }
  }

  getRandomPermissions(): string[] {
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 permissions
    const shuffled = [...this.allPermissions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Search
  searchUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user => 
        user.fullName.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
  }

  // Pagination
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changeItemsPerPage(value: string): void {
    this.itemsPerPage = parseInt(value);
    this.currentPage = 1;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // CRUD Operations
  openAddModal(): void {
    this.showAddEditModal = true;
    this.isEditMode = false;
    this.newUser = {
      status: 'Active',
      permissions: []
    };
  }

  openEditModal(user: User): void {
    this.showAddEditModal = true;
    this.isEditMode = true;
    this.newUser = { ...user, permissions: [...user.permissions] };
  }

  closeAddEditModal(): void {
    this.showAddEditModal = false;
    this.newUser = {};
    this.isEditMode = false;
  }

  saveUser(): void {
    if (this.newUser.username && this.newUser.fullName && this.newUser.email && this.newUser.role && this.newUser.department) {
      if (this.isEditMode) {
        // Update existing user
        const index = this.users.findIndex(u => u.id === this.newUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.newUser } as User;
          this.toastService.success(`User "${this.newUser.fullName}" updated successfully!`);
        }
      } else {
        // Add new user
        const newUser: User = {
          id: `U-${String(this.users.length + 1).padStart(3, '0')}`,
          username: this.newUser.username!,
          fullName: this.newUser.fullName!,
          email: this.newUser.email!,
          phone: this.newUser.phone || '',
          role: this.newUser.role!,
          department: this.newUser.department!,
          status: this.newUser.status as 'Active' | 'Inactive' | 'Suspended' || 'Active',
          joinDate: new Date(),
          permissions: this.newUser.permissions || []
        };
        this.users.unshift(newUser);
        this.toastService.success(`User "${newUser.fullName}" added successfully!`);
      }
      this.searchUsers();
      this.closeAddEditModal();
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  deleteUser(user: User): void {
    // Show confirmation toast instead of confirm dialog
    this.toastService.info(`Deleting user "${user.fullName}"...`);
    
    // Simulate confirmation after a short delay
    setTimeout(() => {
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.searchUsers();
        this.toastService.success(`User "${user.fullName}" deleted successfully!`);
      }
    }, 500);
  }

  openDetailsModal(user: User): void {
    this.selectedUser = user;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  togglePermission(permission: string): void {
    if (!this.newUser.permissions) {
      this.newUser.permissions = [];
    }
    const index = this.newUser.permissions.indexOf(permission);
    if (index > -1) {
      this.newUser.permissions.splice(index, 1);
    } else {
      this.newUser.permissions.push(permission);
    }
  }

  hasPermission(permission: string): boolean {
    return this.newUser.permissions?.includes(permission) || false;
  }

  // Helper Methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'Admin': return 'fas fa-user-shield';
      case 'Manager': return 'fas fa-user-tie';
      case 'Supervisor': return 'fas fa-user-check';
      case 'Operator': return 'fas fa-user-cog';
      case 'Accountant': return 'fas fa-calculator';
      case 'HR': return 'fas fa-users';
      case 'Mechanic': return 'fas fa-tools';
      default: return 'fas fa-user';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  getTimeSinceLogin(date?: Date): string {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }

  calculateAge(dateOfBirth?: Date): number {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getDaysUntilExpiry(expiryDate?: Date): number {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getExpiryStatusColor(expiryDate?: Date): string {
    const days = this.getDaysUntilExpiry(expiryDate);
    if (days < 0) return 'text-red-600 font-bold';
    if (days <= 30) return 'text-orange-600 font-semibold';
    if (days <= 90) return 'text-yellow-600';
    return 'text-green-600';
  }

  getExpiryStatusText(expiryDate?: Date): string {
    const days = this.getDaysUntilExpiry(expiryDate);
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days <= 30) return `Expires in ${days} days`;
    if (days <= 90) return `Expires in ${Math.floor(days / 30)} months`;
    return `Valid for ${Math.floor(days / 30)} months`;
  }

  getTenureYears(joinDate: Date): number {
    const today = new Date();
    const join = new Date(joinDate);
    return Math.floor((today.getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }
}
