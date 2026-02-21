import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { trips, vehicles, drivers, getVehicleById, getDriverById } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Trips = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const { toast } = useToast();

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter((d) => d.status === "On Duty" && new Date(d.licenseExpiry) > new Date());

  const handleCargoChange = (val: string) => {
    setCargoWeight(val);
    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    if (vehicle && Number(val) > vehicle.maxCapacity) {
      setCapacityError(`Exceeds max capacity of ${vehicle.maxCapacity} kg`);
    } else {
      setCapacityError("");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (capacityError) return;
    setDialogOpen(false);
    toast({ title: "Trip Created", description: "New trip has been dispatched." });
    setSelectedVehicle("");
    setSelectedDriver("");
    setCargoWeight("");
  };

  return (
    <DashboardLayout title="Trip Dispatcher" subtitle="Create, assign, and manage delivery trips">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3">
          {["All", "Draft", "Dispatched", "Completed", "Cancelled"].map((s) => (
            <button key={s} className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${s === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
              {s}
            </button>
          ))}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Trip</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Create New Trip</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={selectedVehicle} onValueChange={(v) => { setSelectedVehicle(v); setCapacityError(""); }}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select available vehicle" /></SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name} — {v.maxCapacity}kg max</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select available driver" /></SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} — Score: {d.safetyScore}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Origin</Label><Input placeholder="Warehouse A" className="bg-secondary border-border" /></div>
                <div className="space-y-2"><Label>Destination</Label><Input placeholder="Port City" className="bg-secondary border-border" /></div>
              </div>
              <div className="space-y-2">
                <Label>Cargo Weight (kg)</Label>
                <Input type="number" value={cargoWeight} onChange={(e) => handleCargoChange(e.target.value)} placeholder="Enter weight" className={`bg-secondary border-border ${capacityError ? "border-destructive" : ""}`} />
                {capacityError && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" /> {capacityError}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!!capacityError || !selectedVehicle || !selectedDriver}>
                Dispatch Trip
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Trip ID</TableHead>
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">Driver</TableHead>
              <TableHead className="text-muted-foreground">Route</TableHead>
              <TableHead className="text-muted-foreground">Cargo</TableHead>
              <TableHead className="text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} className="border-border">
                <TableCell className="font-mono font-medium text-foreground">{trip.id.toUpperCase()}</TableCell>
                <TableCell>{getVehicleById(trip.vehicleId)?.name}</TableCell>
                <TableCell>{getDriverById(trip.driverId)?.name}</TableCell>
                <TableCell className="text-sm">{trip.origin} → {trip.destination}</TableCell>
                <TableCell>{trip.cargoWeight.toLocaleString()} kg</TableCell>
                <TableCell className="text-sm">{trip.createdAt}</TableCell>
                <TableCell><StatusPill status={trip.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Trips;
