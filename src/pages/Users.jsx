import React, { useState, useEffect } from 'react';
import { useFleet } from '../context/FleetContext';
import { Users as UsersIcon, Shield, Mail, Tag, UserCheck, Edit2, Check, X, Plus, AlertCircle } from 'lucide-react';

const Users = () => {
    const { getUsers, updateUser, signup, user: currentUser } = useFleet();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', email: '', role: '' });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Manager' });
    const [addError, setAddError] = useState('');

    const fetchUsers = async () => {
        const data = await getUsers();
        setAllUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [getUsers]);

    const handleUpdate = async (userId) => {
        try {
            await updateUser(userId, editData);
            setEditingId(null);
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setAddError('');
        try {
            await signup(newUser);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'Manager' });
            fetchUsers();
        } catch (err) {
            setAddError(err.message);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading user registry...</div>;

    const availableRoles = ['Manager', 'Dispatcher', 'Safety Officer', 'Analyst'];

    return (
        <div className="users-page">
            <header className="page-header">
                <div>
                    <h1>User Administration</h1>
                    <p className="subtitle">Manage system access and roles across the organization</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                    <span>Add New User</span>
                </button>
            </header>

            <div className="table-container glass-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User Details</th>
                            <th>Email Address</th>
                            <th>Current Role</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.map((u) => (
                            <tr key={u.id} style={{ opacity: u.id === currentUser.id ? 1 : 0.85 }}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            background: u.role === 'Manager' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: u.role === 'Manager' ? 'var(--bg-primary)' : 'var(--text-primary)',
                                            fontWeight: 700
                                        }}>{u.name[0]}</div>
                                        <div>
                                            {editingId === u.id ? (
                                                <input
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                    style={{ background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px', fontSize: '0.9rem' }}
                                                />
                                            ) : (
                                                <p style={{ fontWeight: 600 }}>{u.name} {u.id === currentUser.id && <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', marginLeft: '4px' }}>(You)</span>}</p>
                                            )}
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {u.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {editingId === u.id ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            style={{ background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px', fontSize: '0.9rem', width: '200px' }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                            <Mail size={14} color="var(--text-secondary)" />
                                            {u.email}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {editingId === u.id ? (
                                        <select
                                            value={editData.role}
                                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                            style={{ background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '4px' }}
                                        >
                                            {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    ) : (
                                        <span className="status-pill" style={{
                                            background: u.role === 'Manager' ? 'rgba(88, 166, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            color: u.role === 'Manager' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                        }}>
                                            {u.role}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--success)' }}>
                                        <UserCheck size={14} />
                                        Active
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    {editingId === u.id ? (
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => handleUpdate(u.id)} style={{ color: 'var(--success)', background: 'transparent' }}><Check size={18} /></button>
                                            <button onClick={() => setEditingId(null)} style={{ color: 'var(--danger)', background: 'transparent' }}><X size={18} /></button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setEditingId(u.id); setEditData({ name: u.name, email: u.email, role: u.role }); }}
                                            style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                                            disabled={u.id === currentUser.id}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-card">
                        <h2>Register New User</h2>
                        {addError && <div style={{ background: 'rgba(248, 81, 73, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '0.85rem' }}><AlertCircle size={18} /> {addError}</div>}

                        <form onSubmit={handleAddUser}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" placeholder="John Doe" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="john@fleetflow.com" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Temporary Password</label>
                                <input type="password" placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Assigned Role</label>
                                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                    {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
