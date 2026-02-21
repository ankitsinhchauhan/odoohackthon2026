import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { ShieldCheck, Mail, Lock, User, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
    const { login, signup } = useFleet();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Manager'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await signup(formData);
                setIsLogin(true); // Switch to login after successful signup
                setError('Account created! Please sign in.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-container">
            <div className="login-box glass-card">
                <div className="login-header" style={{ marginBottom: '32px' }}>
                    <ShieldCheck size={48} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>FleetFlow</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Centralized Fleet Intelligence</p>
                </div>

                {error && (
                    <div style={{
                        background: error.includes('created') ? 'rgba(35, 134, 54, 0.1)' : 'rgba(248, 81, 73, 0.1)',
                        color: error.includes('created') ? 'var(--success)' : 'var(--danger)',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontSize: '0.85rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="admin@fleetflow.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Initial Role</label>
                            <select name="role" value={formData.role} onChange={handleInputChange}>
                                <option value="Manager">Fleet Manager</option>
                                <option value="Dispatcher">Dispatcher</option>
                                <option value="Safety Officer">Safety Officer</option>
                                <option value="Analyst">Financial Analyst</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>)}
                    </button>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'transparent', color: 'var(--accent-primary)', marginLeft: '8px', fontWeight: 600 }}
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
