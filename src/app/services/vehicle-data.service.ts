import { Injectable } from '@angular/core';

// Interfaces
export interface VehicleType {
  id: string;
  name: string;
  category: string;
  icon: string;
  capacity: string;
}

export interface VehicleStatus {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  status: string;
  assignedVehicle?: string;
}

export interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedTime: number;
  type: string;
}

export interface Vehicle {
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

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {
  private vehicles: Vehicle[] = [];
  private isInitialized = false;

  // Vehicle Types Data
  vehicleTypes: VehicleType[] = [
    // Transport Vehicles
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
    
    // Construction Equipment
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

  // Drivers Data
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

  constructor() {
    this.initializeVehicles();
  }

  private initializeVehicles(): void {
    if (this.isInitialized) return;

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

    this.isInitialized = true;
  }

  // Public methods
  getAllVehicles(): Vehicle[] {
    return this.vehicles;
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find(v => v.id === id);
  }

  getVehiclesByStatus(status: string): Vehicle[] {
    if (status === 'all') return this.vehicles;
    return this.vehicles.filter(v => v.currentStatus.name === status);
  }

  getVehiclesByType(type: string): Vehicle[] {
    if (type === 'all') return this.vehicles;
    return this.vehicles.filter(v => v.vehicleType.category === type);
  }

  getVehicleStatistics() {
    const total = this.vehicles.length;
    const active = this.vehicles.filter(v => v.currentStatus.name === 'Active').length;
    const idle = this.vehicles.filter(v => v.currentStatus.name === 'Idle').length;
    const maintenance = this.vehicles.filter(v => v.currentStatus.name === 'Maintenance').length;
    const breakdown = this.vehicles.filter(v => v.currentStatus.name === 'Breakdown').length;

    return {
      total,
      active,
      idle,
      maintenance,
      breakdown
    };
  }

  getVehicleTypes(): VehicleType[] {
    return this.vehicleTypes;
  }

  getVehicleStatuses(): VehicleStatus[] {
    return this.vehicleStatuses;
  }

  getDrivers(): Driver[] {
    return this.drivers;
  }

  getRoutes(): Route[] {
    return this.routes;
  }

  // Helper method to format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // Helper method to format odometer reading
  formatOdometer(km: number, vehicleType: VehicleType): string {
    if (vehicleType.category === 'Construction') {
      return `${km.toLocaleString()} hrs`;
    }
    return `${km.toLocaleString()} km`;
  }
}
