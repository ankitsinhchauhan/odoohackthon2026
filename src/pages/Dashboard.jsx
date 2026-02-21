import React from 'react';
import { useFleet } from '../context/FleetContext';
import {
    Truck,
    AlertTriangle,
    BarChart2,
    Package,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const Dashboard = () => {
    const { vehicles, trips, loading } = useFleet();

    const handleGenerateReport = () => {
        // Prepare CSV Headers
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Type,ID,Name,Model/Cargo,Status,Plate/Weight,Region/Date\n";

        // Add Vehicles
        vehicles.forEach(v => {
            csvContent += `Vehicle,${v.id},${v.name},${v.model || ''},${v.status},${v.plate || ''},${v.region || ''}\n`;
        });

        // Add Trips
        trips.forEach(t => {
            csvContent += `Trip,${t.id},${t.cargo || 'General'},${t.cargoWeight || ''}kg,${t.status},-,${t.date || ''}\n`;
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `fleet_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Initializing Command Center...</div>;

    const activeFleetCount = vehicles.filter(v => v.status === 'On Trip').length;
    const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;
    const utilizationRate = Math.round((activeFleetCount / (vehicles.length || 1)) * 100);
    const pendingCargo = 5;

    const stats = [
        { title: 'Active Fleet', value: activeFleetCount, icon: <Truck />, color: 'var(--accent-primary)', trend: '+2' },
        { title: 'In Shop', value: inShopCount, icon: <AlertTriangle />, color: 'var(--warning)', trend: '0' },
        { title: 'Utilization', value: `${utilizationRate}%`, icon: <BarChart2 />, color: 'var(--success)', trend: '+5%' },
        { title: 'Pending Cargo', value: pendingCargo, icon: <Package />, color: 'var(--text-secondary)', trend: '-1' },
    ];

    const performanceData = [
        { name: 'Mon', trips: 12, cost: 400 },
        { name: 'Tue', trips: 15, cost: 550 },
        { name: 'Wed', trips: 10, cost: 380 },
        { name: 'Thu', trips: 18, cost: 620 },
        { name: 'Fri', trips: 22, cost: 780 },
        { name: 'Sat', trips: 14, cost: 450 },
        { name: 'Sun', trips: 8, cost: 300 },
    ];

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <div>
                    <h1>Command Center</h1>
                    <p className="subtitle">Real-time fleet operations overview</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={handleGenerateReport}>Generate Report</button>
                </div>
            </header>

            <section className="stats-grid">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card glass-card">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <p className="stat-title">{stat.title}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className={`stat-trend ${stat.trend.startsWith('+') ? 'up' : 'down'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: stat.trend.startsWith('+') ? '#3fb950' : '#f85149' }}>
                                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend} vs last week
                            </p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="charts-grid">
                <div className="chart-container glass-card">
                    <h3 style={{ marginBottom: '24px', fontSize: '1rem' }}>Fleet Performance (Trips vs Cost)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                                <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Area type="monotone" dataKey="trips" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorTrips)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container glass-card">
                    <h3 style={{ marginBottom: '24px', fontSize: '1rem' }}>Vehicle Health Overview</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                                <XAxis dataKey="name" stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#8b949e" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="cost" fill="var(--warning)" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
