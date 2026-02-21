import DashboardLayout from "@/components/DashboardLayout";
import { fuelLogs, maintenanceLogs, getVehicleById } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fuel, Wrench, DollarSign } from "lucide-react";

const Expenses = () => {
  const totalFuel = fuelLogs.reduce((s, f) => s + f.cost, 0);
  const totalMaint = maintenanceLogs.reduce((s, m) => s + m.cost, 0);
  const totalOps = totalFuel + totalMaint;

  return (
    <DashboardLayout title="Expenses & Fuel Logging" subtitle="Financial tracking per asset">
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="kpi-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Fuel className="h-4 w-4" /> Total Fuel Cost</div>
          <p className="text-2xl font-bold text-fleet-on-trip">${totalFuel.toFixed(2)}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Wrench className="h-4 w-4" /> Total Maintenance</div>
          <p className="text-2xl font-bold text-fleet-in-shop">${totalMaint.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><DollarSign className="h-4 w-4" /> Total Operational</div>
          <p className="text-2xl font-bold text-foreground">${totalOps.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">Fuel Logs</h2>
      <div className="glass-card rounded-xl overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">Trip</TableHead>
              <TableHead className="text-muted-foreground">Liters</TableHead>
              <TableHead className="text-muted-foreground">Cost</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fuelLogs.map((f) => (
              <TableRow key={f.id} className="border-border">
                <TableCell className="font-medium text-foreground">{getVehicleById(f.vehicleId)?.name}</TableCell>
                <TableCell className="font-mono text-sm">{f.tripId.toUpperCase()}</TableCell>
                <TableCell>{f.liters} L</TableCell>
                <TableCell className="font-medium">${f.cost.toFixed(2)}</TableCell>
                <TableCell className="text-sm">{f.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
