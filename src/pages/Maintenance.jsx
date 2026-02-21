import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { ClipboardList, Plus, History, Wrench, Calendar, Truck } from 'lucide-react';

const Maintenance = () => {
    const { vehicles, logs, addMaintenanceLog } = useFleet();
    const [showModal, setShowModal] = useState(false);
    const [newLog, setNewLog] = useState({
        vehicleId: '', serviceType: 'Routine Checkup', cost: '', date: new Date().toISOString().split('T')[0], notes: ''
    });

    const availableForService = vehicles.filter(v => v.status !== 'On Trip');

    const handleSubmit = (e) => {
        e.preventDefault();
        addMaintenanceLog({
            ...newLog,
            cost: Number(newLog.cost)
        });
        setShowModal(false);
        setNewLog({ vehicleId: '', serviceType: 'Routine Checkup', cost: '', date: new Date().toISOString().split('T')[0], notes: '' });
    };

    return (
        <div className="maintenance-page">
            <header className="page-header">
                <div>
                    <h1>Maintenance & Service</h1>
                    <p className="subtitle">Track vehicle health and preventative maintenance logs</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    <span>Log Service</span>
                </button>
            </header>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                    <Wrench size={18} color="var(--warning)" />
                    <span>{vehicles.filter(v => v.status === 'In Shop').length} Vehicles in Shop</span>
                </div>
                <div className="glass-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                    <History size={18} color="var(--accent-primary)" />
                    <span>{logs.length} Services Logged</span>
                </div>
            </div>

            <div className="logs-list">
                <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Recent Service Logs</h3>
                <div className="table-container glass-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Service Type</th>
                                <th>Cost</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No maintenance records found.</td>
                                </tr>
                            ) : (
                                logs.map(log => {
                                    const v = vehicles.find(veh => Number(veh.id) === Number(log.vehicleId));
                                    return (
                                        <tr key={log.id}>
                                            <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Calendar size={14} />{log.date}</div></td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                                                    <Truck size={14} />
                                                    <span>{v?.name}</span>
                                                </div>
                                            </td>
                                            <td>{log.serviceType}</td>
                                            <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>${log.cost.toLocaleString()}</span></td>
                                            <td><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>{log.notes}</p></td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Log Maintenance</h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '24px' }}>Status will be set to "In Shop".</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Vehicle</label>
                                <select value={newLog.vehicleId} onChange={e => setNewLog({ ...newLog, vehicleId: e.target.value })} required>
                                    <option value="">Choose a vehicle...</option>
                                    {availableForService.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.plate})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid-form">
                                <div className="form-group">
                                    <label>Cost ($)</label>
                                    <input type="number" value={newLog.cost} onChange={e => setNewLog({ ...newLog, cost: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={newLog.date} onChange={e => setNewLog({ ...newLog, date: e.target.value })} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea rows="3" value={newLog.notes} onChange={e => setNewLog({ ...newLog, notes: e.target.value })} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
