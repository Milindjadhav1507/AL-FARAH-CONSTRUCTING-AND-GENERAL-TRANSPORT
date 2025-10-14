import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface VehicleData {
  vehicleNo: string;
  type: string;
  project: string;
  fuelThisMonth: number;
  kmPerLiter: number;
  status: 'Active' | 'Garage' | 'Idle';
  maintenanceDue: string;
  remarks: string;
}

interface PurchaseData {
  poNumber: string;
  vendor: string;
  value: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface StockData {
  item: string;
  inward: number;
  outward: number;
  balance: number;
}

interface CampData {
  roomNo: string;
  employeeName: string;
  checkInDate: string;
}

interface Camp {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  occupiedRooms: number;
  availableRooms: number;
  totalRooms: number;
  occupancyRate: number;
  facilities: string[];
  status: 'Operational' | 'Full';
}

interface Occupant {
  id: string;
  campId: string;
  roomId: string;
  name: string;
  employeeID: string;
  type: 'Company Employee' | 'Contractor' | 'External Worker' | 'Visitor';
  department?: string;
  company?: string;
  nationality: string;
  emiratesID: string;
  phone: string;
  checkInDate: Date;
  bedNumber: number;
  status: 'Active' | 'Checked Out' | 'On Leave';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  // Camp Management Data
  camps: Camp[] = [];
  occupants: Occupant[] = [];
  
  // Modal states
  showCampDetailsModal: boolean = false;
  selectedCamp: Camp | null = null;
  
  // Fleet Statistics (Hard-coded - Updated Values)
  totalVehicles: number = 600;
  availableVehicles: number = 150;  // Active
  inUseVehicles: number = 151;      // Idle
  maintenanceVehicles: number = 145;  // Maintenance
  breakdownVehicles: number = 154;    // Breakdown

  // Fuel Statistics (Exactly from Fleet-Manage)
  todayFuelConsumption: number = 370;     // Today's consumption (L)
  todayFuelCost: number = 1110;           // Today's cost (AED)
  monthlyFuelConsumption: number = 11100; // Monthly consumption (L)
  averageEfficiency: number = 9.2;        // Average km/L
  fuelCostPerLiter: number = 3;           // AED per liter

  // Vehicle Data
  vehicleData: VehicleData[] = [
    { vehicleNo: 'AF-101', type: 'Tipper', project: 'Project A', fuelThisMonth: 480, kmPerLiter: 3.7, status: 'Active', maintenanceDue: '12-Oct-2025', remarks: 'OK' },
    { vehicleNo: 'AF-224', type: 'Bus', project: 'Project B', fuelThisMonth: 710, kmPerLiter: 2.8, status: 'Garage', maintenanceDue: '08-Oct-2025', remarks: 'Engine service' },
    { vehicleNo: 'AF-312', type: 'Pickup', project: 'Project C', fuelThisMonth: 310, kmPerLiter: 4.4, status: 'Active', maintenanceDue: '20-Oct-2025', remarks: '—' },
    { vehicleNo: 'AF-445', type: 'Crane', project: 'Project A', fuelThisMonth: 890, kmPerLiter: 2.1, status: 'Active', maintenanceDue: '15-Oct-2025', remarks: 'Good condition' },
    { vehicleNo: 'AF-567', type: 'Excavator', project: 'Project D', fuelThisMonth: 650, kmPerLiter: 3.2, status: 'Idle', maintenanceDue: '25-Oct-2025', remarks: 'Standby' }
  ];

  // Purchase Data
  purchaseData: PurchaseData[] = [
    { poNumber: 'PO-2024-001', vendor: 'ABC Motors', value: 45000, status: 'Pending' },
    { poNumber: 'PO-2024-002', vendor: 'XYZ Parts', value: 23000, status: 'Approved' },
    { poNumber: 'PO-2024-003', vendor: 'DEF Tools', value: 67000, status: 'Pending' },
    { poNumber: 'PO-2024-004', vendor: 'GHI Supplies', value: 12000, status: 'Approved' }
  ];

  // Stock Data
  stockData: StockData[] = [
    { item: 'Engine Oil 15W40', inward: 200, outward: 150, balance: 50 },
    { item: 'Brake Pads', inward: 100, outward: 85, balance: 15 },
    { item: 'Air Filters', inward: 50, outward: 30, balance: 20 },
    { item: 'Hydraulic Fluid', inward: 80, outward: 60, balance: 20 }
  ];

  // Camp Data
  campData: CampData[] = [
    { roomNo: 'R-101', employeeName: 'Ahmed Hassan', checkInDate: '15-Sep-2024' },
    { roomNo: 'R-102', employeeName: 'Mohammed Ali', checkInDate: '20-Sep-2024' },
    { roomNo: 'R-103', employeeName: 'Omar Khalil', checkInDate: '18-Sep-2024' },
    { roomNo: 'R-104', employeeName: 'Yusuf Ahmed', checkInDate: '22-Sep-2024' }
  ];

  // Chart data for fuel trend (mock data)
  fuelTrendData = [
    { day: 'Mon', liters: 1200, cost: 14400 },
    { day: 'Tue', liters: 1350, cost: 16200 },
    { day: 'Wed', liters: 1100, cost: 13200 },
    { day: 'Thu', liters: 1450, cost: 17400 },
    { day: 'Fri', liters: 1300, cost: 15600 },
    { day: 'Sat', liters: 800, cost: 9600 },
    { day: 'Sun', liters: 600, cost: 7200 }
  ];

  // Vehicle efficiency data
  vehicleEfficiency = [
    { vehicle: 'AF-312', efficiency: 4.4, status: 'excellent' },
    { vehicle: 'AF-101', efficiency: 3.7, status: 'good' },
    { vehicle: 'AF-567', efficiency: 3.2, status: 'average' },
    { vehicle: 'AF-224', efficiency: 2.8, status: 'poor' },
    { vehicle: 'AF-445', efficiency: 2.1, status: 'poor' }
  ];

  showFuelChart = true; // Toggle between liters and cost
  chartsLoaded = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.generateCamps();
    this.generateOccupants();
    // Simulate chart loading
    setTimeout(() => {
      this.chartsLoaded = true;
    }, 1000);
  }

  generateCamps(): void {
    this.camps = [
      {
        id: 'CAMP-001',
        name: 'Shah Field Camp',
        location: 'Shah Field, Abu Dhabi',
        totalCapacity: 200,
        occupiedRooms: 46,
        availableRooms: 4,
        totalRooms: 50,
        occupancyRate: 92,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym'],
        status: 'Operational'
      },
      {
        id: 'CAMP-002',
        name: 'Asab Field Camp',
        location: 'Asab Field, Abu Dhabi',
        totalCapacity: 1341,
        occupiedRooms: 262,
        availableRooms: 74,
        totalRooms: 336,
        occupancyRate: 78,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym', 'Library', 'Sports Ground'],
        status: 'Operational'
      },
      {
        id: 'CAMP-003',
        name: 'Beda Zayed Camp',
        location: 'Beda Zayed, Abu Dhabi',
        totalCapacity: 780,
        occupiedRooms: 127,
        availableRooms: 68,
        totalRooms: 195,
        occupancyRate: 65,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym', 'Canteen'],
        status: 'Operational'
      },
      {
        id: 'CAMP-004',
        name: 'Qusaweira Camp',
        location: 'Qusaweira, Abu Dhabi',
        totalCapacity: 329,
        occupiedRooms: 71,
        availableRooms: 12,
        totalRooms: 83,
        occupancyRate: 86,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room'],
        status: 'Operational'
      }
    ];
  }

  generateOccupants(): void {
    const types: Array<'Company Employee' | 'Contractor' | 'External Worker' | 'Visitor'> = 
      ['Company Employee', 'Contractor', 'External Worker', 'Visitor'];
    
    // Generate realistic occupant data for each camp
    this.camps.forEach(camp => {
      const occupantCount = Math.round(camp.totalCapacity * (camp.occupancyRate / 100));
      for (let i = 0; i < occupantCount; i++) {
        const type = types[i % 4];
        this.occupants.push({
          id: `OCC-${camp.id}-${i}`,
          campId: camp.id,
          roomId: `${camp.id}-R${i}`,
          name: `Occupant ${i}`,
          employeeID: type === 'Company Employee' ? `EMP-${i}` : `EXT-${i}`,
          type: type,
          department: type === 'Company Employee' ? 'Operations' : undefined,
          company: type !== 'Company Employee' ? 'External Company' : undefined,
          nationality: 'UAE',
          emiratesID: `784-1234-567890-${i}`,
          phone: `+971 50 ${1000000 + i}`,
          checkInDate: new Date(),
          bedNumber: (i % 4) + 1,
          status: 'Active'
        });
      }
    });
  }

  toggleFuelChart(): void {
    this.showFuelChart = !this.showFuelChart;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Garage': return 'bg-red-100 text-red-800';
      case 'Idle': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEfficiencyStatus(efficiency: number): string {
    if (efficiency >= 4.0) return 'text-green-600';
    if (efficiency >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }

  isChartReady(): boolean {
    return this.chartsLoaded;
  }

  // Camp Management Helper Methods
  getTotalCapacity(): number {
    return this.camps.reduce((sum, c) => sum + c.totalCapacity, 0);
  }

  getTotalActiveOccupants(): number {
    return this.occupants.filter(o => o.status === 'Active').length;
  }

  getAverageOccupancy(): number {
    if (this.camps.length === 0) return 0;
    return Math.round(this.camps.reduce((sum, c) => sum + c.occupancyRate, 0) / this.camps.length);
  }

  getActiveOccupantsByCamp(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.status === 'Active').length;
  }

  getCompanyEmployeeCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type === 'Company Employee').length;
  }

  getExternalWorkerCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type === 'External Worker').length;
  }

  getContractorCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type === 'Contractor').length;
  }

  getVisitorCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type === 'Visitor').length;
  }

  getOccupancyColor(rate: number): string {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 70) return 'text-orange-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-green-600';
  }

  // Fuel Calculation Methods (Exactly from Fleet-Manage)
  getTodayFuelConsumption(): number {
    return this.todayFuelConsumption;
  }

  getTodayFuelCost(): number {
    return this.todayFuelCost;
  }

  getMonthlyFuelConsumption(): number {
    return this.monthlyFuelConsumption;
  }

  getAverageEfficiency(): number {
    return this.averageEfficiency;
  }

  // Calculate distribution based on actual fleet data
  getFuelForActiveVehicles(): number {
    // Active vehicles (150) - avg 44.4 L/month each
    return Math.round((this.monthlyFuelConsumption * this.availableVehicles) / this.totalVehicles);
  }

  getFuelForIdleVehicles(): number {
    // Idle vehicles (151) - avg 27.9 L/month each  
    return Math.round((this.monthlyFuelConsumption * this.inUseVehicles) / this.totalVehicles * 0.63);
  }

  getFuelForNonOperational(): number {
    // Maintenance & Breakdown (299) - minimal consumption
    const activeAndIdleFuel = this.getFuelForActiveVehicles() + this.getFuelForIdleVehicles();
    return this.monthlyFuelConsumption - activeAndIdleFuel;
  }

  getActiveFuelPercentage(): number {
    return Math.round((this.getFuelForActiveVehicles() / this.monthlyFuelConsumption) * 100);
  }

  getIdleFuelPercentage(): number {
    return Math.round((this.getFuelForIdleVehicles() / this.monthlyFuelConsumption) * 100);
  }

  getNonOperationalFuelPercentage(): number {
    return Math.round((this.getFuelForNonOperational() / this.monthlyFuelConsumption) * 100);
  }

  getMonthlyTotalFuel(): string {
    return this.monthlyFuelConsumption.toLocaleString();
  }

  getMonthlyFuelCost(): number {
    // Cost = Monthly Fuel * Cost per liter / 1000 (to show in thousands)
    return Math.round((this.monthlyFuelConsumption * this.fuelCostPerLiter) / 1000);
  }

  // Navigation
  navigateToCampManagement(): void {
    this.router.navigate(['/camps-management']);
  }

  navigateToFleetManagement(status: string): void {
    // Navigate to fleet management with filter
    this.router.navigate(['/fleet-management'], { 
      queryParams: { status: status } 
    });
  }

  viewCampDetails(camp: Camp): void {
    // Open camp details modal
    this.selectedCamp = camp;
    this.showCampDetailsModal = true;
  }

  closeCampDetailsModal(): void {
    this.showCampDetailsModal = false;
    this.selectedCamp = null;
  }

  viewCampRooms(camp: Camp): void {
    // Navigate to camp management and show rooms for this camp
    this.router.navigate(['/camps-management'], { 
      queryParams: { campId: camp.id, view: 'rooms' } 
    });
  }

}
