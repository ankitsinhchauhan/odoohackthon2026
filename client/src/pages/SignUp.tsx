import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck, Mail, Lock, User, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SignUp = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        organizationName: "",
        role: "manager",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (role: "manager" | "dispatcher") => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Account created successfully!");
                login(data);
                navigate("/dashboard");
            } else {
                toast.error(data.message || "Registration failed");
                if (data.error) console.error("Server detailed error:", data.error);
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Network error: Could not reach the server. Please check if the backend is running.");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ background: "var(--gradient-sidebar)" }}>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Truck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-foreground">FleetFlow</span>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold leading-tight text-foreground">
                        Join the Future of<br />Logistics Management
                    </h2>
                    <p className="max-w-md text-muted-foreground">
                        Create your account today and start optimizing your fleet operations with our rule-based digital platform.
                    </p>
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
                        <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                        <p className="mt-2 text-muted-foreground">Register your fleet management account</p>
                    </div>

                    {/* Role selector */}
                    <div className="flex rounded-lg border border-border p-1">
                        {(["manager", "dispatcher"] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => handleRoleChange(r)}
                                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${formData.role === r
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {r === "manager" ? "Fleet Manager" : "Dispatcher"}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    placeholder="John Doe"
                                    className="pl-10 bg-secondary border-border"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="organizationName">Organization Name</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="organizationName"
                                    placeholder="Your Company"
                                    className="pl-10 bg-secondary border-border"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@fleetflow.com"
                                    className="pl-10 bg-secondary border-border"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-secondary border-border"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full gap-2">
                            Sign Up <ArrowRight className="h-4 w-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
