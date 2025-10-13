import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

// Vehicle Types Interface
interface VehicleType {
  id: string;
  name: string;
  category: 'Transport' | 'Construction' | 'Specialized';
  icon: string;
  capacity?: string;
}

// Vehicle Status Interface
interface VehicleStatus {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

// Driver Interface
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: 'Available' | 'On Duty' | 'Off Duty';
  assignedVehicle?: string;
}

// Route Interface
interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedTime: number;
  type: 'Bus Route' | 'Material Transport' | 'Construction Site';
}

// Fuel Record Interface
interface FuelRecord {
  id: string;
  vehicleId: string;
  date: Date;
  time: string;
  fuelAmount: number;
  kmReading: number;
  cost: number;
  location: string;
  driverId: string;
}

// Vehicle Interface
interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  year: number;
  capacity: string;
  fuelType: 'Diesel' | 'Petrol';
  registrationNumber: string;
  insuranceExpiry: Date;
  lastServiceDate: Date;
  nextServiceDate: Date;
  assignedDriver?: Driver;
  currentStatus: VehicleStatus;
  location: string;
  route?: Route;
  fuelEfficiency: number;
  totalKm: number;
  lastFuelDate?: Date;
  maintenanceStatus: 'Good' | 'Warning' | 'Critical';
}

@Component({
  selector: 'app-fleet-manage',
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-manage.component.html',
  styleUrl: './fleet-manage.component.css'
})
export class FleetManageComponent implements OnInit {
  
  // Helper method for min calculation
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Vehicle Types Data - Exactly as requested
  vehicleTypes: VehicleType[] = [
    // Transport Vehicles - Left Column
    { id: '1', name: 'Double Cabin Pickup', category: 'Transport', icon: 'pickup', capacity: '5 Seater' },
    { id: '2', name: '3 Ton Pickup', category: 'Transport', icon: 'pickup', capacity: '3 Ton' },
    { id: '3', name: 'Station Wagon', category: 'Transport', icon: 'wagon', capacity: '7 Seater' },
    { id: '4', name: 'Mini Bus', category: 'Transport', icon: 'bus', capacity: '15 Seater' },
    { id: '5', name: 'Desert Bus', category: 'Transport', icon: 'bus', capacity: '25 Seater' },
    { id: '6', name: '30 Seater Bus', category: 'Transport', icon: 'bus', capacity: '30 Seater' },
    { id: '7', name: '60 Seater Bus', category: 'Transport', icon: 'bus', capacity: '60 Seater' },
    { id: '8', name: 'Diesel Tanker', category: 'Specialized', icon: 'tanker', capacity: '5000 L' },
    { id: '9', name: 'Water Tanker', category: 'Specialized', icon: 'tanker', capacity: '8000 L' },
    { id: '10', name: 'Tipper', category: 'Specialized', icon: 'tipper', capacity: '12 Ton' },
    { id: '11', name: 'Trailer', category: 'Specialized', icon: 'trailer', capacity: '30 Ton' },
    
    // Construction Equipment - Right Column
    { id: '12', name: 'Dumper', category: 'Construction', icon: 'dumper', capacity: '10 Ton' },
    { id: '13', name: 'Low Bed Trailer', category: 'Construction', icon: 'trailer', capacity: '40 Ton' },
    { id: '14', name: 'Flat Bed Trailer', category: 'Construction', icon: 'trailer', capacity: '30 Ton' },
    { id: '15', name: 'Excavator', category: 'Construction', icon: 'excavator', capacity: '20 Ton' },
    { id: '16', name: 'Shovel', category: 'Construction', icon: 'shovel', capacity: '15 Ton' },
    { id: '17', name: 'Wheel Dozer', category: 'Construction', icon: 'dozer', capacity: '25 Ton' },
    { id: '18', name: 'Bull Dozer', category: 'Construction', icon: 'dozer', capacity: '30 Ton' },
    { id: '19', name: 'Bob Cat', category: 'Construction', icon: 'bobcat', capacity: '2 Ton' },
    { id: '20', name: 'Hiab Crane', category: 'Specialized', icon: 'crane', capacity: '15 Ton' },
    { id: '21', name: 'Mobile Crane', category: 'Specialized', icon: 'crane', capacity: '25 Ton' },
    { id: '22', name: 'Grader', category: 'Construction', icon: 'grader', capacity: '18 Ton' }
  ];

  // Vehicle Status Data
  vehicleStatuses: VehicleStatus[] = [
    { id: '1', name: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: '2', name: 'Idle', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: '3', name: 'Maintenance', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { id: '4', name: 'Breakdown', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  // Drivers Data - Extended list for 600 vehicles
  drivers: Driver[] = [
    { id: '1', name: 'Ahmed Al Mansoori', licenseNumber: 'UAE123456', phone: '+971501234567', status: 'Available' },
    { id: '2', name: 'Mohammed Al Zaabi', licenseNumber: 'UAE123457', phone: '+971501234568', status: 'On Duty' },
    { id: '3', name: 'Omar Al Shamsi', licenseNumber: 'UAE123458', phone: '+971501234569', status: 'On Duty' },
    { id: '4', name: 'Khalid Al Dhaheri', licenseNumber: 'UAE123459', phone: '+971501234570', status: 'On Duty' },
    { id: '5', name: 'Saeed Al Nuaimi', licenseNumber: 'UAE123460', phone: '+971501234571', status: 'On Duty' },
    { id: '6', name: 'Hassan Al Kaabi', licenseNumber: 'UAE123461', phone: '+971501234572', status: 'On Duty' },
    { id: '7', name: 'Abdullah Al Mazrouei', licenseNumber: 'UAE123462', phone: '+971501234573', status: 'On Duty' },
    { id: '8', name: 'Ali Al Shehhi', licenseNumber: 'UAE123463', phone: '+971501234574', status: 'On Duty' },
    { id: '9', name: 'Rashid Al Falasi', licenseNumber: 'UAE123464', phone: '+971501234575', status: 'On Duty' },
    { id: '10', name: 'Sultan Al Blooshi', licenseNumber: 'UAE123465', phone: '+971501234576', status: 'On Duty' },
    { id: '11', name: 'Hamdan Al Ketbi', licenseNumber: 'UAE123466', phone: '+971501234577', status: 'On Duty' },
    { id: '12', name: 'Majid Al Suwaidi', licenseNumber: 'UAE123467', phone: '+971501234578', status: 'On Duty' },
    { id: '13', name: 'Nasser Al Ahbabi', licenseNumber: 'UAE123468', phone: '+971501234579', status: 'On Duty' },
    { id: '14', name: 'Salem Al Hamadi', licenseNumber: 'UAE123469', phone: '+971501234580', status: 'On Duty' },
    { id: '15', name: 'Zayed Al Shamsi', licenseNumber: 'UAE123470', phone: '+971501234581', status: 'On Duty' },
    { id: '16', name: 'Fahad Al Mansouri', licenseNumber: 'UAE123471', phone: '+971501234582', status: 'Available' },
    { id: '17', name: 'Obaid Al Ghafli', licenseNumber: 'UAE123472', phone: '+971501234583', status: 'Available' },
    { id: '18', name: 'Tariq Al Dhaheri', licenseNumber: 'UAE123473', phone: '+971501234584', status: 'Available' },
    { id: '19', name: 'Marwan Al Kaabi', licenseNumber: 'UAE123474', phone: '+971501234585', status: 'Available' },
    { id: '20', name: 'Yousef Al Nuaimi', licenseNumber: 'UAE123475', phone: '+971501234586', status: 'Available' }
  ];

  // Routes Data
  routes: Route[] = [
    { id: '1', name: 'Camp A to Site 1', startLocation: 'Al Farah Camp A', endLocation: 'Construction Site 1', distance: 45, estimatedTime: 60, type: 'Bus Route' },
    { id: '2', name: 'Camp B to Site 2', startLocation: 'Al Farah Camp B', endLocation: 'Construction Site 2', distance: 38, estimatedTime: 50, type: 'Bus Route' },
    { id: '3', name: 'Material Transport Route', startLocation: 'Material Yard', endLocation: 'Site 1', distance: 25, estimatedTime: 40, type: 'Material Transport' },
    { id: '4', name: 'Fuel Supply Route', startLocation: 'Fuel Station', endLocation: 'Site 2', distance: 30, estimatedTime: 45, type: 'Material Transport' }
  ];

  // Sample Vehicles Data - 600 Vehicles
  vehicles: Vehicle[] = [];

  // Fuel Records Data
  fuelRecords: FuelRecord[] = [
    {
      id: '1',
      vehicleId: '1',
      date: new Date('2024-10-01'),
      time: '08:30',
      fuelAmount: 50,
      kmReading: 45000,
      cost: 150,
      location: 'Site 1 Fuel Station',
      driverId: '2'
    },
    {
      id: '2',
      vehicleId: '2',
      date: new Date('2024-10-02'),
      time: '07:15',
      fuelAmount: 120,
      kmReading: 125000,
      cost: 360,
      location: 'Camp B Fuel Station',
      driverId: '4'
    },
    {
      id: '3',
      vehicleId: '4',
      date: new Date('2024-10-03'),
      time: '14:20',
      fuelAmount: 200,
      kmReading: 25000,
      cost: 600,
      location: 'Main Fuel Depot',
      driverId: '1'
    }
  ];

  // Filter and Search Properties
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  searchTerm: string = '';
  selectedTab: 'overview' | 'vehicles' | 'fuel' | 'routes' | 'maintenance' = 'vehicles';
  viewMode: 'grid' | 'list' = 'list';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100, 200];
  
  // Fuel Pagination
  fuelCurrentPage: number = 1;
  fuelItemsPerPage: number = 10;
  fuelItemsPerPageOptions: number[] = [10, 25, 50, 100];

  // Maintenance Pagination
  maintenanceCurrentPage: number = 1;
  maintenanceItemsPerPage: number = 10;
  maintenanceItemsPerPageOptions: number[] = [10, 25, 50, 100];

  // Modal and Form Properties
  showAddVehicleModal: boolean = false;
  showEditVehicleModal: boolean = false;
  showStatusConfirmModal: boolean = false;
  showFuelEntryModal: boolean = false;
  showServiceModal: boolean = false;
  showDriverAssignModal: boolean = false;
  showVehicleDetailsModal: boolean = false;
  showFuelDetailsModal: boolean = false;
  showRouteAssignModal: boolean = false;
  showAddEditRouteModal: boolean = false;
  showRouteDetailsModal: boolean = false;
  isEditMode: boolean = false;
  selectedVehicle: Vehicle | null = null;
  selectedDriver: Driver | null = null;
  selectedFuelRecord: FuelRecord | null = null;
  selectedRoute: Route | null = null;
  selectedRouteForDetails: Route | null = null;
  pendingStatusChange: VehicleStatus | null = null;

  // Form Data
  newVehicle: Partial<Vehicle> = {};
  editVehicle: Partial<Vehicle> = {};
  newFuelRecord: Partial<FuelRecord> = {};
  newServiceRecord: any = {};
  newRoute: Partial<Route> = {};

  // Statistics for real-time updates
  todayFuelConsumption: number = 370;
  todayFuelCost: number = 1110;
  averageEfficiency: number = 9.2;
  monthlyFuelConsumption: number = 11100;

  // Statistics
  totalVehicles: number = 0;
  availableVehicles: number = 0;
  inUseVehicles: number = 0;
  maintenanceVehicles: number = 0;
  breakdownVehicles: number = 0;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.generateVehicles();
    this.generateFuelRecords();
    this.calculateStatistics();
  }

  // Generate 600 vehicles
  generateVehicles(): void {
    const makes = ['Toyota', 'Mercedes', 'Volvo', 'Scania', 'Caterpillar', 'Komatsu', 'Hitachi', 'JCB', 'MAN', 'DAF', 'Isuzu', 'Mitsubishi'];
    const models = ['Hilux', 'Tourismo', 'FMX', 'P-Series', '320D', 'PC200', 'ZX200', '3CX', 'TGS', 'XF', 'Forward', 'Fuso'];
    const locations = [
      'Construction Site 1', 'Construction Site 2', 'Construction Site 3', 'Camp A', 'Camp B', 
      'Service Center', 'Fuel Station', 'Material Yard', 'Equipment Depot', 'Maintenance Bay'
    ];
    const statuses = this.vehicleStatuses;

    for (let i = 1; i <= 600; i++) {
      const vehicleTypeIndex = i % this.vehicleTypes.length;
      const vehicleType = this.vehicleTypes[vehicleTypeIndex];
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const makeIndex = i % makes.length;
      const modelIndex = i % models.length;
      const locationIndex = i % locations.length;
      
      // Determine if vehicle has driver (70% chance for Active status)
      const hasDriver = Math.random() > 0.3;
      const driverIndex = i % this.drivers.length;
      
      // Random dates
      const daysUntilService = Math.floor(Math.random() * 90) - 30; // -30 to 60 days
      const nextServiceDate = new Date();
      nextServiceDate.setDate(nextServiceDate.getDate() + daysUntilService);
      
      const lastServiceDate = new Date();
      lastServiceDate.setDate(lastServiceDate.getDate() - (90 - daysUntilService));
      
      const insuranceExpiry = new Date();
      insuranceExpiry.setDate(insuranceExpiry.getDate() + Math.floor(Math.random() * 365));
      
      // Maintenance status based on service due
      let maintenanceStatus: 'Good' | 'Warning' | 'Critical' = 'Good';
      if (daysUntilService <= 0) {
        maintenanceStatus = 'Critical';
      } else if (daysUntilService <= 7) {
        maintenanceStatus = 'Warning';
      }

      const vehicle: Vehicle = {
        id: i.toString(),
        vehicleNumber: `AF-${String(i).padStart(3, '0')}`,
        vehicleType: vehicleType,
        make: makes[makeIndex],
        model: models[modelIndex],
        year: 2018 + (i % 7),
        capacity: vehicleType.capacity || 'Standard',
        fuelType: 'Diesel',
        registrationNumber: `UAE-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 2) % 26))}${String.fromCharCode(65 + ((i * 3) % 26))}-${String(i).padStart(3, '0')}`,
        insuranceExpiry: insuranceExpiry,
        lastServiceDate: lastServiceDate,
        nextServiceDate: nextServiceDate,
        assignedDriver: hasDriver && statuses[statusIndex].name === 'Active' ? this.drivers[driverIndex] : undefined,
        currentStatus: statuses[statusIndex],
        location: locations[locationIndex],
        route: (Math.random() > 0.5) ? this.routes[i % this.routes.length] : undefined, // 50% chance of having a route
        fuelEfficiency: 3 + Math.random() * 10, // 3 to 13 km/L
        totalKm: Math.floor(10000 + Math.random() * 200000), // 10k to 210k km
        lastFuelDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last 7 days
        maintenanceStatus: maintenanceStatus
      };

      this.vehicles.push(vehicle);
    }
  }

  // Generate fuel records for all vehicles (last 30 days)
  generateFuelRecords(): void {
    this.fuelRecords = []; // Clear existing records
    const fuelLocations = ['Main Fuel Depot', 'Camp A Fuel Station', 'Camp B Fuel Station', 'Site Fuel Station', 'City Petrol Station'];
    
    this.vehicles.forEach((vehicle, index) => {
      // Generate 3-5 fuel records per vehicle (last 30 days)
      const recordCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 records
      let currentKm = vehicle.totalKm;
      
      for (let i = 0; i < recordCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30); // Random day in last 30 days
        const fuelDate = new Date();
        fuelDate.setDate(fuelDate.getDate() - daysAgo);
        
        const fuelAmount = Math.floor(Math.random() * 150) + 50; // 50-200 liters
        const kmBetweenFills = Math.floor(fuelAmount * vehicle.fuelEfficiency); // Based on efficiency
        currentKm -= kmBetweenFills;
        
        const fuelRecord: FuelRecord = {
          id: `F-${vehicle.id}-${i}`,
          vehicleId: vehicle.id,
          date: fuelDate,
          time: `${String(Math.floor(Math.random() * 16) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`, // 6 AM to 10 PM
          fuelAmount: fuelAmount,
          kmReading: Math.max(currentKm, 10000),
          cost: fuelAmount * 3, // AED 3 per liter
          location: fuelLocations[Math.floor(Math.random() * fuelLocations.length)],
          driverId: vehicle.assignedDriver?.id || this.drivers[index % this.drivers.length].id
        };
        
        this.fuelRecords.push(fuelRecord);
      }
    });
    
    // Sort by date (newest first)
    this.fuelRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Calculate fleet statistics
  calculateStatistics(): void {
    this.totalVehicles = this.vehicles.length;
    this.availableVehicles = this.vehicles.filter(v => v.currentStatus.name === 'Active').length;
    this.inUseVehicles = this.vehicles.filter(v => v.currentStatus.name === 'Idle').length;
    this.maintenanceVehicles = this.vehicles.filter(v => v.currentStatus.name === 'Maintenance').length;
    this.breakdownVehicles = this.vehicles.filter(v => v.currentStatus.name === 'Breakdown').length;
  }

  // Filter vehicles based on status and type
  get filteredVehicles(): Vehicle[] {
    const filtered = this.vehicles.filter(vehicle => {
      const statusMatch = this.selectedStatus === 'all' || vehicle.currentStatus.name === this.selectedStatus;
      const typeMatch = this.selectedType === 'all' || vehicle.vehicleType.category === this.selectedType;
      const searchMatch = this.searchTerm === '' || 
        vehicle.vehicleNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && searchMatch;
    });

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }

  // Get total filtered vehicles count
  get totalFilteredVehicles(): number {
    return this.vehicles.filter(vehicle => {
      const statusMatch = this.selectedStatus === 'all' || vehicle.currentStatus.name === this.selectedStatus;
      const typeMatch = this.selectedType === 'all' || vehicle.vehicleType.category === this.selectedType;
      const searchMatch = this.searchTerm === '' || 
        vehicle.vehicleNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return statusMatch && typeMatch && searchMatch;
    }).length;
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.totalFilteredVehicles / this.itemsPerPage);
  }

  // Pagination methods
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
    this.currentPage = 1; // Reset to first page
  }

  // Fuel Pagination Methods
  get paginatedFuelRecords(): FuelRecord[] {
    const startIndex = (this.fuelCurrentPage - 1) * this.fuelItemsPerPage;
    const endIndex = startIndex + this.fuelItemsPerPage;
    return this.fuelRecords.slice(startIndex, endIndex);
  }

  get totalFuelPages(): number {
    return Math.ceil(this.fuelRecords.length / this.fuelItemsPerPage);
  }

  goToFuelPage(page: number): void {
    if (page >= 1 && page <= this.totalFuelPages) {
      this.fuelCurrentPage = page;
    }
  }

  nextFuelPage(): void {
    if (this.fuelCurrentPage < this.totalFuelPages) {
      this.fuelCurrentPage++;
    }
  }

  previousFuelPage(): void {
    if (this.fuelCurrentPage > 1) {
      this.fuelCurrentPage--;
    }
  }

  getFuelPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.fuelCurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalFuelPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changeFuelItemsPerPage(value: string): void {
    this.fuelItemsPerPage = parseInt(value);
    this.fuelCurrentPage = 1; // Reset to first page
  }

  // Maintenance Pagination Methods
  get paginatedMaintenanceVehicles(): Vehicle[] {
    const maintenanceVehicles = this.getVehiclesDueForService();
    const startIndex = (this.maintenanceCurrentPage - 1) * this.maintenanceItemsPerPage;
    const endIndex = startIndex + this.maintenanceItemsPerPage;
    return maintenanceVehicles.slice(startIndex, endIndex);
  }

  get totalMaintenancePages(): number {
    return Math.ceil(this.getVehiclesDueForService().length / this.maintenanceItemsPerPage);
  }

  goToMaintenancePage(page: number): void {
    if (page >= 1 && page <= this.totalMaintenancePages) {
      this.maintenanceCurrentPage = page;
    }
  }

  nextMaintenancePage(): void {
    if (this.maintenanceCurrentPage < this.totalMaintenancePages) {
      this.maintenanceCurrentPage++;
    }
  }

  previousMaintenancePage(): void {
    if (this.maintenanceCurrentPage > 1) {
      this.maintenanceCurrentPage--;
    }
  }

  getMaintenancePageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.maintenanceCurrentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalMaintenancePages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changeMaintenanceItemsPerPage(value: string): void {
    this.maintenanceItemsPerPage = parseInt(value);
    this.maintenanceCurrentPage = 1; // Reset to first page
  }

  // Get vehicles by status
  getVehiclesByStatus(status: string): Vehicle[] {
    return this.vehicles.filter(v => v.currentStatus.name === status);
  }

  // Get fuel records for a vehicle
  getFuelRecordsForVehicle(vehicleId: string): FuelRecord[] {
    return this.fuelRecords.filter(f => f.vehicleId === vehicleId);
  }

  // Get available drivers
  getAvailableDrivers(): Driver[] {
    return this.drivers.filter(d => d.status === 'Available');
  }

  // Get maintenance status color
  getMaintenanceStatusColor(status: string): string {
    switch (status) {
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  // Get vehicle type icon
  getVehicleTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'pickup': 'fas fa-truck-pickup',
      'wagon': 'fas fa-shuttle-van',
      'bus': 'fas fa-bus',
      'dumper': 'fas fa-dumpster',
      'trailer': 'fas fa-trailer',
      'excavator': 'fas fa-tractor',
      'shovel': 'fas fa-hammer',
      'dozer': 'fas fa-tractor',
      'bobcat': 'fas fa-tractor',
      'grader': 'fas fa-tractor',
      'tanker': 'fas fa-truck',
      'tipper': 'fas fa-truck',
      'crane': 'fas fa-crane'
    };
    return iconMap[type] || 'fas fa-car';
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  // Format date for input field (YYYY-MM-DD)
  formatDateForInput(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to update last service date
  updateLastServiceDate(dateString: string): void {
    this.editVehicle.lastServiceDate = new Date(dateString);
  }

  // Helper method to update next service date
  updateNextServiceDate(dateString: string): void {
    this.editVehicle.nextServiceDate = new Date(dateString);
  }

  // Helper method to update insurance expiry date
  updateInsuranceExpiry(dateString: string): void {
    this.editVehicle.insuranceExpiry = new Date(dateString);
  }

  // Calculate days until service
  getDaysUntilService(vehicle: Vehicle): number {
    const today = new Date();
    const serviceDate = new Date(vehicle.nextServiceDate);
    const diffTime = serviceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Check if service is due soon
  isServiceDueSoon(vehicle: Vehicle): boolean {
    return this.getDaysUntilService(vehicle) <= 7;
  }

  // Get service status color
  getServiceStatusColor(vehicle: Vehicle): string {
    const days = this.getDaysUntilService(vehicle);
    if (days <= 0) return 'text-red-600 bg-red-100';
    if (days <= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  }

  // Switch tabs
  switchTab(tab: 'overview' | 'vehicles' | 'fuel' | 'routes' | 'maintenance'): void {
    this.selectedTab = tab;
  }

  // Get current date and time
  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }

  // Helper method to get vehicle by ID
  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  // Helper method to get driver by ID
  getDriverById(id: string): Driver | undefined {
    return this.drivers.find(d => d.id === id);
  }

  // Helper method to get vehicles due for service
  getVehiclesDueForService(): Vehicle[] {
    return this.vehicles.filter(v => this.isServiceDueSoon(v));
  }

  // Helper method to get vehicle type icon for fuel record
  getVehicleTypeIconForRecord(vehicleId: string): string {
    const vehicle = this.getVehicleById(vehicleId);
    return vehicle ? this.getVehicleTypeIcon(vehicle.vehicleType.icon) : '🚗';
  }

  // Helper method to get driver name for fuel record
  getDriverNameForRecord(driverId: string): string {
    const driver = this.getDriverById(driverId);
    return driver ? driver.name : 'Unknown';
  }

  // Get all routes with assigned vehicles count
  getRoutesWithVehicleCount(): any[] {
    return this.routes.map(route => {
      const vehiclesOnRoute = this.vehicles.filter(v => v.route?.id === route.id);
      return {
        ...route,
        vehicleCount: vehiclesOnRoute.length,
        vehicles: vehiclesOnRoute
      };
    });
  }

  // Get vehicles on specific route
  getVehiclesOnRoute(routeId: string): Vehicle[] {
    return this.vehicles.filter(v => v.route?.id === routeId);
  }

  // Modal Control Methods
  openAddVehicleModal(): void {
    this.showAddVehicleModal = true;
    this.newVehicle = {
      vehicleType: this.vehicleTypes[0],
      currentStatus: this.vehicleStatuses[0],
      fuelType: 'Diesel',
      maintenanceStatus: 'Good',
      fuelEfficiency: 0,
      totalKm: 0
    };
  }

  closeAddVehicleModal(): void {
    this.showAddVehicleModal = false;
    this.newVehicle = {};
  }

  openEditVehicleModal(vehicle: Vehicle): void {
    this.showEditVehicleModal = true;
    this.selectedVehicle = vehicle;
    // Create a deep copy of the vehicle for editing
    this.editVehicle = {
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleType: vehicle.vehicleType,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      fuelType: vehicle.fuelType,
      registrationNumber: vehicle.registrationNumber,
      insuranceExpiry: vehicle.insuranceExpiry,
      lastServiceDate: vehicle.lastServiceDate,
      nextServiceDate: vehicle.nextServiceDate,
      assignedDriver: vehicle.assignedDriver,
      currentStatus: vehicle.currentStatus,
      location: vehicle.location,
      route: vehicle.route,
      fuelEfficiency: vehicle.fuelEfficiency,
      totalKm: vehicle.totalKm,
      lastFuelDate: vehicle.lastFuelDate,
      maintenanceStatus: vehicle.maintenanceStatus
    };
  }

  closeEditVehicleModal(): void {
    this.showEditVehicleModal = false;
    this.selectedVehicle = null;
    this.editVehicle = {};
  }

  requestStatusChange(vehicle: Vehicle, newStatusName: string): void {
    if (!newStatusName || newStatusName === vehicle.currentStatus.name) {
      return; // No change needed
    }

    const newStatus = this.vehicleStatuses.find(s => s.name === newStatusName);
    if (newStatus) {
      this.selectedVehicle = vehicle;
      this.pendingStatusChange = newStatus;
      this.showStatusConfirmModal = true;
      
      // Auto-close after 10 seconds if user doesn't respond
      setTimeout(() => {
        if (this.showStatusConfirmModal) {
          this.cancelStatusChange();
          this.toastService.warning('Status change cancelled due to timeout');
        }
      }, 10000);
    }
  }

  confirmStatusChange(): void {
    if (this.selectedVehicle && this.pendingStatusChange) {
      this.updateVehicleStatus(this.selectedVehicle, this.pendingStatusChange.name);
      this.closeStatusConfirmModal();
    }
  }

  cancelStatusChange(): void {
    this.closeStatusConfirmModal();
    // The dropdown will automatically reset to the current status since we're not changing the model
  }

  closeStatusConfirmModal(): void {
    this.showStatusConfirmModal = false;
    this.selectedVehicle = null;
    this.pendingStatusChange = null;
  }

  openFuelEntryModal(): void {
    this.showFuelEntryModal = true;
    this.newFuelRecord = {
      date: new Date(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      fuelAmount: 0,
      kmReading: 0,
      cost: 0,
      location: '',
      driverId: ''
    };
  }

  closeFuelEntryModal(): void {
    this.showFuelEntryModal = false;
    this.newFuelRecord = {};
  }

  openServiceModal(vehicle?: Vehicle): void {
    this.showServiceModal = true;
    this.selectedVehicle = vehicle || null;
    this.newServiceRecord = {
      vehicleId: vehicle?.id || '',
      serviceType: 'Regular',
      description: '',
      cost: 0,
      nextServiceDate: new Date()
    };
  }

  closeServiceModal(): void {
    this.showServiceModal = false;
    this.selectedVehicle = null;
    this.newServiceRecord = {};
  }

  openDriverAssignModal(vehicle?: Vehicle): void {
    this.showDriverAssignModal = true;
    this.selectedVehicle = vehicle || null;
    this.selectedDriver = null;
  }

  closeDriverAssignModal(): void {
    this.showDriverAssignModal = false;
    this.selectedVehicle = null;
    this.selectedDriver = null;
  }

  openVehicleDetailsModal(vehicle: Vehicle): void {
    this.showVehicleDetailsModal = true;
    this.selectedVehicle = vehicle;
  }

  closeVehicleDetailsModal(): void {
    this.showVehicleDetailsModal = false;
    this.selectedVehicle = null;
  }

  openFuelDetailsModal(record: FuelRecord): void {
    this.showFuelDetailsModal = true;
    this.selectedFuelRecord = record;
  }

  closeFuelDetailsModal(): void {
    this.showFuelDetailsModal = false;
    this.selectedFuelRecord = null;
  }

  openRouteAssignModal(vehicle?: Vehicle): void {
    this.showRouteAssignModal = true;
    this.selectedVehicle = vehicle || null;
    this.selectedRoute = vehicle?.route || null;
  }

  closeRouteAssignModal(): void {
    this.showRouteAssignModal = false;
    this.selectedVehicle = null;
    this.selectedRoute = null;
  }

  // Action Methods
  addVehicle(): void {
    if (this.newVehicle.vehicleNumber && this.newVehicle.make && this.newVehicle.model) {
      const newVehicle: Vehicle = {
        id: (this.vehicles.length + 1).toString(),
        vehicleNumber: this.newVehicle.vehicleNumber!,
        vehicleType: this.newVehicle.vehicleType!,
        make: this.newVehicle.make!,
        model: this.newVehicle.model!,
        year: this.newVehicle.year || new Date().getFullYear(),
        capacity: this.newVehicle.capacity || 'N/A',
        fuelType: this.newVehicle.fuelType!,
        registrationNumber: this.newVehicle.registrationNumber || 'TBD',
        insuranceExpiry: this.newVehicle.insuranceExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        lastServiceDate: this.newVehicle.lastServiceDate || new Date(),
        nextServiceDate: this.newVehicle.nextServiceDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        assignedDriver: this.newVehicle.assignedDriver,
        currentStatus: this.newVehicle.currentStatus!,
        location: this.newVehicle.location || 'Garage',
        route: this.newVehicle.route,
        fuelEfficiency: this.newVehicle.fuelEfficiency!,
        totalKm: this.newVehicle.totalKm!,
        lastFuelDate: this.newVehicle.lastFuelDate,
        maintenanceStatus: this.newVehicle.maintenanceStatus!
      };

      this.vehicles.push(newVehicle);
      this.calculateStatistics();
      this.closeAddVehicleModal();
      this.toastService.success('Vehicle added successfully!');
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  updateVehicle(): void {
    if (this.editVehicle.vehicleNumber && this.editVehicle.make && this.editVehicle.model && this.selectedVehicle) {
      // Find the vehicle in the array and update it
      const vehicleIndex = this.vehicles.findIndex(v => v.id === this.selectedVehicle!.id);
      if (vehicleIndex !== -1) {
        // Update the vehicle with edited data
        this.vehicles[vehicleIndex] = {
          ...this.vehicles[vehicleIndex],
          vehicleNumber: this.editVehicle.vehicleNumber!,
          vehicleType: this.editVehicle.vehicleType!,
          make: this.editVehicle.make!,
          model: this.editVehicle.model!,
          year: this.editVehicle.year!,
          capacity: this.editVehicle.capacity!,
          fuelType: this.editVehicle.fuelType!,
          registrationNumber: this.editVehicle.registrationNumber!,
          insuranceExpiry: this.editVehicle.insuranceExpiry!,
          lastServiceDate: this.editVehicle.lastServiceDate!,
          nextServiceDate: this.editVehicle.nextServiceDate!,
          assignedDriver: this.editVehicle.assignedDriver,
          currentStatus: this.editVehicle.currentStatus!,
          location: this.editVehicle.location!,
          route: this.editVehicle.route,
          fuelEfficiency: this.editVehicle.fuelEfficiency!,
          totalKm: this.editVehicle.totalKm!,
          lastFuelDate: this.editVehicle.lastFuelDate,
          maintenanceStatus: this.editVehicle.maintenanceStatus!
        };

        this.calculateStatistics();
        this.closeEditVehicleModal();
        this.toastService.success(`Vehicle ${this.editVehicle.vehicleNumber} updated successfully!`);
      } else {
        this.toastService.error('Vehicle not found');
      }
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  addFuelRecord(): void {
    if (this.newFuelRecord.vehicleId && this.newFuelRecord.fuelAmount && this.newFuelRecord.kmReading) {
      const newRecord: FuelRecord = {
        id: (this.fuelRecords.length + 1).toString(),
        vehicleId: this.newFuelRecord.vehicleId!,
        date: this.newFuelRecord.date!,
        time: this.newFuelRecord.time!,
        fuelAmount: this.newFuelRecord.fuelAmount!,
        kmReading: this.newFuelRecord.kmReading!,
        cost: this.newFuelRecord.cost!,
        location: this.newFuelRecord.location!,
        driverId: this.newFuelRecord.driverId!
      };

      this.fuelRecords.unshift(newRecord);
      
      // Update vehicle data
      const vehicle = this.getVehicleById(this.newFuelRecord.vehicleId!);
      if (vehicle) {
        vehicle.lastFuelDate = this.newFuelRecord.date!;
        vehicle.totalKm = this.newFuelRecord.kmReading!;
      }

      // Update statistics
      this.todayFuelConsumption += this.newFuelRecord.fuelAmount!;
      this.todayFuelCost += this.newFuelRecord.cost!;
      this.monthlyFuelConsumption += this.newFuelRecord.fuelAmount!;

      this.closeFuelEntryModal();
      this.toastService.success('Fuel record added successfully!');
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  scheduleService(): void {
    if (this.newServiceRecord.vehicleId && this.newServiceRecord.description) {
      const vehicle = this.getVehicleById(this.newServiceRecord.vehicleId);
      if (vehicle) {
        vehicle.lastServiceDate = new Date();
        vehicle.nextServiceDate = this.newServiceRecord.nextServiceDate;
        vehicle.maintenanceStatus = 'Good';
        vehicle.currentStatus = this.vehicleStatuses[0]; // Active
        
        this.calculateStatistics();
        this.closeServiceModal();
        this.toastService.success('Service scheduled successfully!');
      }
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  assignDriver(): void {
    if (this.selectedVehicle && this.selectedDriver) {
      // Remove driver from previous vehicle if any
      const previousVehicle = this.vehicles.find(v => v.assignedDriver?.id === this.selectedDriver!.id);
      if (previousVehicle) {
        previousVehicle.assignedDriver = undefined;
        previousVehicle.currentStatus = this.vehicleStatuses[0]; // Available
      }

      // Assign driver to new vehicle
      this.selectedVehicle.assignedDriver = this.selectedDriver;
      this.selectedVehicle.currentStatus = this.vehicleStatuses[0]; // Active
      
      // Update driver status
      this.selectedDriver.status = 'On Duty';
      this.selectedDriver.assignedVehicle = this.selectedVehicle.vehicleNumber;

      this.calculateStatistics();
      this.closeDriverAssignModal();
      this.toastService.success(`Driver ${this.selectedDriver.name} assigned to ${this.selectedVehicle.vehicleNumber} successfully!`);
    } else {
      this.toastService.warning('Please select both vehicle and driver');
    }
  }

  assignRoute(): void {
    if (this.selectedVehicle) {
      this.selectedVehicle.route = this.selectedRoute || undefined;
      this.closeRouteAssignModal();
      
      if (this.selectedRoute) {
        this.toastService.success(`Route "${this.selectedRoute.name}" assigned to ${this.selectedVehicle.vehicleNumber} successfully!`);
      } else {
        this.toastService.info(`Route removed from ${this.selectedVehicle.vehicleNumber}`);
      }
    } else {
      this.toastService.warning('Please select a vehicle');
    }
  }

  updateVehicleStatus(vehicle: Vehicle, newStatus: string): void {
    const status = this.vehicleStatuses.find(s => s.name === newStatus);
    if (status) {
      vehicle.currentStatus = status;
      
      // Update driver status if vehicle becomes unavailable
      if (newStatus === 'Breakdown' || newStatus === 'Maintenance') {
        if (vehicle.assignedDriver) {
          vehicle.assignedDriver.status = 'Available';
          vehicle.assignedDriver.assignedVehicle = undefined;
          vehicle.assignedDriver = undefined;
        }
      }
      
      this.calculateStatistics();
      this.toastService.info(`Vehicle ${vehicle.vehicleNumber} status updated to ${newStatus}`);
    }
  }

  removeDriver(vehicle: Vehicle): void {
    if (vehicle.assignedDriver) {
      vehicle.assignedDriver.status = 'Available';
      vehicle.assignedDriver.assignedVehicle = undefined;
      vehicle.assignedDriver = undefined;
      vehicle.currentStatus = this.vehicleStatuses[0]; // Active
      
      this.calculateStatistics();
      this.toastService.info(`Driver removed from ${vehicle.vehicleNumber}`);
    }
  }

  deleteVehicle(vehicle: Vehicle): void {
    // Show confirmation toast instead of confirm dialog
    this.toastService.info(`Deleting vehicle ${vehicle.vehicleNumber}...`);
    
    // Simulate confirmation after a short delay
    setTimeout(() => {
      const index = this.vehicles.indexOf(vehicle);
      if (index > -1) {
        this.vehicles.splice(index, 1);
        this.calculateStatistics();
        this.toastService.success(`Vehicle ${vehicle.vehicleNumber} deleted successfully!`);
      }
    }, 500);
  }

  // Utility Methods
  getAvailableVehicles(): Vehicle[] {
    return this.vehicles.filter(v => v.currentStatus.name === 'Active');
  }

  getVehiclesByType(type: string): Vehicle[] {
    return this.vehicles.filter(v => v.vehicleType.category === type);
  }

  getFuelRecordsForToday(): FuelRecord[] {
    const today = new Date();
    return this.fuelRecords.filter(r => 
      r.date.getDate() === today.getDate() && 
      r.date.getMonth() === today.getMonth() && 
      r.date.getFullYear() === today.getFullYear()
    );
  }

  getTotalFuelCostToday(): number {
    return this.getFuelRecordsForToday().reduce((total, record) => total + record.cost, 0);
  }

  getTotalFuelConsumptionToday(): number {
    return this.getFuelRecordsForToday().reduce((total, record) => total + record.fuelAmount, 0);
  }

  // Real-time updates
  refreshData(): void {
    this.calculateStatistics();
    // In a real application, this would fetch fresh data from the server
    this.toastService.success('Data refreshed successfully!');
  }

  exportData(): void {
    // In a real application, this would export data to CSV/Excel
    this.toastService.info('Data export functionality would be implemented here');
  }

  printReport(): void {
    // In a real application, this would generate a printable report
    this.toastService.info('Print report functionality would be implemented here');
  }

  // Route CRUD Methods
  openAddRouteModal(): void {
    this.showAddEditRouteModal = true;
    this.isEditMode = false;
    this.newRoute = {};
  }

  openEditRouteModal(route: Route): void {
    this.showAddEditRouteModal = true;
    this.isEditMode = true;
    this.newRoute = { ...route };
  }

  closeAddEditRouteModal(): void {
    this.showAddEditRouteModal = false;
    this.newRoute = {};
    this.isEditMode = false;
  }

  saveRoute(): void {
    if (this.newRoute.name && this.newRoute.type && this.newRoute.startLocation && this.newRoute.endLocation && this.newRoute.distance && this.newRoute.estimatedTime) {
      if (this.isEditMode) {
        // Update existing route
        const index = this.routes.findIndex(r => r.id === this.newRoute.id);
        if (index !== -1) {
          this.routes[index] = { ...this.newRoute } as Route;
          this.toastService.success(`Route "${this.newRoute.name}" updated successfully!`);
        }
      } else {
        // Add new route
        const newRoute: Route = {
          id: `R-${this.routes.length + 1}`,
          name: this.newRoute.name,
          type: this.newRoute.type,
          startLocation: this.newRoute.startLocation,
          endLocation: this.newRoute.endLocation,
          distance: this.newRoute.distance,
          estimatedTime: this.newRoute.estimatedTime
        };
        this.routes.push(newRoute);
        this.toastService.success(`Route "${newRoute.name}" added successfully!`);
      }
      this.closeAddEditRouteModal();
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  deleteRoute(route: Route): void {
    // Check if any vehicles are assigned to this route
    const assignedVehicles = this.vehicles.filter(v => v.route?.id === route.id);
    
    if (assignedVehicles.length > 0) {
      // Show warning toast instead of confirm dialog
      this.toastService.warning(`${assignedVehicles.length} vehicle(s) are assigned to this route. Removing route from all vehicles...`);
      
      // Simulate confirmation after a short delay
      setTimeout(() => {
        // Remove route from all assigned vehicles
        assignedVehicles.forEach(vehicle => {
          vehicle.route = undefined;
        });
        
        this.toastService.info(`${assignedVehicles.length} vehicle(s) unassigned from route`);
        
        // Delete the route
        const index = this.routes.findIndex(r => r.id === route.id);
        if (index !== -1) {
          this.routes.splice(index, 1);
          this.toastService.success(`Route "${route.name}" deleted successfully!`);
        }
      }, 1000);
    } else {
      // No vehicles assigned, delete directly
      const index = this.routes.findIndex(r => r.id === route.id);
      if (index !== -1) {
        this.routes.splice(index, 1);
        this.toastService.success(`Route "${route.name}" deleted successfully!`);
      }
    }
  }

  openRouteDetailsModal(route: Route): void {
    this.showRouteDetailsModal = true;
    this.selectedRouteForDetails = route;
  }

  closeRouteDetailsModal(): void {
    this.showRouteDetailsModal = false;
    this.selectedRouteForDetails = null;
  }

  getVehicleCountByRoute(route: Route): number {
    return this.vehicles.filter(v => v.route?.id === route.id).length;
  }

  getVehiclesByRoute(route: Route): Vehicle[] {
    return this.vehicles.filter(v => v.route?.id === route.id);
  }

  viewRouteVehicles(route: Route): void {
    this.openRouteDetailsModal(route);
  }

  // Toggle view mode
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}