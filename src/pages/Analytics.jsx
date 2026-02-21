import React from 'react';
import { useFleet } from '../context/FleetContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, FileSpreadsheet, TrendingUp, TrendingDown } from 'lucide-react';

const Analytics = () => {
    const { vehicles } = useFleet();

    const roiData = vehicles.slice(0, 5).map(v => ({
        name: v.name,
        roi: (Math.random() * 15 + 10).toFixed(1),
    }));

    const expenseBreakdown = [
        { name: 'Fuel', value: 4500, color: 'var(--accent-primary)' },
        { name: 'Maintenance', value: 2800, color: 'var(--warning)' },
        { name: 'Insurance', value: 1200, color: 'var(--success)' },
        { name: 'Others', value: 600, color: 'var(--text-secondary)' },
    ];

    return (
        <div className="analytics-page">
            <header className="page-header">
                <div>
                    <h1>Operational Analytics</h1>
                    <p className="subtitle">Data-driven insights for fleet performance and ROI</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.85rem' }}><FileSpreadsheet size={16} /> Export CSV</button>
                    <button className="btn-secondary" style={{ fontSize: '0.85rem' }}><FileText size={16} /> Export PDF</button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avg Efficiency</h3>
                        <span style={{ color: '#3fb950', fontSize: '0.75rem', fontWeight: 600 }}><TrendingUp size={14} /> 4.2%</span>
                    </div>
                    <p style={{ fontSize: '1.8rem', fontWeight: 700 }}>6.8 km/L</p>
                </div>
                {/* ... other cards simplified for brevity in this cleanup pass ... */}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '24px' }}>Vehicle ROI (%)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={roiData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
                                <XAxis type="number" stroke="#8b949e" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#8b949e" fontSize={12} width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
                                <Bar dataKey="roi" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '24px' }}>Expense Distribution</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {expenseBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
