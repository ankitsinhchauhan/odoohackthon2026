import DashboardLayout from "@/components/DashboardLayout";
import { vehicles, trips, fuelLogs, maintenanceLogs, drivers } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const COLORS = ["hsl(142, 71%, 45%)", "hsl(200, 80%, 55%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const Analytics = () => {
  // Vehicle status distribution
  const statusData = [
    { name: "Available", value: vehicles.filter((v) => v.status === "Available").length },
    { name: "On Trip", value: vehicles.filter((v) => v.status === "On Trip").length },
    { name: "In Shop", value: vehicles.filter((v) => v.status === "In Shop").length },
    { name: "Retired", value: vehicles.filter((v) => v.status === "Retired").length },
  ];

  // Cost by vehicle
  const costData = vehicles.slice(0, 5).map((v) => {
    const fuel = fuelLogs.filter((f) => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0);
    const maint = maintenanceLogs.filter((m) => m.vehicleId === v.id).reduce((s, m) => s + m.cost, 0);
    return { name: v.name, fuel, maintenance: maint, total: fuel + maint };
  });

  // Monthly trips trend (mock)
  const trendData = [
    { month: "Sep", trips: 42 }, { month: "Oct", trips: 58 }, { month: "Nov", trips: 51 },
    { month: "Dec", trips: 38 }, { month: "Jan", trips: 64 }, { month: "Feb", trips: 48 },
  ];

  // Driver performance
  const driverData = drivers.map((d) => ({ name: d.name.split(" ")[0], score: d.safetyScore, trips: d.tripsCompleted }));

  return (
    <DashboardLayout title="Analytics & Reports" subtitle="Data-driven fleet insights and financial metrics">
      <div className="mb-4 flex justify-end">
        <Button variant="outline" className="gap-2 border-border"><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Fleet Status */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Fleet Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Cost per Vehicle</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
              <Bar dataKey="fuel" fill="hsl(200, 80%, 55%)" radius={[4, 4, 0, 0]} name="Fuel" />
              <Bar dataKey="maintenance" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trips Trend */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Monthly Trip Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
              <Line type="monotone" dataKey="trips" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Driver Performance */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Driver Safety Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={driverData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 20%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} width={60} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 13%)", border: "1px solid hsl(220, 14%, 20%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
              <Bar dataKey="score" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} name="Safety Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
