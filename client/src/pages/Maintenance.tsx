import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { maintenanceLogs, getVehicleById } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";

const Maintenance = () => {
  const totalCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0);
  const activeServices = maintenanceLogs.filter((m) => m.status === "In Progress").length;

  return (
    <DashboardLayout title="Maintenance & Service Logs" subtitle="Preventative and reactive health tracking">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">Total Maintenance Cost</p>
          <p className="text-2xl font-bold text-foreground">${totalCost.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">Active Services</p>
          <p className="text-2xl font-bold text-fleet-in-shop">{activeServices}</p>
        </div>
        <div className="kpi-card">
          <p className="text-sm text-muted-foreground">Total Logs</p>
          <p className="text-2xl font-bold text-foreground">{maintenanceLogs.length}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Log Service</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">Service Type</TableHead>
              <TableHead className="text-muted-foreground">Description</TableHead>
              <TableHead className="text-muted-foreground">Cost</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceLogs.map((log) => (
              <TableRow key={log.id} className="border-border">
                <TableCell className="font-medium text-foreground">{getVehicleById(log.vehicleId)?.name}</TableCell>
                <TableCell className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5 text-muted-foreground" /> {log.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.description}</TableCell>
                <TableCell className="font-medium">${log.cost.toLocaleString()}</TableCell>
                <TableCell className="text-sm">{log.date}</TableCell>
                <TableCell><StatusPill status={log.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
