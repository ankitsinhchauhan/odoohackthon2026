import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Navigation, Plus, AlertCircle, CheckCircle, Package, Truck, User } from 'lucide-react';

const Dispatch = () => {
    const { vehicles, drivers, trips, addTrip } = useFleet();
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState('');
    const [newTrip, setNewTrip] = useState({
        vehicleId: '', driverId: '', cargoWeight: '', cargo: ''
    });

    const availableVehicles = vehicles.filter(v => v.status === 'Available');
    const availableDrivers = drivers.filter(d => d.status === 'Available');

    const handleDispatch = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await addTrip({
                ...newTrip,
                cargoWeight: Number(newTrip.cargoWeight)
            });
            setShowAddModal(false);
            setNewTrip({ vehicleId: '', driverId: '', cargoWeight: '', cargo: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dispatch-page">
            <header className="page-header">
                <div>
                    <h1>Trip Dispatcher</h1>
                    <p className="subtitle">Assign drivers and vehicles to active cargo loads</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    <span>New Trip</span>
                </button>
            </header>

            <div className="active-trips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginTop: '24px' }}>
                {trips.filter(t => t.status === 'Dispatched').map(trip => {
                    const v = vehicles.find(veh => Number(veh.id) === Number(trip.vehicleId));
                    const d = drivers.find(drv => Number(drv.id) === Number(trip.driverId));
                    return (
                        <div key={trip.id} className="trip-card glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid var(--accent-primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>#{String(trip.id).padStart(6, '0')}</div>
                                <div className="status-pill status-on-trip">In Progress</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Package size={20} color="var(--accent-primary)" />
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{trip.cargo}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{trip.cargoWeight} kg</p>
                                </div>
                            </div>

                            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                    <Truck size={16} />
                                    <span>{v?.name} ({v?.plate})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                    <User size={16} />
                                    <span>{d?.name}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{trip.date}</div>
                                <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Details</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Dispatch New Trip</h2>
                        {error && <div style={{ background: 'rgba(248, 81, 73, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '0.9rem' }}><AlertCircle size={18} /> {error}</div>}

                        <form onSubmit={handleDispatch}>
                            <div className="form-group">
                                <label>Select Vehicle (Available Only)</label>
                                <select
                                    value={newTrip.vehicleId}
                                    onChange={e => setNewTrip({ ...newTrip, vehicleId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a vehicle...</option>
                                    {availableVehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} - Cap: {v.maxCapacity}kg</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Select Driver (Available Only)</label>
                                <select
                                    value={newTrip.driverId}
                                    onChange={e => setNewTrip({ ...newTrip, driverId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a driver...</option>
                                    {availableDrivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} - {d.category} License</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid-form">
                                <div className="form-group">
                                    <label>Cargo Name</label>
                                    <input type="text" placeholder="Electronics" value={newTrip.cargo} onChange={e => setNewTrip({ ...newTrip, cargo: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Cargo Weight (kg)</label>
                                    <input type="number" placeholder="500" value={newTrip.cargoWeight} onChange={e => setNewTrip({ ...newTrip, cargoWeight: e.target.value })} required />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Confirm Dispatch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dispatch;
