import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Users, Search, Shield, Calendar, TrendingUp, MoreVertical, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

const Drivers = () => {
    const { drivers, user, addDriver } = useFleet();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newDriver, setNewDriver] = useState({ name: '', licenseExpiry: '', category: 'All' });
    const [error, setError] = useState('');

    const handleAddDriver = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await addDriver(newDriver);
            setShowModal(false);
            setNewDriver({ name: '', licenseExpiry: '', category: 'All' });
        } catch (err) {
            setError(err.message);
        }
    };

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSafetyColor = (score) => {
        if (score >= 90) return 'var(--success)';
        if (score >= 75) return 'var(--warning)';
        return 'var(--danger)';
    };

    const isLicenseExpired = (date) => new Date(date) < new Date();

    return (
        <div className="drivers-page">
            <header className="page-header">
                <div>
                    <h1>Driver Management</h1>
                    <p className="subtitle">Monitor compliance, safety scores, and performance</p>
                </div>
                {user?.role === 'Manager' && <button className="btn-primary" onClick={() => setShowModal(true)}>Add Driver</button>}
            </header>

            <div className="summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                <div className="summary-card glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <CheckCircle2 color="var(--success)" />
                    <div>
                        <h3>{drivers.filter(d => d.status === 'Available').length}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Drivers Available</p>
                    </div>
                </div>
                <div className="summary-card glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Clock color="var(--accent-primary)" />
                    <div>
                        <h3>{drivers.filter(d => d.status === 'On Trip').length}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Currently Driving</p>
                    </div>
                </div>
                <div className="summary-card glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ShieldAlert color="var(--danger)" />
                    <div>
                        <h3>{drivers.filter(d => isLicenseExpired(d.licenseExpiry)).length}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>License Expired</p>
                    </div>
                </div>
            </div>

            <div className="table-actions glass-card" style={{ padding: '16px', marginBottom: '24px' }}>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', width: '100%' }}
                    />
                </div>
            </div>

            <div className="table-container glass-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Driver Name</th>
                            <th>Status</th>
                            <th>License Expiry</th>
                            <th>Compliance</th>
                            <th>Safety Score</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.map((driver) => (
                            <tr key={driver.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>{driver.name[0]}</div>
                                        <p style={{ fontWeight: 600 }}>{driver.name}</p>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-pill status-${driver.status.toLowerCase().replace(' ', '-')}`}>
                                        {driver.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                        <Calendar size={14} color="var(--text-secondary)" />
                                        {driver.licenseExpiry}
                                    </div>
                                </td>
                                <td>
                                    {isLicenseExpired(driver.licenseExpiry) ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, background: 'rgba(248, 81, 73, 0.2)', color: '#f85149' }}><ShieldAlert size={12} /> Expired</span>
                                    ) : (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500, background: 'rgba(35, 134, 54, 0.2)', color: '#3fb950' }}><Shield size={12} /> Compliant</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '140px' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div
                                                style={{ height: '100%', borderRadius: '3px', width: `${driver.safetyScore}%`, backgroundColor: getSafetyColor(driver.safetyScore) }}
                                            />
                                        </div>
                                        <span style={{ color: getSafetyColor(driver.safetyScore), fontWeight: 600 }}>
                                            {driver.safetyScore}%
                                        </span>
                                    </div>
                                </td>
                                <td>{driver.category}</td>
                                <td><button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content glass-card">
                            <h2>Add New Driver</h2>
                            {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}
                            <form onSubmit={handleAddDriver}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newDriver.name}
                                        onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>License Expiry</label>
                                    <input
                                        type="date"
                                        required
                                        value={newDriver.licenseExpiry}
                                        onChange={e => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>License Category</label>
                                    <select
                                        value={newDriver.category}
                                        onChange={e => setNewDriver({ ...newDriver, category: e.target.value })}
                                    >
                                        <option value="All">All Vehicles</option>
                                        <option value="Truck">Heavy Truck</option>
                                        <option value="Van">Light Van</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drivers;
