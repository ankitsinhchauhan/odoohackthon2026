import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import KpiCard from "@/components/KpiCard";
import StatusPill from "@/components/StatusPill";
import { Truck, AlertTriangle, Activity, Package, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, dData, tData] = await Promise.all([
          api.get('/vehicles'),
          api.get('/drivers'),
          api.get('/trips')
        ]);
        setVehicles(vData);
        setDrivers(dData);
        setTrips(tData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeFleet = vehicles.filter((v) => v.status === "On Trip").length;
  const maintenanceAlerts = vehicles.filter((v) => v.status === "In Shop").length;
  const activeVehicles = vehicles.filter(v => v.status !== "Retired").length;
  const utilization = activeVehicles > 0 ? Math.round((activeFleet / activeVehicles) * 100) : 0;
  const pendingCargo = trips.filter((t) => t.status === "Draft" || t.status === "Pending").length;
  const recentTrips = trips.slice(0, 5);

  return (
    <DashboardLayout title="Command Center" subtitle="Real-time fleet overview and operations monitoring">
      {loading ? (
        <div className="flex h-96 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
      ) : (
        <>
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
                    <TableRow key={trip._id || trip.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{(trip._id || trip.id).substring(18).toUpperCase()}</TableCell>
                      <TableCell>{trip.vehicle?.name || 'N/A'}</TableCell>
                      <TableCell>{trip.driver?.name || 'N/A'}</TableCell>
                      <TableCell className="text-sm">
                        {trip.origin} → {trip.destination}
                      </TableCell>
                      <TableCell><StatusPill status={trip.status} /></TableCell>
                    </TableRow>
                  ))}
                  {recentTrips.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No recent trips</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Fleet Status */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Fleet Status</h2>
              <div className="space-y-3">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <div key={vehicle._id || vehicle.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{vehicle.name}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.licensePlate} · {vehicle.type}</p>
                    </div>
                    <StatusPill status={vehicle.status} />
                  </div>
                ))}
                {vehicles.length === 0 && <p className="text-center py-4 text-muted-foreground">No vehicles registered</p>}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {[
              { label: "Total Distance Today", value: "0 km", icon: TrendingUp },
              { label: "Active Drivers", value: drivers.filter(d => d.status === "On Duty" || d.status === "On Trip").length.toString(), icon: Activity },
              { label: "Completed Trips", value: trips.filter(t => t.status === "Completed").length.toString(), icon: Package },
              { label: "Avg Safety Score", value: drivers.length > 0 ? Math.round(drivers.reduce((a, d) => a + d.safetyScore, 0) / drivers.length).toString() : "0", icon: AlertTriangle },
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
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
