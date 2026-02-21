import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Truck, Plus, Search, Filter, MoreVertical, Gauge } from 'lucide-react';

const VehicleRegistry = () => {
    const { vehicles, addVehicle, user } = useFleet();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        name: '', model: '', plate: '', maxCapacity: '', odometer: '', type: 'Van', region: 'North', status: 'Available'
    });

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddVehicle = (e) => {
        e.preventDefault();
        addVehicle({ ...newVehicle, maxCapacity: Number(newVehicle.maxCapacity), odometer: Number(newVehicle.odometer) });
        setShowAddModal(false);
        setNewVehicle({ name: '', model: '', plate: '', maxCapacity: '', odometer: '', type: 'Van', region: 'North', status: 'Available' });
    };

    return (
        <div className="vehicle-page">
            <header className="page-header">
                <div>
                    <h1>Vehicle Registry</h1>
                    <p className="subtitle">Manage physical assets and fleet inventory</p>
                </div>
                {user?.role === 'Manager' && (
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} />
                        <span>Add Vehicle</span>
                    </button>
                )}
            </header>

            <div className="table-actions glass-card" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', marginBottom: '24px' }}>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search by name or license plate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', background: 'transparent', border: 'none' }}
                    />
                </div>
                <div className="filters">
                    <button className="btn-secondary" style={{ padding: '8px 12px' }}><Filter size={18} /> Filter</button>
                </div>
            </div>

            <div className="table-container glass-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>License Plate</th>
                            <th>Type / Capacity</th>
                            <th>Odometer</th>
                            <th>Status</th>
                            <th>Region</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyIn: 'center', color: 'var(--accent-primary)', justifyContent: 'center' }}>
                                            <Truck size={18} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'white' }}>{vehicle.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{vehicle.model}</p>
                                        </div>
                                    </div>
                                </td>
                                <td><code style={{ background: '#1f2937', color: '#a5b4fc', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{vehicle.plate}</code></td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '0.85rem' }}>{vehicle.type}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{vehicle.maxCapacity} kg</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                        <Gauge size={14} color="var(--text-secondary)" />
                                        {vehicle.odometer.toLocaleString()} km
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-pill status-${vehicle.status.toLowerCase().replace(' ', '-')}`}>
                                        {vehicle.status}
                                    </span>
                                </td>
                                <td>{vehicle.region}</td>
                                <td><button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Add New Vehicle</h2>
                        <form onSubmit={handleAddVehicle}>
                            <div className="grid-form">
                                <div className="form-group">
                                    <label>Vehicle Name</label>
                                    <input type="text" placeholder="Van-05" value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Model</label>
                                    <input type="text" placeholder="Mercedes Sprinter" value={newVehicle.model} onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>License Plate</label>
                                    <input type="text" placeholder="ABC-123" value={newVehicle.plate} onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Capacity (kg)</label>
                                    <input type="number" placeholder="1500" value={newVehicle.maxCapacity} onChange={e => setNewVehicle({ ...newVehicle, maxCapacity: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Initial Odometer (km)</label>
                                    <input type="number" placeholder="5000" value={newVehicle.odometer} onChange={e => setNewVehicle({ ...newVehicle, odometer: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Region</label>
                                    <select value={newVehicle.region} onChange={e => setNewVehicle({ ...newVehicle, region: e.target.value })}>
                                        <option>North</option>
                                        <option>South</option>
                                        <option>East</option>
                                        <option>West</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleRegistry;
