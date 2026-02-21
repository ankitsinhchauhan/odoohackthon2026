import DashboardLayout from "@/components/DashboardLayout";
import StatusPill from "@/components/StatusPill";
import { drivers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Phone, Shield } from "lucide-react";

const Drivers = () => {
  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <DashboardLayout title="Driver Profiles" subtitle="Compliance management and performance tracking">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {drivers.map((driver) => {
          const expired = isExpired(driver.licenseExpiry);
          return (
            <div key={driver.id} className="glass-card rounded-xl p-6 space-y-4 animate-slide-in">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{driver.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> {driver.phone}
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
                  {driver.licenseExpiry}
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {driver.licenseCategory.map((cat) => (
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
        })}
      </div>
    </DashboardLayout>
  );
};

export default Drivers;
