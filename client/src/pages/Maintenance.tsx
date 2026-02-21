import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wrench, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Maintenance = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: "",
    type: "Routine",
    description: "",
    cost: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [logsData, vehiclesData] = await Promise.all([
        api.get('/maintenance'),
        api.get('/vehicles')
      ]);
      setLogs(logsData);
      setVehicles(vehiclesData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCost = logs.reduce((sum, m) => sum + m.cost, 0);
  const activeServices = logs.filter((m) => m.status === "In Progress").length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/maintenance', formData);
      setDialogOpen(false);
      toast({ title: "Service Logged", description: "Maintenance log has been saved." });
      setFormData({ vehicle: "", type: "Routine", description: "", cost: "", date: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to log service." });
    }
  };

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
          <p className="text-2xl font-bold text-foreground">{logs.length}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Log Service</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Log Maintenance Service</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={formData.vehicle} onValueChange={(v) => setFormData({ ...formData, vehicle: v })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v._id || v.id} value={v._id || v.id}>{v.name} ({v.licensePlate})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Routine">Routine</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                      <SelectItem value="Tires">Tires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Cost ($)</Label><Input type="number" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="bg-secondary border-border" required /></div>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-secondary border-border" required /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="Describe the service..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-secondary border-border" required /></div>
              <Button type="submit" className="w-full">Save Log</Button>
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
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Service Type</TableHead>
                <TableHead className="text-muted-foreground">Description</TableHead>
                <TableHead className="text-muted-foreground">Cost</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id || log.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{log.vehicle?.name || 'N/A'}</TableCell>
                  <TableCell className="flex items-center gap-2"><Wrench className="h-3.5 w-3.5 text-muted-foreground" /> {log.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.description}</TableCell>
                  <TableCell className="font-medium">${log.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{new Date(log.date).toLocaleDateString()}</TableCell>
                  <TableCell><StatusPill status={log.status} /></TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No logs found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;
