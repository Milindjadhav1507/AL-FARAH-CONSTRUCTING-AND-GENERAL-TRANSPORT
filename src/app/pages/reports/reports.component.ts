import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';

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
  imports: [CommonModule, FormsModule, NgxEchartsModule, ToastComponent],
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
        // { id: 'fuel-issue-register', name: 'Fuel Issue Register', description: 'All daily fuel issues with cost and vehicle linkage', icon: 'fa-clipboard-list', category: 'fuel-management' },
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

  constructor(private toastService: ToastService) { }

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
    this.downloadFile('excel');
  }

  printReport(): void {
    console.log('Printing report');
    this.isPrinting = true;
    this.toastService.info('Preparing report for printing...');
    
    // Simulate print preparation
    setTimeout(() => {
      this.openChromePrintDialog();
      this.isPrinting = false;
    }, 1000);
  }

  exportToCSV(): void {
    console.log('Exporting to CSV');
    this.downloadFile('csv');
  }

  scheduleReport(): void {
    console.log('Scheduling report');
    this.showScheduleModal = true;
    this.toastService.info('Opening schedule options...');
  }

  // Download functionality
  downloadFile(format: 'excel' | 'csv'): void {
    const reportName = this.selectedReport?.name || 'Report';
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;
    
    // Set loading state
    this.isDownloading[format] = true;
    
    // Show starting toast
    this.toastService.info(`Preparing ${format.toUpperCase()} download...`);
    
    // Simulate file generation and download with delay
    setTimeout(() => {
      this.simulateDownload(fileName, format);
      this.isDownloading[format] = false;
    }, 1000); // 1 second delay to show loading
  }

  private simulateDownload(fileName: string, format: string): void {
    // Create a simple text content for demonstration
    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (format) {
      case 'excel':
        content = this.generateExcelContent();
        mimeType = 'text/csv';
        fileExtension = 'csv'; // Excel can open CSV files
        break;
      case 'csv':
        content = this.generateCSVContent();
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    this.showDownloadSuccess(format);
  }

  private generateExcelContent(): string {
    // Generate Excel content based on the selected report type with actual data
    const reportType = this.selectedReport?.id;
    
    switch (reportType) {
      case 'vehicle-master-list':
        return this.generateVehicleMasterExcelContent();
      case 'vehicle-allocation':
        return this.generateVehicleAllocationExcelContent();
      case 'vehicle-expiry':
        return this.generateVehicleExpiryExcelContent();
      case 'fuel-issue-register':
        return this.generateFuelIssueExcelContent();
      case 'fuel-consumption-summary':
        return this.generateFuelConsumptionExcelContent();
      default:
        return this.generateDefaultExcelContent();
    }
  }

  private generateVehicleMasterExcelContent(): string {
    // Use the exact same data as shown in the HTML table
    const headers = 'Vehicle No,Type,Make & Model,Year,Registration,Assigned Driver,Project,Odometer,Status,Insurance Expiry,Last Service';
    const data = [
      'AF-001,Double Cabin Pickup,Toyota Hilux,2023,DXB-T-12345,Ahmed Ali,Shah Field,45,230 km,Active,15-Mar-2026,15-Sep-2024',
      'AF-002,Dumper,Volvo FMX,2022,DXB-T-23456,Mohammed Hassan,Asab Field,78,450 km,Active,20-Apr-2026,20-Sep-2024',
      'AF-003,Excavator,CAT 320D,2021,DXB-T-34567,Khalid Ibrahim,Beda Zayed,12,890 hrs,Maintenance,05-Jun-2026,10-Sep-2024',
      'AF-004,60 Seater Bus,Yutong ZK6122H,2023,DXB-T-45678,Rashid Salem,Camp Transport,92,340 km,Active,10-Aug-2026,25-Aug-2024',
      'AF-005,Mobile Crane,Liebherr LTM,2023,DXB-T-56789,Unassigned,-,8,750 hrs,Idle,18-Apr-2027,05-Sep-2024'
    ];
    return [headers, ...data].join('\n');
  }

  private generateVehicleAllocationExcelContent(): string {
    const headers = 'Vehicle No,Type,Project/Site,Assigned Driver,Route,Status,Allocation Date,Expected Return';
    const data = [
      'AF-001,Double Cabin Pickup,Shah Field,Ahmed Ali,Shah Field to Camp A,Active,01-Oct-2024,31-Dec-2024',
      'AF-002,Dumper,Asab Field,Mohammed Hassan,Asab Field to Material Yard,Active,15-Sep-2024,15-Dec-2024',
      'AF-003,Excavator,Beda Zayed,Khalid Ibrahim,Beda Zayed to Equipment Depot,Maintenance,10-Sep-2024,15-Oct-2024',
      'AF-004,60 Seater Bus,Camp Transport,Rashid Salem,Camp A to Shah Field,Active,01-Oct-2024,31-Dec-2024',
      'AF-005,Mobile Crane,Heavy Lifting,Unassigned,Equipment Depot to Various Sites,Idle,01-Oct-2024,31-Dec-2024'
    ];
    return [headers, ...data].join('\n');
  }

  private generateVehicleExpiryExcelContent(): string {
    const headers = 'Vehicle No,Type,Insurance Expiry,Registration Expiry,License Expiry,Days Until Expiry,Status,Action Required';
    const data = [
      'AF-001,Double Cabin Pickup,15-Mar-2026,10-Apr-2026,15-Mar-2026,150 days,Good,None',
      'AF-002,Dumper,20-Apr-2026,15-May-2026,20-Apr-2026,180 days,Good,None',
      'AF-003,Excavator,05-Jun-2026,20-Jul-2026,05-Jun-2026,220 days,Good,None',
      'AF-004,60 Seater Bus,10-Aug-2026,25-Aug-2026,10-Aug-2026,280 days,Good,None',
      'AF-005,Mobile Crane,18-Apr-2027,03-May-2027,18-Apr-2027,410 days,Good,None'
    ];
    return [headers, ...data].join('\n');
  }

  private generateFuelIssueExcelContent(): string {
    const headers = 'Date,Vehicle No,Type,Driver,Project,Location,Fuel Amount (L),Cost (AED),Fuel Type,Receipt No';
    const data = [
      '01-Oct-2024,AF-001,Double Cabin Pickup,Ahmed Ali,Shah Field,Shah Field Fuel Station,50,150,Diesel,FUEL-001',
      '01-Oct-2024,AF-002,Dumper,Mohammed Hassan,Asab Field,Asab Field Fuel Station,120,360,Diesel,FUEL-002',
      '01-Oct-2024,AF-004,60 Seater Bus,Rashid Salem,Camp Transport,Camp Fuel Station,80,240,Diesel,FUEL-003',
      '02-Oct-2024,AF-005,Mobile Crane,Unassigned,Heavy Lifting,Equipment Depot Fuel Station,60,180,Diesel,FUEL-004',
      '02-Oct-2024,AF-001,Double Cabin Pickup,Ahmed Ali,Shah Field,Shah Field Fuel Station,45,135,Diesel,FUEL-005'
    ];
    return [headers, ...data].join('\n');
  }

  private generateFuelConsumptionExcelContent(): string {
    const headers = 'Month,Total Fuel (L),Total Cost (AED),Average Cost per Liter,Vehicles Active,Average Efficiency (km/L),Top Consumer Vehicle,Top Consumer Project';
    const data = [
      'October 2024,11,100,33,300,3.00,45,9.2,AF-002 (Dumper),Asab Field',
      'September 2024,10,800,32,400,3.00,42,8.9,AF-002 (Dumper),Asab Field',
      'August 2024,10,500,31,500,3.00,40,8.7,AF-002 (Dumper),Asab Field',
      'July 2024,10,200,30,600,3.00,38,8.5,AF-002 (Dumper),Asab Field',
      'June 2024,9,900,29,700,3.00,35,8.3,AF-002 (Dumper),Asab Field'
    ];
    return [headers, ...data].join('\n');
  }

  private generateDefaultExcelContent(): string {
    const headers = 'Record ID,Description,Status,Date,Value,Category';
    const data = [
      'R001,Sample Record 1,Active,01-Oct-2024,1000,Category A',
      'R002,Sample Record 2,Pending,02-Oct-2024,1500,Category B',
      'R003,Sample Record 3,Completed,03-Oct-2024,2000,Category A',
      'R004,Sample Record 4,Active,04-Oct-2024,750,Category C',
      'R005,Sample Record 5,Inactive,05-Oct-2024,3000,Category B'
    ];
    return [headers, ...data].join('\n');
  }


  private generateCSVContent(): string {
    const headers = 'Vehicle Number,Make,Model,Status,Location,Driver,Route,Fuel Efficiency,Total KM,Next Service';
    const data = [
      'AF-001,Mercedes,Tourismo,Available,Construction Site 2,Unassigned,Camp B to Site 2,5.45,81502,51 days',
      'AF-002,Volvo,FMX,Available,Construction Site 3,Unassigned,No Route,4.14,65609,59 days',
      'AF-003,Scania,P-Series,Available,Camp A,Unassigned,No Route,8.19,51096,-15 days',
      'AF-004,Caterpillar,320D,In Use,Camp B,Unassigned,Camp A to Site 1,9.15,179591,3 days',
      'AF-005,Komatsu,PC200,In Use,Service Center,Hassan Al Kaabi,Camp B to Site 2,6.56,93051,33 days'
    ];
    return [headers, ...data].join('\n');
  }

  private showDownloadSuccess(format: string): void {
    const formatName = format.toUpperCase();
    this.toastService.success(`${formatName} file downloaded successfully!`);
  }

  // Schedule modal properties
  showScheduleModal: boolean = false;
  scheduleData = {
    frequency: 'daily',
    time: '09:00',
    email: '',
    format: 'excel'
  };

  // Download states
  isDownloading = {
    excel: false,
    csv: false
  };
  
  // Print state
  isPrinting: boolean = false;

  closeScheduleModal(): void {
    this.showScheduleModal = false;
  }

  saveSchedule(): void {
    console.log('Saving schedule:', this.scheduleData);
    // Implement schedule saving logic
    this.closeScheduleModal();
    this.toastService.success('Report schedule saved successfully!');
  }


  getCurrentDateTime(): string {
    return new Date().toLocaleString();
  }

  openChromePrintDialog(): void {
    // Create a new window with print-optimized content
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      this.toastService.error('Unable to open print window. Please check your popup blocker.');
      return;
    }

    // Get the current report content
    const reportContent = this.generatePrintContent();
    
    // Write the content to the new window with print-optimized CSS
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.selectedReport?.name || 'Report'} - Print</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .print-button { display: none; }
          }
          
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4;
            color: #333;
          }
          
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
          }
          
          .report-title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #333; 
            margin-bottom: 5px;
          }
          
          .report-subtitle { 
            font-size: 14px; 
            color: #666; 
            margin-bottom: 10px;
          }
          
          .print-date { 
            font-size: 12px; 
            color: #999; 
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            font-size: 12px;
          }
          
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
          }
          
          th { 
            background-color: #f5f5f5; 
            font-weight: bold; 
            font-size: 11px;
          }
          
          td {
            font-size: 11px;
          }
          
          .footer { 
            margin-top: 30px; 
            text-align: center; 
            font-size: 12px; 
            color: #666; 
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          
          .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
          }
          
          .print-button:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <button class="print-button" onclick="window.print()">🖨️ Print</button>
        
        <div class="header">
          <div class="report-title">${this.selectedReport?.name || 'Report'}</div>
          <div class="report-subtitle">${this.selectedReport?.description || ''}</div>
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
        </div>
        
        ${reportContent}
        
        <div class="footer">
          <p><strong>Al Farah Contracting & General Transport Fleet Management System</strong></p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <script>
          // Auto-focus and show print dialog after content loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Show success message
    this.toastService.success('Print dialog opened! Use browser settings to configure your print options.');
  }

  private performPrint(): void {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.toastService.error('Unable to open print window. Please check your popup blocker.');
      return;
    }

    // Get the current report content
    const reportContent = this.generatePrintContent();
    
    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.selectedReport?.name || 'Report'} - Print</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .report-title { font-size: 24px; font-weight: bold; color: #333; }
          .report-subtitle { font-size: 14px; color: #666; margin-top: 5px; }
          .print-date { font-size: 12px; color: #999; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="report-title">${this.selectedReport?.name || 'Report'}</div>
          <div class="report-subtitle">${this.selectedReport?.description || ''}</div>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
        </div>
        ${reportContent}
        <div class="footer">
          <p>Generated by Al Farah Contracting & General Transport Fleet Management System</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      this.toastService.success('Report sent to printer successfully!');
    };
  }

  private generatePrintContent(): string {
    // Generate print-friendly content based on the current report
    const reportType = this.selectedReport?.id;
    
    switch (reportType) {
      case 'vehicle-master-list':
        return this.generateVehicleMasterPrintContent();
      case 'vehicle-allocation':
        return this.generateVehicleAllocationPrintContent();
      case 'vehicle-expiry':
        return this.generateVehicleExpiryPrintContent();
      case 'fuel-issue-register':
        return this.generateFuelIssuePrintContent();
      case 'fuel-consumption-summary':
        return this.generateFuelConsumptionPrintContent();
      default:
        return '<p>Report content not available for printing.</p>';
    }
  }

  private generateVehicleMasterPrintContent(): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Type</th>
            <th>Make & Model</th>
            <th>Year</th>
            <th>Registration</th>
            <th>Assigned Driver</th>
            <th>Project</th>
            <th>Odometer</th>
            <th>Status</th>
            <th>Insurance Expiry</th>
            <th>Last Service</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AF-001</td>
            <td>Double Cabin Pickup</td>
            <td>Toyota Hilux</td>
            <td>2023</td>
            <td>DXB-T-12345</td>
            <td>Ahmed Ali</td>
            <td>Shah Field</td>
            <td>45,230 km</td>
            <td>Active</td>
            <td>15-Mar-2026</td>
            <td>15-Sep-2024</td>
          </tr>
          <tr>
            <td>AF-002</td>
            <td>Dumper</td>
            <td>Volvo FMX</td>
            <td>2022</td>
            <td>DXB-T-23456</td>
            <td>Mohammed Hassan</td>
            <td>Asab Field</td>
            <td>78,450 km</td>
            <td>Active</td>
            <td>20-Apr-2026</td>
            <td>20-Sep-2024</td>
          </tr>
          <tr>
            <td>AF-003</td>
            <td>Excavator</td>
            <td>CAT 320D</td>
            <td>2021</td>
            <td>DXB-T-34567</td>
            <td>Khalid Ibrahim</td>
            <td>Beda Zayed</td>
            <td>12,890 hrs</td>
            <td>Maintenance</td>
            <td>05-Jun-2026</td>
            <td>10-Sep-2024</td>
          </tr>
          <tr>
            <td>AF-004</td>
            <td>60 Seater Bus</td>
            <td>Yutong ZK6122H</td>
            <td>2023</td>
            <td>DXB-T-45678</td>
            <td>Rashid Salem</td>
            <td>Camp Transport</td>
            <td>92,340 km</td>
            <td>Active</td>
            <td>10-Aug-2026</td>
            <td>25-Aug-2024</td>
          </tr>
          <tr>
            <td>AF-005</td>
            <td>Mobile Crane</td>
            <td>Liebherr LTM</td>
            <td>2023</td>
            <td>DXB-T-56789</td>
            <td>Unassigned</td>
            <td>-</td>
            <td>8,750 hrs</td>
            <td>Idle</td>
            <td>18-Apr-2027</td>
            <td>05-Sep-2024</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private generateVehicleAllocationPrintContent(): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Type</th>
            <th>Project/Site</th>
            <th>Assigned Driver</th>
            <th>Route</th>
            <th>Status</th>
            <th>Allocation Date</th>
            <th>Expected Return</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AF-001</td>
            <td>Double Cabin Pickup</td>
            <td>Shah Field</td>
            <td>Ahmed Ali</td>
            <td>Shah Field to Camp A</td>
            <td>Active</td>
            <td>01-Oct-2024</td>
            <td>31-Dec-2024</td>
          </tr>
          <tr>
            <td>AF-002</td>
            <td>Dumper</td>
            <td>Asab Field</td>
            <td>Mohammed Hassan</td>
            <td>Asab Field to Material Yard</td>
            <td>Active</td>
            <td>15-Sep-2024</td>
            <td>15-Dec-2024</td>
          </tr>
          <tr>
            <td>AF-003</td>
            <td>Excavator</td>
            <td>Beda Zayed</td>
            <td>Khalid Ibrahim</td>
            <td>Beda Zayed to Equipment Depot</td>
            <td>Maintenance</td>
            <td>10-Sep-2024</td>
            <td>15-Oct-2024</td>
          </tr>
          <tr>
            <td>AF-004</td>
            <td>60 Seater Bus</td>
            <td>Camp Transport</td>
            <td>Rashid Salem</td>
            <td>Camp A to Shah Field</td>
            <td>Active</td>
            <td>01-Oct-2024</td>
            <td>31-Dec-2024</td>
          </tr>
          <tr>
            <td>AF-005</td>
            <td>Mobile Crane</td>
            <td>Heavy Lifting</td>
            <td>Unassigned</td>
            <td>Equipment Depot to Various Sites</td>
            <td>Idle</td>
            <td>01-Oct-2024</td>
            <td>31-Dec-2024</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private generateVehicleExpiryPrintContent(): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Vehicle No</th>
            <th>Type</th>
            <th>Insurance Expiry</th>
            <th>Registration Expiry</th>
            <th>License Expiry</th>
            <th>Days Until Expiry</th>
            <th>Status</th>
            <th>Action Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>AF-001</td>
            <td>Double Cabin Pickup</td>
            <td>15-Mar-2026</td>
            <td>10-Apr-2026</td>
            <td>15-Mar-2026</td>
            <td>150 days</td>
            <td>Good</td>
            <td>None</td>
          </tr>
          <tr>
            <td>AF-002</td>
            <td>Dumper</td>
            <td>20-Apr-2026</td>
            <td>15-May-2026</td>
            <td>20-Apr-2026</td>
            <td>180 days</td>
            <td>Good</td>
            <td>None</td>
          </tr>
          <tr>
            <td>AF-003</td>
            <td>Excavator</td>
            <td>05-Jun-2026</td>
            <td>20-Jul-2026</td>
            <td>05-Jun-2026</td>
            <td>220 days</td>
            <td>Good</td>
            <td>None</td>
          </tr>
          <tr>
            <td>AF-004</td>
            <td>60 Seater Bus</td>
            <td>10-Aug-2026</td>
            <td>25-Aug-2026</td>
            <td>10-Aug-2026</td>
            <td>280 days</td>
            <td>Good</td>
            <td>None</td>
          </tr>
          <tr>
            <td>AF-005</td>
            <td>Mobile Crane</td>
            <td>18-Apr-2027</td>
            <td>03-May-2027</td>
            <td>18-Apr-2027</td>
            <td>410 days</td>
            <td>Good</td>
            <td>None</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private generateFuelIssuePrintContent(): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Vehicle No</th>
            <th>Type</th>
            <th>Driver</th>
            <th>Project</th>
            <th>Location</th>
            <th>Fuel Amount (L)</th>
            <th>Cost (AED)</th>
            <th>Fuel Type</th>
            <th>Receipt No</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>01-Oct-2024</td>
            <td>AF-001</td>
            <td>Double Cabin Pickup</td>
            <td>Ahmed Ali</td>
            <td>Shah Field</td>
            <td>Shah Field Fuel Station</td>
            <td>50</td>
            <td>150</td>
            <td>Diesel</td>
            <td>FUEL-001</td>
          </tr>
          <tr>
            <td>01-Oct-2024</td>
            <td>AF-002</td>
            <td>Dumper</td>
            <td>Mohammed Hassan</td>
            <td>Asab Field</td>
            <td>Asab Field Fuel Station</td>
            <td>120</td>
            <td>360</td>
            <td>Diesel</td>
            <td>FUEL-002</td>
          </tr>
          <tr>
            <td>01-Oct-2024</td>
            <td>AF-004</td>
            <td>60 Seater Bus</td>
            <td>Rashid Salem</td>
            <td>Camp Transport</td>
            <td>Camp Fuel Station</td>
            <td>80</td>
            <td>240</td>
            <td>Diesel</td>
            <td>FUEL-003</td>
          </tr>
          <tr>
            <td>02-Oct-2024</td>
            <td>AF-005</td>
            <td>Mobile Crane</td>
            <td>Unassigned</td>
            <td>Heavy Lifting</td>
            <td>Equipment Depot Fuel Station</td>
            <td>60</td>
            <td>180</td>
            <td>Diesel</td>
            <td>FUEL-004</td>
          </tr>
          <tr>
            <td>02-Oct-2024</td>
            <td>AF-001</td>
            <td>Double Cabin Pickup</td>
            <td>Ahmed Ali</td>
            <td>Shah Field</td>
            <td>Shah Field Fuel Station</td>
            <td>45</td>
            <td>135</td>
            <td>Diesel</td>
            <td>FUEL-005</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private generateFuelConsumptionPrintContent(): string {
    return `
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Fuel (L)</th>
            <th>Total Cost (AED)</th>
            <th>Average Cost per Liter</th>
            <th>Vehicles Active</th>
            <th>Average Efficiency (km/L)</th>
            <th>Top Consumer Vehicle</th>
            <th>Top Consumer Project</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>October 2024</td>
            <td>11,100</td>
            <td>33,300</td>
            <td>3.00</td>
            <td>45</td>
            <td>9.2</td>
            <td>AF-002 (Dumper)</td>
            <td>Asab Field</td>
          </tr>
          <tr>
            <td>September 2024</td>
            <td>10,800</td>
            <td>32,400</td>
            <td>3.00</td>
            <td>42</td>
            <td>8.9</td>
            <td>AF-002 (Dumper)</td>
            <td>Asab Field</td>
          </tr>
          <tr>
            <td>August 2024</td>
            <td>10,500</td>
            <td>31,500</td>
            <td>3.00</td>
            <td>40</td>
            <td>8.7</td>
            <td>AF-002 (Dumper)</td>
            <td>Asab Field</td>
          </tr>
          <tr>
            <td>July 2024</td>
            <td>10,200</td>
            <td>30,600</td>
            <td>3.00</td>
            <td>38</td>
            <td>8.5</td>
            <td>AF-002 (Dumper)</td>
            <td>Asab Field</td>
          </tr>
          <tr>
            <td>June 2024</td>
            <td>9,900</td>
            <td>29,700</td>
            <td>3.00</td>
            <td>35</td>
            <td>8.3</td>
            <td>AF-002 (Dumper)</td>
            <td>Asab Field</td>
          </tr>
        </tbody>
      </table>
    `;
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

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalVehicles: number = 600;
  
  get totalPages(): number {
    return Math.ceil(this.totalVehicles / this.itemsPerPage);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 7; // Show maximum 7 page numbers
    
    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, this.currentPage - 3);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust start page if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      console.log(`Navigated to page ${page}`);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      console.log(`Navigated to page ${this.currentPage}`);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      console.log(`Navigated to page ${this.currentPage}`);
    }
  }

  onItemsPerPageChange(): void {
    // Reset to first page when changing items per page
    this.currentPage = 1;
    console.log(`Items per page changed to ${this.itemsPerPage}`);
  }

  // Helper method to access Math in template
  get Math() {
    return Math;
  }
}