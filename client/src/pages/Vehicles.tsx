import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { vehicles, Vehicle } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Vehicles = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const filtered = vehicles.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.licensePlate.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || v.type === typeFilter;
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogOpen(false);
    toast({ title: "Vehicle Added", description: "New vehicle has been registered successfully." });
  };

  return (
    <DashboardLayout title="Vehicle Registry" subtitle="Manage and track all fleet assets">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 w-64 bg-secondary border-border" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32 bg-secondary border-border"><Filter className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Bike">Bike</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="On Trip">On Trip</SelectItem>
              <SelectItem value="In Shop">In Shop</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Register New Vehicle</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input placeholder="e.g. Van-12" className="bg-secondary border-border" /></div>
                <div className="space-y-2"><Label>Model</Label><Input placeholder="e.g. Ford Transit" className="bg-secondary border-border" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>License Plate</Label><Input placeholder="FL-XXXX" className="bg-secondary border-border" /></div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select><SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent><SelectItem value="Truck">Truck</SelectItem><SelectItem value="Van">Van</SelectItem><SelectItem value="Bike">Bike</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Max Capacity (kg)</Label><Input type="number" placeholder="500" className="bg-secondary border-border" /></div>
                <div className="space-y-2"><Label>Region</Label><Input placeholder="North" className="bg-secondary border-border" /></div>
              </div>
              <Button type="submit" className="w-full">Register Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Vehicle</TableHead>
              <TableHead className="text-muted-foreground">License Plate</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Capacity</TableHead>
              <TableHead className="text-muted-foreground">Odometer</TableHead>
              <TableHead className="text-muted-foreground">Region</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id} className="border-border">
                <TableCell>
                  <div><p className="font-medium text-foreground">{v.name}</p><p className="text-xs text-muted-foreground">{v.model}</p></div>
                </TableCell>
                <TableCell className="font-mono text-sm">{v.licensePlate}</TableCell>
                <TableCell>{v.type}</TableCell>
                <TableCell>{v.maxCapacity.toLocaleString()} kg</TableCell>
                <TableCell>{v.odometer.toLocaleString()} km</TableCell>
                <TableCell>{v.region}</TableCell>
                <TableCell><StatusPill status={v.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Vehicles;
