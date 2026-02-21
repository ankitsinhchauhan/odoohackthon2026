import DashboardLayout from "@/components/DashboardLayout";
import KpiCard from "@/components/KpiCard";
import StatusPill from "@/components/StatusPill";
import { vehicles, drivers, trips, getVehicleById, getDriverById } from "@/lib/mock-data";
import { Truck, AlertTriangle, Activity, Package, TrendingUp, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const activeFleet = vehicles.filter((v) => v.status === "On Trip").length;
  const maintenanceAlerts = vehicles.filter((v) => v.status === "In Shop").length;
  const utilization = Math.round((activeFleet / vehicles.filter(v => v.status !== "Retired").length) * 100);
  const pendingCargo = trips.filter((t) => t.status === "Draft").length;
  const recentTrips = trips.slice(0, 5);

  return (
    <DashboardLayout title="Command Center" subtitle="Real-time fleet overview and operations monitoring">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <KpiCard title="Active Fleet" value={activeFleet} subtitle={`${vehicles.length} total vehicles`} icon={Truck} trend={{ value: 12, positive: true }} />
        <KpiCard title="Maintenance Alerts" value={maintenanceAlerts} subtitle="Vehicles in shop" icon={AlertTriangle} trend={{ value: 5, positive: false }} />
        <KpiCard title="Utilization Rate" value={`${utilization}%`} subtitle="Assigned vs idle" icon={Activity} trend={{ value: 8, positive: true }} />
        <KpiCard title="Pending Cargo" value={pendingCargo} subtitle="Awaiting assignment" icon={Package} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Trips */}
        <div className="xl:col-span-2 glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Trips</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> Updated just now
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Trip</TableHead>
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Driver</TableHead>
                <TableHead className="text-muted-foreground">Route</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrips.map((trip) => (
                <TableRow key={trip.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{trip.id.toUpperCase()}</TableCell>
                  <TableCell>{getVehicleById(trip.vehicleId)?.name}</TableCell>
                  <TableCell>{getDriverById(trip.driverId)?.name}</TableCell>
                  <TableCell className="text-sm">
                    {trip.origin} → {trip.destination}
                  </TableCell>
                  <TableCell><StatusPill status={trip.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Fleet Status */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Fleet Status</h2>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.licensePlate} · {vehicle.type}</p>
                </div>
                <StatusPill status={vehicle.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Distance Today", value: "3,240 km", icon: TrendingUp },
          { label: "Active Drivers", value: drivers.filter(d => d.status === "On Duty" || d.status === "On Trip").length.toString(), icon: Activity },
          { label: "Completed Trips", value: trips.filter(t => t.status === "Completed").length.toString(), icon: Package },
          { label: "Avg Safety Score", value: Math.round(drivers.reduce((a, d) => a + d.safetyScore, 0) / drivers.length).toString(), icon: AlertTriangle },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <stat.icon className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
