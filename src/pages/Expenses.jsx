import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Fuel, Plus, DollarSign, Calendar, Truck, MoreVertical } from 'lucide-react';

const Expenses = () => {
    const { vehicles, expenses, addExpense } = useFleet();
    const [showModal, setShowModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        vehicleId: '', type: 'Fuel', amount: '', date: new Date().toISOString().split('T')[0], unitValue: ''
    });

    const handleAddExpense = (e) => {
        e.preventDefault();
        addExpense({
            ...newExpense,
            amount: Number(newExpense.amount),
            unitValue: Number(newExpense.unitValue)
        });
        setShowModal(false);
        setNewExpense({ vehicleId: '', type: 'Fuel', amount: '', date: new Date().toISOString().split('T')[0], unitValue: '' });
    };

    return (
        <div className="expenses-page">
            <header className="page-header">
                <div>
                    <h1>Expense & Fuel Logs</h1>
                    <p className="subtitle">Audit operational costs and fuel spend per asset</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    <span>Add Expense</span>
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Monthly Spend</p>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h2>
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Avg Fuel Cost / km</p>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>$0.42</h2>
                </div>
            </div>

            <div className="table-container glass-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No records found.</td>
                            </tr>
                        ) : (
                            expenses.map(exp => {
                                const v = vehicles.find(veh => Number(veh.id) === Number(exp.vehicleId));
                                return (
                                    <tr key={exp.id}>
                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Calendar size={14} />{exp.date}</div></td>
                                        <td><div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}><Truck size={14} />{v?.name}</div></td>
                                        <td><span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(88, 166, 255, 0.2)', color: '#58a6ff' }}>{exp.type}</span></td>
                                        <td><span style={{ color: 'var(--success)', fontWeight: 600 }}>${exp.amount.toLocaleString()}</span></td>
                                        <td><span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exp.type === 'Fuel' ? `${exp.unitValue} Liters` : 'Service'}</span></td>
                                        <td><button style={{ background: 'transparent', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button></td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Log Expense</h2>
                        <form onSubmit={handleAddExpense}>
                            <div className="form-group">
                                <label>Vehicle</label>
                                <select value={newExpense.vehicleId} onChange={e => setNewExpense({ ...newExpense, vehicleId: e.target.value })} required>
                                    <option value="">Select vehicle...</option>
                                    {vehicles.map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}
                                </select>
                            </div>
                            <div className="grid-form">
                                <div className="form-group">
                                    <label>Amount ($)</label>
                                    <input type="number" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input type="date" value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} required />
                                </div>
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

export default Expenses;
