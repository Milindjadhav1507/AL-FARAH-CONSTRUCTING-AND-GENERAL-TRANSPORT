import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

interface ReportCategory {
  id: string;
  name: string;
  icon: string;
  reports: Report[];
}

interface Report {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface ReportFilter {
  dateFrom: string;
  dateTo: string;
  vehicleType: string;
  project: string;
  driver: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, NgxEchartsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  selectedCategory: string = 'vehicle-master';
  selectedReport: Report | null = null;
  showSidebar: boolean = true;

  // Filters
  filters: ReportFilter = {
    dateFrom: '',
    dateTo: '',
    vehicleType: '',
    project: '',
    driver: '',
    status: ''
  };

  // Report Categories
  reportCategories: ReportCategory[] = [
    {
      id: 'vehicle-master',
      name: 'Vehicle Master Reports',
      icon: 'fa-truck',
      reports: [
        { id: 'vehicle-master-list', name: 'Vehicle Master List', description: 'All 600 vehicles\' full data in one report', icon: 'fa-list', category: 'vehicle-master' },
        { id: 'vehicle-allocation', name: 'Vehicle Allocation Report', description: 'Which vehicle is assigned to which project/site', icon: 'fa-project-diagram', category: 'vehicle-master' },
        { id: 'vehicle-expiry', name: 'Vehicle Expiry Report', description: 'Insurance, Registration, License expiry reminders', icon: 'fa-calendar-times', category: 'vehicle-master' }
      ]
    },
    {
      id: 'fuel-management',
      name: 'Fuel Management Reports',
      icon: 'fa-gas-pump',
      reports: [
        { id: 'fuel-issue-register', name: 'Fuel Issue Register', description: 'All daily fuel issues with cost and vehicle linkage', icon: 'fa-clipboard-list', category: 'fuel-management' },
        { id: 'fuel-consumption-summary', name: 'Fuel Consumption Summary', description: 'Total fuel used per month/project/vehicle', icon: 'fa-chart-bar', category: 'fuel-management' }
      ]
    },
    // {
    //   id: 'maintenance-workshop',
    //   name: 'Maintenance & Workshop',
    //   icon: 'fa-wrench',
    //   reports: [
    //     { id: 'maintenance-job-card', name: 'Maintenance Job Card Register', description: 'List of all opened/closed repair jobs', icon: 'fa-tools', category: 'maintenance-workshop' },
    //     { id: 'maintenance-cost-summary', name: 'Maintenance Cost Summary', description: 'Total cost by vehicle/project/month', icon: 'fa-dollar-sign', category: 'maintenance-workshop' },
    //     { id: 'pending-maintenance', name: 'Pending Maintenance Report', description: 'Vehicles currently under repair', icon: 'fa-hourglass-half', category: 'maintenance-workshop' },
    //     { id: 'downtime-analysis', name: 'Downtime Analysis Report', description: 'How long each vehicle was unavailable', icon: 'fa-clock', category: 'maintenance-workshop' },
    //     { id: 'parts-usage', name: 'Parts Usage Report', description: 'Track spare parts used in repairs', icon: 'fa-cogs', category: 'maintenance-workshop' },
    //     { id: 'service-due', name: 'Service Due Report', description: 'Vehicles due for next preventive service', icon: 'fa-calendar-check', category: 'maintenance-workshop' }
    //   ]
    // },
    // {
    //   id: 'driver-tracking',
    //   name: 'Driver & Time Tracking',
    //   icon: 'fa-user-clock',
    //   reports: [
    //     // { id: 'driver-allocation', name: 'Driver Allocation Report', description: 'Driver → Vehicle mapping with date/time', icon: 'fa-user-tag', category: 'driver-tracking' },
    //     { id: 'driver-attendance', name: 'Driver Attendance/Timesheet Report', description: 'Hours logged per day', icon: 'fa-calendar-check', category: 'driver-tracking' },
    //     { id: 'driver-performance', name: 'Driver Performance Summary', description: 'Trips completed, fuel efficiency, punctuality', icon: 'fa-star', category: 'driver-tracking' },
    //     // { id: 'violation-accident', name: 'Violation/Accident Report', description: 'Vehicle incidents, fines, etc.', icon: 'fa-car-crash', category: 'driver-tracking' }
    //   ]
    // },
    // {
    //   id: 'alerts-exceptions',
    //   name: 'Alerts & Exceptions',
    //   icon: 'fa-bell',
    //   reports: [
    //     { id: 'insurance-expiry-alerts', name: 'Insurance/Registration Expiry Alerts', description: 'Vehicles with documents due next 30 days', icon: 'fa-bell', category: 'alerts-exceptions' },
    //     { id: 'overdue-maintenance', name: 'Overdue Maintenance Report', description: 'Vehicles not serviced on time', icon: 'fa-exclamation-triangle', category: 'alerts-exceptions' },
    //     { id: 'fuel-entry-missing', name: 'Fuel Entry Missing Report', description: 'Vehicles with no fuel record in past week', icon: 'fa-question-circle', category: 'alerts-exceptions' },
    //     { id: 'odometer-anomaly', name: 'Odometer Anomaly Report', description: 'Suspicious odometer readings', icon: 'fa-bug', category: 'alerts-exceptions' }
    //   ]
    // }
  ];

  // Dropdown options
  vehicleTypes: string[] = ['All', 'Double Cabin Pickup', 'Dumper', '3 Ton Pickup', 'Low Bed Trailor', 'Station Wagon', 'Flat Bed Trailor', 'Mini Bus', 'Excavator', 'Desert Bus', 'Shovel', '30 Seater Bus', 'Wheel Dozer', '60 Seater Bus', 'Bull Dozer', 'Diesel Tanker', 'Water Tanker', 'Bob Cat', 'Hiab Crane', 'Tipper', 'Mobile Crane', 'Trailor', 'Grader'];
  projects: string[] = ['All', 'Shah Field', 'Asab Field', 'Beda Zayed', 'Qusaweira', 'Abu Dhabi City', 'Dubai Project', 'Sharjah Site'];
  statuses: string[] = ['All', 'Active', 'Maintenance', 'Idle', 'Breakdown'];

  ngOnInit(): void {
    // Set default date range (last 30 days)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.filters.dateTo = today.toISOString().split('T')[0];
    this.filters.dateFrom = lastMonth.toISOString().split('T')[0];

    // Load Vehicle Master List report by default
    const vehicleMasterListReport = this.reportCategories
      .find(c => c.id === 'vehicle-master')
      ?.reports.find(r => r.id === 'vehicle-master-list');
    
    if (vehicleMasterListReport) {
      console.log('Loading Vehicle Master List by default:', vehicleMasterListReport);
      this.selectReport(vehicleMasterListReport);
    } else {
      // Fallback to first report from the selected category
      const category = this.reportCategories.find(c => c.id === this.selectedCategory);
      if (category && category.reports.length > 0) {
        this.selectReport(category.reports[0]);
      }
    }
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    const category = this.reportCategories.find(c => c.id === categoryId);
    if (category && category.reports.length > 0) {
      this.selectReport(category.reports[0]);
    }
  }

  selectReport(report: Report): void {
    console.log('Selecting Report:', report);
    this.selectedReport = report;
    // Also set the correct category when selecting a report
    this.selectedCategory = report.category;
    
    // Set default status filter to 'Active' for Vehicle Master List
    if (report.id === 'vehicle-master-list') {
      this.filters.status = 'Active';
    }
    
    console.log('Report Selected - ID:', this.selectedReport?.id, 'Category:', this.selectedCategory);
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  generateReport(): void {
    console.log('Generating report:', this.selectedReport?.name);
    console.log('Filters:', this.filters);
    // Implement report generation logic
  }

  applyFilters(): void {
    // Hook for quick filters in Vehicle Master List and others
    console.log('Applying filters:', this.filters);
    // In a real app, trigger data reload here
  }

  exportToExcel(): void {
    console.log('Exporting to Excel');
    // Implement Excel export
  }

  exportToPDF(): void {
    console.log('Exporting to PDF');
    // Implement PDF export
  }

  exportToCSV(): void {
    console.log('Exporting to CSV');
    // Implement CSV export
  }

  scheduleReport(): void {
    console.log('Scheduling report');
    // Implement report scheduling
  }

  resetFilters(): void {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.filters = {
      dateFrom: lastMonth.toISOString().split('T')[0],
      dateTo: today.toISOString().split('T')[0],
      vehicleType: '',
      project: '',
      driver: '',
      status: ''
    };
  }

  // Modal management
  showDetailsModal: boolean = false;
  selectedRecordDetails: any = null;
  activeModalTab: string = 'vehicle-info';

  // ECharts options for Fuel Consumption Trend
  fuelConsumptionChartOption: EChartsOption = {
    title: {
      text: 'Monthly Fuel Consumption',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Fuel (Litres)', 'Cost (AED)'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Litres',
        position: 'left',
        axisLabel: {
          formatter: '{value} L'
        }
      },
      {
        type: 'value',
        name: 'Cost (AED)',
        position: 'right',
        axisLabel: {
          formatter: 'AED {value}'
        }
      }
    ],
    series: [
      {
        name: 'Fuel (Litres)',
        type: 'bar',
        data: [420, 450, 380, 460, 440, 450],
        itemStyle: {
          color: '#3b82f6'
        }
      },
      {
        name: 'Cost (AED)',
        type: 'line',
        yAxisIndex: 1,
        data: [5040, 5400, 4560, 5520, 5280, 5400],
        itemStyle: {
          color: '#f59e0b'
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  };

  openDetailsModal(record: any, reportType: string): void {
    this.selectedRecordDetails = {
      ...record,
      reportType: reportType
    };
    this.showDetailsModal = true;
    this.activeModalTab = 'vehicle-info'; // Reset to first tab
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedRecordDetails = null;
    this.activeModalTab = 'vehicle-info';
  }

  setActiveModalTab(tab: string): void {
    this.activeModalTab = tab;
  }

  // Helper method to parse float values in template
  parseFloat(value: any): number {
    return parseFloat(value);
  }
}