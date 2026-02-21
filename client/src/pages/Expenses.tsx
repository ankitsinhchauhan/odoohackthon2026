import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Fuel, Wrench, DollarSign, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Expenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: "",
    trip: "",
    category: "Fuel",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [expensesData, vehiclesData, tripsData] = await Promise.all([
        api.get('/expenses'),
        api.get('/vehicles'),
        api.get('/trips')
      ]);
      setExpenses(expensesData);
      setVehicles(vehiclesData);
      setTrips(tripsData);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalFuel = expenses.filter(e => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0);
  const totalMaint = expenses.filter(e => e.category === 'Maintenance').reduce((s, e) => s + e.amount, 0);
  const totalOps = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setDialogOpen(false);
      toast({ title: "Expense Added", description: "New expense has been logged." });
      setFormData({
        vehicle: "",
        trip: "",
        category: "Fuel",
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to log expense." });
    }
  };

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

      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Log Expense</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle>Log New Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={formData.vehicle} onValueChange={(v) => setFormData({ ...formData, vehicle: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v._id || v.id} value={v._id || v.id}>{v.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trip (Optional)</Label>
                  <Select value={formData.trip} onValueChange={(v) => setFormData({ ...formData, trip: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select trip" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {trips.map((t) => (
                        <SelectItem key={t._id || t.id} value={t._id || t.id}>{(t._id || t.id).substring(18).toUpperCase()} ({t.destination})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fuel">Fuel</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Toll">Toll</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Amount ($)</Label><Input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="bg-secondary border-border" required /></div>
              </div>
              <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-secondary border-border" required /></div>
              <div className="space-y-2"><Label>Description</Label><Input placeholder="e.g. Fuel refill" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-secondary border-border" required /></div>
              <Button type="submit" className="w-full">Log Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">All Expenses</h2>
      <div className="glass-card rounded-xl overflow-hidden mb-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Vehicle</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Trip</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((e) => (
                <TableRow key={e._id || e.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{e.vehicle?.name || 'N/A'}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  <TableCell className="font-mono text-sm">{e.trip ? (e.trip._id || e.trip.id || e.trip).substring(18).toUpperCase() : 'N/A'}</TableCell>
                  <TableCell className="font-medium">${e.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{new Date(e.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {expenses.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No expenses found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
