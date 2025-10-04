import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface KPIData {
  title: string;
  icon: string;
  primaryValue: string;
  secondaryValue: string;
  color: string;
  bgColor: string;
}

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

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  // KPI Data
  kpiData: KPIData[] = [
    {
      title: 'Vehicles',
      icon: 'truck',
      primaryValue: '600',
      secondaryValue: 'Active 540 • In Garage 35 • Idle 25',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Fuel',
      icon: 'fuel-pump',
      primaryValue: '12,400 L',
      secondaryValue: 'Fuel Cost: AED 148,000',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Maintenance',
      icon: 'wrench-screwdriver',
      primaryValue: '22',
      secondaryValue: 'Open Job Cards • Avg Downtime 2.4 days',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Manpower / Camp',
      icon: 'users',
      primaryValue: '92%',
      secondaryValue: 'Camp Occupancy (184/200 rooms)',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      title: 'Timesheets',
      icon: 'clock',
      primaryValue: '118',
      secondaryValue: 'Time Sheets Updated Today',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  // Fleet Utilization Data
  fleetUtilization = {
    active: { count: 540, percentage: 90, color: 'bg-green-500' },
    maintenance: { count: 35, percentage: 6, color: 'bg-red-500' },
    idle: { count: 25, percentage: 4, color: 'bg-yellow-500' }
  };

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

  constructor() { }

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    // Simulate chart loading
    setTimeout(() => {
      this.chartsLoaded = true;
    }, 1000);
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

}
