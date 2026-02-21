import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Phone, Shield, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Drivers = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDrivers = async () => {
    try {
      const data = await api.get('/drivers');
      setDrivers(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch drivers." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const isExpired = (date: string) => date ? new Date(date) < new Date() : false;

  return (
    <DashboardLayout title="Driver Profiles" subtitle="Compliance management and performance tracking">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          drivers.map((driver) => {
            const expired = driver.licenseExpiry ? isExpired(driver.licenseExpiry) : false;
            return (
              <div key={driver._id || driver.id} className="glass-card rounded-xl p-6 space-y-4 animate-slide-in">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{driver.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {driver.phone || 'N/A'}
                    </div>
                  </div>
                  <StatusPill status={driver.status} />
                </div>

                {/* Safety Score */}
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" /> Safety Score
                    </span>
                    <span className={`font-semibold ${driver.safetyScore >= 90 ? "text-fleet-available" : driver.safetyScore >= 80 ? "text-fleet-in-shop" : "text-destructive"}`}>
                      {driver.safetyScore}/100
                    </span>
                  </div>
                  <Progress value={driver.safetyScore} className="h-2" />
                </div>

                {/* License */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">License Expiry</span>
                  <span className={`flex items-center gap-1 font-medium ${expired ? "text-destructive" : "text-foreground"}`}>
                    {expired && <AlertTriangle className="h-3.5 w-3.5" />}
                    {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {driver.licenseCategory?.map((cat: string) => (
                    <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex justify-between border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">Trips Completed</span>
                  <span className="font-semibold text-foreground">{driver.tripsCompleted}</span>
                </div>
              </div>
            );
          })
        )}
        {!loading && drivers.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">No drivers found</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Drivers;
