import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseIssueDate: Date;
  licenseExpiry: Date;
  licenseType: string;
  phone: string;
  email: string;
  nationality: string;
  emiratesID: string;
  dateOfBirth: Date;
  joiningDate: Date;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'On Leave' | 'Suspended';
  assignedVehicle?: string;
  experience: number; // years
  address: string;
  emergencyContact: string;
  violations: number;
  rating: number; // 1-5
  region: string; // Dubai, Abu Dhabi, Sharjah, etc.
  campName?: string;
  roomNumber?: string;
}

@Component({
  selector: 'app-driver-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-manage.component.html',
  styleUrl: './driver-manage.component.css'
})
export class DriverManageComponent implements OnInit {
  drivers: Driver[] = [];
  filteredDrivers: Driver[] = [];
  searchTerm: string = '';
  
  // Filters
  selectedStatusFilter: string = 'All';
  selectedLicenseTypeFilter: string = 'All';
  selectedNationalityFilter: string = 'All';
  selectedLicenseStatusFilter: string = 'All';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100];

  // Modal States
  showAddEditModal: boolean = false;
  showDetailsModal: boolean = false;
  isEditMode: boolean = false;
  selectedDriver: Driver | null = null;

  // Form Data
  newDriver: Partial<Driver> = {};

  // Master Data
  licenseTypes: string[] = ['Light Vehicle', 'Heavy Vehicle', 'Bus', 'Trailer', 'All Categories'];
  statuses: Array<'Available' | 'On Duty' | 'Off Duty' | 'On Leave' | 'Suspended'> = ['Available', 'On Duty', 'Off Duty', 'On Leave', 'Suspended'];
  nationalities: string[] = ['UAE', 'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Egypt', 'Jordan', 'Sri Lanka', 'Nepal', 'Other'];
  regions: string[] = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
  camps: string[] = ['Asab Field Camp', 'Shah Field Camp', 'Beda Zayed Camp', 'Qusaweira Camp'];
  licenseStatuses: string[] = ['All', 'Valid', 'Expiring Soon', 'Expired'];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.generateDrivers();
    this.filteredDrivers = [...this.drivers];
  }

  // Generate sample drivers
  generateDrivers(): void {
    const firstNames = ['Salman', 'Shah Rukh', 'Aamir', 'Akshay', 'Hrithik', 'Ranbir', 'Ranveer', 'Ajay', 'Saif Ali', 'Varun', 
                        'Tiger', 'Arjun', 'Shahid', 'Siddharth', 'Ayushmann', 'Rajkumar', 'Vicky', 'Kartik', 'John', 'Farhan'];
    const lastNames = ['Khan', 'Kumar', 'Kapoor', 'Roshan', 'Singh', 'Devgan', 'Dhawan', 'Shroff', 'Malhotra', 'Rao',
                       'Khurrana', 'Kaushal', 'Aaryan', 'Abraham', 'Akhtar', 'Prabhas', 'Allu', 'Vijay', 'Rajput', 'Deol'];

    for (let i = 1; i <= 80; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      
      const joiningDate = new Date();
      joiningDate.setDate(joiningDate.getDate() - Math.floor(Math.random() * 1825)); // 0-5 years

      const dateOfBirth = new Date();
      dateOfBirth.setFullYear(dateOfBirth.getFullYear() - (25 + Math.floor(Math.random() * 20))); // 25-45 years

      // License dates - issue date should be before expiry date
      const licenseIssueDate = new Date();
      licenseIssueDate.setDate(licenseIssueDate.getDate() - Math.floor(Math.random() * 1825)); // 0-5 years ago
      
      const licenseExpiry = new Date();
      // Create some expired licenses for testing
      if (i % 10 === 0) {
        // Every 10th driver has expired license
        licenseExpiry.setDate(licenseExpiry.getDate() - Math.floor(Math.random() * 365)); // 0-1 year ago
      } else if (i % 7 === 0) {
        // Every 7th driver has license expiring soon (within 30 days)
        licenseExpiry.setDate(licenseExpiry.getDate() + Math.floor(Math.random() * 30));
      } else if (i % 5 === 0) {
        // Every 5th driver has license expiring within 90 days
        licenseExpiry.setDate(licenseExpiry.getDate() + Math.floor(Math.random() * 90));
      } else {
        // Rest have valid licenses (more than 90 days)
        licenseExpiry.setDate(licenseExpiry.getDate() + Math.floor(Math.random() * 730) + 90); // 90 days to 2 years
      }

      const region = 'Dubai'; // All drivers are from Dubai region
      
      // Camp and room assignment
      const campsList = ['Asab Field Camp', 'Shah Field Camp', 'Beda Zayed Camp', 'Qusaweira Camp'];
      const campName = campsList[i % campsList.length];
      const roomNumber = `${Math.floor(i / 4) + 1}-${String.fromCharCode(65 + (i % 4))}`; // e.g., "1-A", "1-B", "2-A"
      
      const driver: Driver = {
        id: `D-${String(i).padStart(3, '0')}`,
        name: `${firstName} ${lastName}`,
        licenseNumber: `UAE-${Math.floor(Math.random() * 900000) + 100000}`,
        licenseIssueDate: licenseIssueDate,
        licenseExpiry: licenseExpiry,
        licenseType: this.licenseTypes[i % this.licenseTypes.length],
        phone: `+971 ${Math.floor(Math.random() * 9) + 50} ${Math.floor(Math.random() * 9000000) + 1000000}`,
        email: `${firstName.toLowerCase()}${i}@driver.ae`,
        nationality: this.nationalities[i % this.nationalities.length],
        emiratesID: `784-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000000) + 1000000}-${i % 10}`,
        dateOfBirth: dateOfBirth,
        joiningDate: joiningDate,
        status: i % 5 === 0 ? 'On Leave' : i % 7 === 0 ? 'Off Duty' : i % 3 === 0 ? 'On Duty' : 'Available',
        assignedVehicle: i % 6 !== 0 ? `AF-${String(i).padStart(3, '0')}` : undefined, // 85% of drivers get vehicles (only every 6th driver doesn't)
        experience: Math.floor(Math.random() * 15) + 2, // 2-16 years
        address: `Building ${i}, Street ${Math.floor(i / 10) + 1}, ${region}, UAE`,
        emergencyContact: `+971 ${Math.floor(Math.random() * 9) + 50} ${Math.floor(Math.random() * 9000000) + 1000000}`,
        violations: Math.floor(Math.random() * 5), // 0-4 violations
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)), // 3.5-5.0
        region: region,
        campName: campName,
        roomNumber: roomNumber
      };

      this.drivers.push(driver);
    }
  }

  // Search and Filter
  searchDrivers(): void {
    let result = [...this.drivers];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(driver => 
        driver.name.toLowerCase().includes(term) ||
        driver.licenseNumber.toLowerCase().includes(term) ||
        driver.phone.includes(term) ||
        driver.nationality.toLowerCase().includes(term) ||
        driver.emiratesID.includes(term) ||
        driver.status.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.selectedStatusFilter !== 'All') {
      result = result.filter(driver => driver.status === this.selectedStatusFilter);
    }

    // Apply license type filter
    if (this.selectedLicenseTypeFilter !== 'All') {
      result = result.filter(driver => driver.licenseType === this.selectedLicenseTypeFilter);
    }

    // Apply nationality filter
    if (this.selectedNationalityFilter !== 'All') {
      result = result.filter(driver => driver.nationality === this.selectedNationalityFilter);
    }

    // Apply license status filter
    if (this.selectedLicenseStatusFilter !== 'All') {
      result = result.filter(driver => {
        const licenseStatus = this.getLicenseStatus(driver.licenseExpiry);
        if (this.selectedLicenseStatusFilter === 'Valid') {
          return licenseStatus === 'Valid';
        } else if (this.selectedLicenseStatusFilter === 'Expiring Soon') {
          return licenseStatus === 'Expiring Soon';
        } else if (this.selectedLicenseStatusFilter === 'Expired') {
          return licenseStatus === 'Expired';
        }
        return false;
      });
    }

    this.filteredDrivers = result;
    this.currentPage = 1;
  }

  // Reset all filters
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatusFilter = 'All';
    this.selectedLicenseTypeFilter = 'All';
    this.selectedNationalityFilter = 'All';
    this.selectedLicenseStatusFilter = 'All';
    this.searchDrivers();
  }

  // Pagination
  get paginatedDrivers(): Driver[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDrivers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDrivers.length / this.itemsPerPage);
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
    this.newDriver = {
      status: 'Available',
      violations: 0,
      rating: 5.0
    };
  }

  openEditModal(driver: Driver): void {
    this.showAddEditModal = true;
    this.isEditMode = true;
    this.newDriver = { ...driver };
  }

  closeAddEditModal(): void {
    this.showAddEditModal = false;
    this.newDriver = {};
    this.isEditMode = false;
  }

  saveDriver(): void {
    if (this.newDriver.name && this.newDriver.licenseNumber && this.newDriver.phone && this.newDriver.licenseType && this.newDriver.nationality) {
      if (this.isEditMode) {
        // Update existing driver
        const index = this.drivers.findIndex(d => d.id === this.newDriver.id);
        if (index !== -1) {
          this.drivers[index] = { ...this.newDriver } as Driver;
          this.toastService.success(`Driver "${this.newDriver.name}" updated successfully!`);
        }
      } else {
        // Add new driver
        const newDriver: Driver = {
          id: `D-${String(this.drivers.length + 1).padStart(3, '0')}`,
          name: this.newDriver.name!,
          licenseNumber: this.newDriver.licenseNumber!,
          licenseIssueDate: this.newDriver.licenseIssueDate || new Date(),
          licenseExpiry: this.newDriver.licenseExpiry || new Date(),
          licenseType: this.newDriver.licenseType!,
          phone: this.newDriver.phone!,
          email: this.newDriver.email || '',
          nationality: this.newDriver.nationality!,
          emiratesID: this.newDriver.emiratesID || '',
          dateOfBirth: this.newDriver.dateOfBirth || new Date(),
          joiningDate: new Date(),
          status: this.newDriver.status as any || 'Available',
          experience: this.newDriver.experience || 0,
          address: this.newDriver.address || '',
          emergencyContact: this.newDriver.emergencyContact || '',
          violations: this.newDriver.violations || 0,
          rating: this.newDriver.rating || 5.0,
          region: this.newDriver.region || 'Dubai'
        };
        this.drivers.unshift(newDriver);
        this.toastService.success(`Driver "${newDriver.name}" added successfully!`);
      }
      this.searchDrivers();
      this.closeAddEditModal();
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  deleteDriver(driver: Driver): void {
    // Show confirmation toast instead of confirm dialog
    this.toastService.info(`Deleting driver "${driver.name}"...`);
    
    // Simulate confirmation after a short delay
    setTimeout(() => {
      const index = this.drivers.findIndex(d => d.id === driver.id);
      if (index !== -1) {
        this.drivers.splice(index, 1);
        this.searchDrivers();
        this.toastService.success(`Driver "${driver.name}" deleted successfully!`);
      }
    }, 500);
  }

  openDetailsModal(driver: Driver): void {
    this.selectedDriver = driver;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedDriver = null;
  }

  // Helper Methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Duty': return 'bg-blue-100 text-blue-800';
      case 'Off Duty': return 'bg-gray-100 text-gray-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRatingStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }

  getLicenseStatus(expiryDate: Date): string {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring Soon';
    if (daysUntilExpiry <= 90) return 'Valid (Expires in ' + daysUntilExpiry + ' days)';
    return 'Valid';
  }

  getLicenseStatusColor(expiryDate: Date): string {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'text-red-600 font-bold';
    if (daysUntilExpiry <= 30) return 'text-yellow-600 font-bold';
    if (daysUntilExpiry <= 90) return 'text-orange-600 font-medium';
    return 'text-green-600';
  }

  getLicenseStatusBadge(expiryDate: Date): string {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'bg-red-100 text-red-800 border-red-200';
    if (daysUntilExpiry <= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (daysUntilExpiry <= 90) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-green-100 text-green-800 border-green-200';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Statistics helpers
  getOnDutyCount(): number {
    return this.drivers.filter(d => d.status === 'On Duty').length;
  }

  getAvailableCount(): number {
    return this.drivers.filter(d => d.status === 'Available').length;
  }

  getOnLeaveCount(): number {
    return this.drivers.filter(d => d.status === 'On Leave').length;
  }

  getSuspendedCount(): number {
    return this.drivers.filter(d => d.status === 'Suspended').length;
  }

  checkLicenseExpiry(): void {
    // This method is called when license expiry date changes in the form
    // The status will be automatically updated via the template binding
  }

  // License management actions
  renewLicense(driver: Driver): void {
    this.toastService.success(`License renewal initiated for ${driver.name}. New expiry date will be set.`);
    // In a real application, this would:
    // 1. Open a license renewal form
    // 2. Connect to license authority API
    // 3. Update the driver's license expiry date
    // 4. Send notifications
    console.log('License renewal for:', driver.name);
  }

  remindDriver(driver: Driver): void {
    const licenseStatus = this.getLicenseStatus(driver.licenseExpiry);
    let message = '';
    
    if (licenseStatus === 'Expired') {
      message = `Urgent reminder sent to ${driver.name} about expired license.`;
    } else if (licenseStatus === 'Expiring Soon') {
      message = `Reminder sent to ${driver.name} about upcoming license expiry.`;
    }
    
    this.toastService.info(message);
    // In a real application, this would:
    // 1. Send SMS/Email to driver
    // 2. Log the reminder in the system
    // 3. Notify HR/Admin
    console.log('Reminder sent to:', driver.name, 'Status:', licenseStatus);
  }

}
