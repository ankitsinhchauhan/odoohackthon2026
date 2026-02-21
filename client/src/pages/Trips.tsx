import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Trips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: "",
    driver: "",
    origin: "",
    destination: "",
    cargoWeight: ""
  });
  const [capacityError, setCapacityError] = useState("");
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [tripsData, vehiclesData, driversData] = await Promise.all([
        api.get('/trips'),
        api.get('/vehicles'),
        api.get('/drivers')
      ]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setDrivers(driversData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter((d) => d.status === "On Duty" && (d.licenseExpiry ? new Date(d.licenseExpiry) > new Date() : true));

  const handleCargoChange = (val: string) => {
    setFormData({ ...formData, cargoWeight: val });
    const vehicle = vehicles.find((v) => (v._id || v.id) === formData.vehicle);
    if (vehicle && Number(val) > vehicle.maxCapacity) {
      setCapacityError(`Exceeds max capacity of ${vehicle.maxCapacity} kg`);
    } else {
      setCapacityError("");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (capacityError) return;
    try {
      await api.post('/trips', formData);
      setDialogOpen(false);
      toast({ title: "Trip Created", description: "New trip has been dispatched." });
      setFormData({ vehicle: "", driver: "", origin: "", destination: "", cargoWeight: "" });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create trip." });
    }
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
                <Select value={formData.vehicle} onValueChange={(v) => { setFormData({ ...formData, vehicle: v }); setCapacityError(""); }}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select available vehicle" /></SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((v) => (
                      <SelectItem key={v._id || v.id} value={v._id || v.id}>{v.name} — {v.maxCapacity}kg max</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver</Label>
                <Select value={formData.driver} onValueChange={(v) => setFormData({ ...formData, driver: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select available driver" /></SelectTrigger>
                  <SelectContent>
                    {availableDrivers.map((d) => (
                      <SelectItem key={d._id || d.id} value={d._id || d.id}>{d.name} — Score: {d.safetyScore}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Origin</Label><Input placeholder="Warehouse A" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} className="bg-secondary border-border" required /></div>
                <div className="space-y-2"><Label>Destination</Label><Input placeholder="Port City" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="bg-secondary border-border" required /></div>
              </div>
              <div className="space-y-2">
                <Label>Cargo Weight (kg)</Label>
                <Input type="number" value={formData.cargoWeight} onChange={(e) => handleCargoChange(e.target.value)} placeholder="Enter weight" className={`bg-secondary border-border ${capacityError ? "border-destructive" : ""}`} required />
                {capacityError && (
                  <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" /> {capacityError}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={!!capacityError || !formData.vehicle || !formData.driver}>
                Dispatch Trip
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
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
                <TableRow key={trip._id || trip.id} className="border-border">
                  <TableCell className="font-mono font-medium text-foreground">{(trip._id || trip.id).substring(18).toUpperCase()}</TableCell>
                  <TableCell>{trip.vehicle?.name || 'N/A'}</TableCell>
                  <TableCell>{trip.driver?.name || 'N/A'}</TableCell>
                  <TableCell className="text-sm">{trip.origin} → {trip.destination}</TableCell>
                  <TableCell>{trip.cargoWeight?.toLocaleString()} kg</TableCell>
                  <TableCell className="text-sm">{new Date(trip.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell><StatusPill status={trip.status} /></TableCell>
                </TableRow>
              ))}
              {trips.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No trips found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Trips;
