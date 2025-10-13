import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

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
  status: 'Operational' | 'Under Maintenance' | 'Full';
}

interface Room {
  id: string;
  campId: string;
  roomNumber: string;
  floor: number;
  capacity: number; // beds per room
  occupiedBeds: number;
  availableBeds: number;
  status: 'Available' | 'Occupied' | 'Full' | 'Maintenance';
  roomType: 'Standard' | 'Deluxe' | 'Shared' | 'Private';
}

interface Occupant {
  id: string;
  campId: string;
  roomId: string;
  name: string;
  employeeID: string;
  type: 'Company Employee' | 'Contractor' | 'External Worker' | 'Visitor';
  department?: string;
  company?: string; // For external workers
  nationality: string;
  emiratesID: string;
  phone: string;
  checkInDate: Date;
  checkOutDate?: Date;
  bedNumber: number;
  status: 'Active' | 'Checked Out' | 'On Leave';
}

@Component({
  selector: 'app-camp-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camp-manage.component.html',
  styleUrl: './camp-manage.component.css'
})
export class CampManageComponent implements OnInit {
  camps: Camp[] = [];
  rooms: Room[] = [];
  occupants: Occupant[] = [];
  
  selectedCamp: Camp | null = null;
  selectedRoom: Room | null = null;
  selectedOccupant: Occupant | null = null;
  
  // View state
  selectedView: 'overview' | 'camps' | 'rooms' | 'occupants' = 'overview';
  selectedCampId: string = '';
  
  // Modal states
  showCampDetailsModal: boolean = false;
  showRoomDetailsModal: boolean = false;
  showOccupantDetailsModal: boolean = false;
  showAddOccupantModal: boolean = false;
  showAddRoomModal: boolean = false;
  
  // Form data
  newOccupant: Partial<Occupant> = {};
  newRoom: Partial<Room> = {};
  
  // Filters
  searchTerm: string = '';
  filterOccupantType: string = 'All';
  filterRoomStatus: string = 'All';
  selectedRoomType: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 25, 50, 100];
  
  // Dropdown options
  occupantTypes: Array<'Company Employee' | 'Contractor' | 'External Worker' | 'Visitor'> = 
    ['Company Employee', 'Contractor', 'External Worker', 'Visitor'];
  roomTypes: Array<'Standard' | 'Deluxe' | 'Shared' | 'Private'> = 
    ['Standard', 'Deluxe', 'Shared', 'Private'];
  departments: string[] = ['Administration', 'Operations', 'Finance', 'HR', 'Maintenance', 'Logistics', 'IT'];
  nationalities: string[] = ['UAE', 'India', 'Pakistan', 'Bangladesh', 'Philippines', 'Egypt', 'Jordan', 'Sri Lanka', 'Nepal', 'Other'];

  // Expose Math to template
  Math = Math;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.generateCamps();
    this.generateRooms();
    this.generateOccupants();
  }

  generateCamps(): void {
    this.camps = [
      {
        id: 'CAMP-001',
        name: 'Shah Field Camp',
        location: 'Shah Field, Abu Dhabi',
        totalCapacity: 200,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRooms: 50, // 200 capacity / 4 beds per room
        occupancyRate: 0,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym'],
        status: 'Operational'
      },
      {
        id: 'CAMP-002',
        name: 'Asab Field Camp',
        location: 'Asab Field, Abu Dhabi',
        totalCapacity: 1341,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRooms: 336, // 1341 capacity / 4 beds per room (rounded up)
        occupancyRate: 0,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym', 'Library', 'Sports Ground'],
        status: 'Operational'
      },
      {
        id: 'CAMP-003',
        name: 'Beda Zayed Camp',
        location: 'Beda Zayed, Abu Dhabi',
        totalCapacity: 780,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRooms: 195, // 780 capacity / 4 beds per room
        occupancyRate: 0,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room', 'Gym', 'Canteen'],
        status: 'Operational'
      },
      {
        id: 'CAMP-004',
        name: 'Qusaweira Camp',
        location: 'Qusaweira, Abu Dhabi',
        totalCapacity: 329,
        occupiedRooms: 0,
        availableRooms: 0,
        totalRooms: 83, // 329 capacity / 4 beds per room (rounded up)
        occupancyRate: 0,
        facilities: ['Dining Hall', 'Recreation Room', 'Laundry', 'Medical Room', 'Prayer Room'],
        status: 'Operational'
      }
    ];
  }

  generateRooms(): void {
    this.camps.forEach(camp => {
      const bedsPerRoom = 4;
      for (let i = 1; i <= camp.totalRooms; i++) {
        const occupiedBeds = Math.random() > 0.3 ? Math.floor(Math.random() * (bedsPerRoom + 1)) : 0;
        const room: Room = {
          id: `${camp.id}-R${String(i).padStart(3, '0')}`,
          campId: camp.id,
          roomNumber: `${String(Math.floor((i - 1) / 20) + 1)}${String(i).padStart(2, '0')}`,
          floor: Math.floor((i - 1) / 20) + 1,
          capacity: bedsPerRoom,
          occupiedBeds: occupiedBeds,
          availableBeds: bedsPerRoom - occupiedBeds,
          status: occupiedBeds === 0 ? 'Available' : occupiedBeds === bedsPerRoom ? 'Full' : 'Occupied',
          roomType: i % 10 === 0 ? 'Deluxe' : i % 5 === 0 ? 'Private' : 'Shared'
        };
        this.rooms.push(room);
      }
    });
    this.updateCampOccupancy();
  }

  generateOccupants(): void {
    const firstNames = ['Salman', 'Shah Rukh', 'Aamir', 'Hrithik', 'Akshay', 'Ajay', 'Ranbir', 'Ranveer', 'Varun', 'Sidharth', 
                        'Tiger', 'Arjun', 'Kartik', 'Ayushmann', 'Rajkummar', 'Vicky', 'Irrfan', 'Saif'];
    const lastNames = ['Khan', 'Kumar', 'Kapoor', 'Singh', 'Malhotra', 'Shroff', 'Dhawan', 'Aaryan', 'Sharma', 'Pandey',
                       'Rajput', 'Kaushal', 'Tandon', 'Bhatia', 'Joshi', 'Gupta', 'Agarwal', 'Verma'];

    let occupantCounter = 1;
    
    this.rooms.forEach(room => {
      if (room.occupiedBeds > 0) {
        for (let bed = 1; bed <= room.occupiedBeds; bed++) {
          const firstName = firstNames[occupantCounter % firstNames.length];
          const lastName = lastNames[occupantCounter % lastNames.length];
          const type = this.occupantTypes[occupantCounter % 4];
          
          const checkInDate = new Date();
          checkInDate.setDate(checkInDate.getDate() - Math.floor(Math.random() * 180)); // 0-6 months ago

          const occupant: Occupant = {
            id: `OCC-${String(occupantCounter).padStart(4, '0')}`,
            campId: room.campId,
            roomId: room.id,
            name: `${firstName} ${lastName}`,
            employeeID: type === 'Company Employee' ? `EMP-${String(occupantCounter).padStart(4, '0')}` : `EXT-${String(occupantCounter).padStart(4, '0')}`,
            type: type,
            department: type === 'Company Employee' ? this.departments[occupantCounter % this.departments.length] : undefined,
            company: type !== 'Company Employee' ? `${['Al Khaleej', 'Emirates', 'Gulf', 'Arabian', 'United'][occupantCounter % 5]} Contracting` : undefined,
            nationality: this.nationalities[occupantCounter % this.nationalities.length],
            emiratesID: `784-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000000) + 1000000}-${occupantCounter % 10}`,
            phone: `+971 ${Math.floor(Math.random() * 9) + 50} ${Math.floor(Math.random() * 9000000) + 1000000}`,
            checkInDate: checkInDate,
            bedNumber: bed,
            status: 'Active'
          };
          
          this.occupants.push(occupant);
          occupantCounter++;
        }
      }
    });
  }

  updateCampOccupancy(): void {
    this.camps.forEach(camp => {
      const campRooms = this.rooms.filter(r => r.campId === camp.id);
      const occupiedRooms = campRooms.filter(r => r.status === 'Occupied' || r.status === 'Full').length;
      const totalOccupiedBeds = campRooms.reduce((sum, room) => sum + room.occupiedBeds, 0);
      
      camp.occupiedRooms = occupiedRooms;
      camp.availableRooms = camp.totalRooms - occupiedRooms;
      camp.occupancyRate = Math.round((totalOccupiedBeds / camp.totalCapacity) * 100);
      camp.status = camp.occupancyRate >= 95 ? 'Full' : 'Operational';
    });
  }

  // View switching
  switchView(view: 'overview' | 'camps' | 'rooms' | 'occupants'): void {
    this.selectedView = view;
    this.currentPage = 1;
  }

  selectCamp(campId: string): void {
    this.selectedCampId = campId;
    this.selectedView = 'rooms';
  }

  // Camp methods
  openCampDetails(camp: Camp): void {
    this.selectedCamp = camp;
    this.showCampDetailsModal = true;
  }

  closeCampDetailsModal(): void {
    this.showCampDetailsModal = false;
    this.selectedCamp = null;
  }

  getCampRooms(campId: string): Room[] {
    return this.rooms.filter(r => r.campId === campId);
  }

  getFilteredRooms(campId: string, roomType: string): Room[] {
    let rooms = this.rooms.filter(r => r.campId === campId);
    
    if (roomType && roomType !== '') {
      rooms = rooms.filter(r => r.roomType === roomType);
    }
    
    return rooms;
  }

  getCampOccupants(campId: string): Occupant[] {
    return this.occupants.filter(o => o.campId === campId);
  }

  getCompanyEmployeeCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type === 'Company Employee').length;
  }

  getExternalWorkerCount(campId: string): number {
    return this.occupants.filter(o => o.campId === campId && o.type !== 'Company Employee').length;
  }

  // Room methods
  openRoomDetails(room: Room): void {
    this.selectedRoom = room;
    this.showRoomDetailsModal = true;
  }

  closeRoomDetailsModal(): void {
    this.showRoomDetailsModal = false;
    this.selectedRoom = null;
  }

  getRoomOccupants(roomId: string): Occupant[] {
    return this.occupants.filter(o => o.roomId === roomId);
  }

  getCampName(campId: string): string {
    return this.camps.find(c => c.id === campId)?.name || 'Unknown Camp';
  }

  // Occupant methods
  openOccupantDetails(occupant: Occupant): void {
    this.selectedOccupant = occupant;
    this.showOccupantDetailsModal = true;
  }

  closeOccupantDetailsModal(): void {
    this.showOccupantDetailsModal = false;
    this.selectedOccupant = null;
  }

  openAddOccupantModal(room?: Room): void {
    this.newOccupant = {};
    this.selectedRoomType = '';
    if (room) {
      this.newOccupant.campId = room.campId;
      this.newOccupant.roomId = room.id;
    }
    this.showAddOccupantModal = true;
  }

  closeAddOccupantModal(): void {
    this.showAddOccupantModal = false;
    this.newOccupant = {};
    this.selectedRoomType = '';
  }

  saveOccupant(): void {
    if (this.newOccupant.name && this.newOccupant.employeeID && this.newOccupant.type && this.newOccupant.campId && this.newOccupant.roomId) {
      // Find the selected room to check availability
      const selectedRoom = this.rooms.find(r => r.id === this.newOccupant.roomId);
      
      if (selectedRoom && selectedRoom.availableBeds > 0) {
        // Create new occupant
        const newOccupant: Occupant = {
          id: `occ-${Date.now()}`,
          name: this.newOccupant.name!,
          employeeID: this.newOccupant.employeeID!,
          type: this.newOccupant.type!,
          campId: this.newOccupant.campId!,
          roomId: this.newOccupant.roomId!,
          bedNumber: selectedRoom.capacity - selectedRoom.availableBeds + 1,
          checkInDate: new Date(),
          status: 'Active',
          nationality: this.newOccupant.nationality || 'UAE',
          emiratesID: this.newOccupant.emiratesID || `784-${Date.now()}`,
          phone: this.newOccupant.phone || '+971-50-1234567',
          department: this.newOccupant.department || 'General',
          company: this.newOccupant.company || 'Al Farah',
          checkOutDate: undefined
        };

        // Add to occupants list
        this.occupants.push(newOccupant);

        // Update room occupancy
        selectedRoom.occupiedBeds++;
        selectedRoom.availableBeds--;
        selectedRoom.status = selectedRoom.occupiedBeds === selectedRoom.capacity ? 'Full' : 'Occupied';

        // Update camp occupancy
        this.updateCampOccupancy();

        // Close modal and reset form
        this.closeAddOccupantModal();
        this.toastService.success(`${newOccupant.name} checked in successfully!`);
      } else {
        this.toastService.error('Selected room is full. Please choose another room.');
      }
    } else {
      this.toastService.error('Please fill in all required fields');
    }
  }

  checkOutOccupant(occupant: Occupant): void {
    // Show confirmation toast instead of confirm dialog
    this.toastService.info(`Checking out ${occupant.name}...`);
    
    // Simulate confirmation after a short delay
    setTimeout(() => {
      occupant.status = 'Checked Out';
      occupant.checkOutDate = new Date();
      
      // Update room occupancy
      const room = this.rooms.find(r => r.id === occupant.roomId);
      if (room) {
        room.occupiedBeds--;
        room.availableBeds++;
        room.status = room.occupiedBeds === 0 ? 'Available' : room.occupiedBeds === room.capacity ? 'Full' : 'Occupied';
      }
      
      this.updateCampOccupancy();
      this.toastService.success(`${occupant.name} checked out successfully!`);
    }, 500);
  }

  // Utility methods
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB');
  }

  getDaysStayed(checkInDate: Date): number {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const diff = today.getTime() - checkIn.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  getOccupancyColor(rate: number): string {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 75) return 'text-yellow-600';
    if (rate >= 50) return 'text-blue-600';
    return 'text-green-600';
  }

  getRoomStatusColor(status: string): string {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-blue-100 text-blue-800';
      case 'Full': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getOccupantTypeColor(type: string): string {
    switch (type) {
      case 'Company Employee': return 'bg-blue-100 text-blue-800';
      case 'Contractor': return 'bg-purple-100 text-purple-800';
      case 'External Worker': return 'bg-orange-100 text-orange-800';
      case 'Visitor': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Filtered data
  get filteredRooms(): Room[] {
    let result = this.selectedCampId 
      ? this.rooms.filter(r => r.campId === this.selectedCampId)
      : this.rooms;

    if (this.filterRoomStatus !== 'All') {
      result = result.filter(r => r.status === this.filterRoomStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r => 
        r.roomNumber.toLowerCase().includes(term) ||
        this.getCampName(r.campId).toLowerCase().includes(term)
      );
    }

    return result;
  }

  get filteredOccupants(): Occupant[] {
    let result = this.selectedCampId 
      ? this.occupants.filter(o => o.campId === this.selectedCampId && o.status === 'Active')
      : this.occupants.filter(o => o.status === 'Active');

    if (this.filterOccupantType !== 'All') {
      result = result.filter(o => o.type === this.filterOccupantType);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(o => 
        o.name.toLowerCase().includes(term) ||
        o.employeeID.toLowerCase().includes(term) ||
        o.emiratesID.includes(term) ||
        this.getCampName(o.campId).toLowerCase().includes(term)
      );
    }

    return result;
  }

  // Pagination
  get paginatedRooms(): Room[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRooms.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get paginatedOccupants(): Occupant[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOccupants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    const total = this.selectedView === 'rooms' ? this.filteredRooms.length : this.filteredOccupants.length;
    return Math.ceil(total / this.itemsPerPage);
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

  // Helper methods for template
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

  getActiveOccupantsBycamp(campId: string): number {
    return this.getCampOccupants(campId).filter(o => o.status === 'Active').length;
  }

  getContractorCount(campId: string): number {
    return this.getCampOccupants(campId).filter(o => o.type === 'Contractor' && o.status === 'Active').length;
  }

  getVisitorCount(campId: string): number {
    return this.getCampOccupants(campId).filter(o => o.type === 'Visitor' && o.status === 'Active').length;
  }

  getActiveRoomOccupants(roomId: string): Occupant[] {
    return this.getRoomOccupants(roomId).filter(o => o.status === 'Active');
  }

  getRoomNumberByOccupant(occupant: Occupant): string {
    return this.rooms.find(r => r.id === occupant.roomId)?.roomNumber || 'N/A';
  }

  getFloorByOccupant(occupant: Occupant): number {
    return this.rooms.find(r => r.id === occupant.roomId)?.floor || 0;
  }
}
