export type VehicleStatus = "Available" | "On Trip" | "In Shop" | "Retired";
export type DriverStatus = "On Duty" | "Off Duty" | "Suspended" | "On Trip";
export type TripStatus = "Draft" | "Dispatched" | "Completed" | "Cancelled";

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  type: "Truck" | "Van" | "Bike";
  licensePlate: string;
  maxCapacity: number;
  odometer: number;
  status: VehicleStatus;
  region: string;
  lastService: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseCategory: string[];
  licenseExpiry: string;
  status: DriverStatus;
  safetyScore: number;
  tripsCompleted: number;
  phone: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  cargoWeight: number;
  status: TripStatus;
  createdAt: string;
  completedAt?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  tripId: string;
  liters: number;
  cost: number;
  date: string;
}

export const vehicles: Vehicle[] = [
  { id: "v1", name: "Van-05", model: "Ford Transit", type: "Van", licensePlate: "FL-4521", maxCapacity: 500, odometer: 45200, status: "Available", region: "North", lastService: "2026-01-15" },
  { id: "v2", name: "Truck-12", model: "Volvo FH16", type: "Truck", licensePlate: "FL-8833", maxCapacity: 12000, odometer: 128300, status: "On Trip", region: "East", lastService: "2026-02-01" },
  { id: "v3", name: "Van-08", model: "Mercedes Sprinter", type: "Van", licensePlate: "FL-2190", maxCapacity: 800, odometer: 62100, status: "In Shop", region: "West", lastService: "2026-02-10" },
  { id: "v4", name: "Bike-03", model: "Honda CB500X", type: "Bike", licensePlate: "FL-0091", maxCapacity: 20, odometer: 12400, status: "Available", region: "Central", lastService: "2026-01-28" },
  { id: "v5", name: "Truck-07", model: "Scania R500", type: "Truck", licensePlate: "FL-6677", maxCapacity: 15000, odometer: 210500, status: "On Trip", region: "South", lastService: "2025-12-20" },
  { id: "v6", name: "Van-11", model: "VW Crafter", type: "Van", licensePlate: "FL-3344", maxCapacity: 600, odometer: 34800, status: "Available", region: "North", lastService: "2026-02-05" },
  { id: "v7", name: "Truck-03", model: "MAN TGX", type: "Truck", licensePlate: "FL-9912", maxCapacity: 18000, odometer: 95600, status: "Retired", region: "East", lastService: "2025-11-10" },
  { id: "v8", name: "Bike-07", model: "Yamaha MT-07", type: "Bike", licensePlate: "FL-0055", maxCapacity: 15, odometer: 8900, status: "Available", region: "Central", lastService: "2026-02-14" },
];

export const drivers: Driver[] = [
  { id: "d1", name: "Alex Rivera", licenseCategory: ["Van", "Truck"], licenseExpiry: "2027-06-15", status: "On Duty", safetyScore: 92, tripsCompleted: 234, phone: "+1-555-0101" },
  { id: "d2", name: "Maria Chen", licenseCategory: ["Van", "Bike"], licenseExpiry: "2026-03-01", status: "On Trip", safetyScore: 97, tripsCompleted: 312, phone: "+1-555-0102" },
  { id: "d3", name: "James Okafor", licenseCategory: ["Truck"], licenseExpiry: "2026-08-20", status: "On Duty", safetyScore: 85, tripsCompleted: 178, phone: "+1-555-0103" },
  { id: "d4", name: "Sara Kim", licenseCategory: ["Van", "Truck", "Bike"], licenseExpiry: "2025-12-01", status: "Off Duty", safetyScore: 78, tripsCompleted: 145, phone: "+1-555-0104" },
  { id: "d5", name: "Carlos Mendez", licenseCategory: ["Truck"], licenseExpiry: "2027-01-30", status: "On Trip", safetyScore: 91, tripsCompleted: 267, phone: "+1-555-0105" },
  { id: "d6", name: "Priya Patel", licenseCategory: ["Van", "Bike"], licenseExpiry: "2026-11-15", status: "On Duty", safetyScore: 95, tripsCompleted: 198, phone: "+1-555-0106" },
];

export const trips: Trip[] = [
  { id: "t1", vehicleId: "v2", driverId: "d2", origin: "Warehouse A", destination: "Port City", cargoWeight: 8500, status: "Dispatched", createdAt: "2026-02-20" },
  { id: "t2", vehicleId: "v5", driverId: "d5", origin: "Hub Central", destination: "Metro District", cargoWeight: 14200, status: "Dispatched", createdAt: "2026-02-19" },
  { id: "t3", vehicleId: "v1", driverId: "d1", origin: "Depot North", destination: "Retail Park", cargoWeight: 320, status: "Completed", createdAt: "2026-02-18", completedAt: "2026-02-18" },
  { id: "t4", vehicleId: "v6", driverId: "d6", origin: "Factory B", destination: "Airport Zone", cargoWeight: 450, status: "Draft", createdAt: "2026-02-21" },
  { id: "t5", vehicleId: "v4", driverId: "d3", origin: "Central Hub", destination: "Suburb East", cargoWeight: 15, status: "Completed", createdAt: "2026-02-17", completedAt: "2026-02-17" },
  { id: "t6", vehicleId: "v1", driverId: "d1", origin: "Retail Park", destination: "Depot North", cargoWeight: 200, status: "Cancelled", createdAt: "2026-02-16" },
];

export const maintenanceLogs: MaintenanceLog[] = [
  { id: "m1", vehicleId: "v3", type: "Oil Change", description: "Full synthetic oil change + filter", cost: 250, date: "2026-02-10", status: "In Progress" },
  { id: "m2", vehicleId: "v1", type: "Tire Rotation", description: "Rotate all 4 tires, check pressure", cost: 120, date: "2026-01-15", status: "Completed" },
  { id: "m3", vehicleId: "v5", type: "Brake Inspection", description: "Front and rear brake pad inspection", cost: 180, date: "2025-12-20", status: "Completed" },
  { id: "m4", vehicleId: "v2", type: "Engine Tune-up", description: "Scheduled 100k km engine tune-up", cost: 850, date: "2026-02-01", status: "Completed" },
  { id: "m5", vehicleId: "v7", type: "Transmission Repair", description: "Major transmission overhaul", cost: 4500, date: "2025-11-10", status: "Completed" },
  { id: "m6", vehicleId: "v6", type: "Battery Replacement", description: "New AGM battery installation", cost: 320, date: "2026-02-05", status: "Completed" },
];

export const fuelLogs: FuelLog[] = [
  { id: "f1", vehicleId: "v1", tripId: "t3", liters: 45, cost: 72, date: "2026-02-18" },
  { id: "f2", vehicleId: "v2", tripId: "t1", liters: 120, cost: 192, date: "2026-02-20" },
  { id: "f3", vehicleId: "v5", tripId: "t2", liters: 180, cost: 288, date: "2026-02-19" },
  { id: "f4", vehicleId: "v4", tripId: "t5", liters: 8, cost: 12.8, date: "2026-02-17" },
  { id: "f5", vehicleId: "v6", tripId: "t4", liters: 55, cost: 88, date: "2026-02-21" },
];

export function getVehicleById(id: string) { return vehicles.find(v => v.id === id); }
export function getDriverById(id: string) { return drivers.find(d => d.id === id); }

export function getStatusClass(status: string): string {
  switch (status) {
    case "Available":
    case "On Duty":
    case "Completed":
      return "status-available";
    case "On Trip":
    case "Dispatched":
      return "status-on-trip";
    case "In Shop":
    case "In Progress":
    case "Scheduled":
    case "Draft":
      return "status-in-shop";
    case "Retired":
    case "Cancelled":
    case "Suspended":
      return "status-retired";
    case "Off Duty":
      return "status-off-duty";
    default:
      return "status-off-duty";
  }
}
