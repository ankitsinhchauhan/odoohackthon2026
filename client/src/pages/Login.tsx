import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"manager" | "dispatcher">("manager");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "var(--gradient-sidebar)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">FleetFlow</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight text-foreground">
            Modular Fleet &<br />Logistics Management
          </h2>
          <p className="max-w-md text-muted-foreground">
            Replace inefficient logbooks with a centralized, rule-based digital hub that optimizes fleet lifecycle, monitors driver safety, and tracks financial performance.
          </p>
          <div className="flex gap-6 pt-4">
            {[
              { label: "Vehicles Tracked", value: "2,400+" },
              { label: "Trips Completed", value: "18K+" },
              { label: "Cost Reduction", value: "34%" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 FleetFlow. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">FleetFlow</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your fleet management dashboard</p>
          </div>

          {/* Role selector */}
          <div className="flex rounded-lg border border-border p-1">
            {(["manager", "dispatcher"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "manager" ? "Fleet Manager" : "Dispatcher"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@fleetflow.com"
                  className="pl-10 bg-secondary border-border"
                  defaultValue="admin@fleetflow.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-secondary border-border"
                  defaultValue="password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
