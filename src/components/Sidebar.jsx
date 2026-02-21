import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Navigation,
  ClipboardList,
  Fuel,
  BarChart3,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useFleet } from '../context/FleetContext';

const Sidebar = () => {
  const { user, logout } = useFleet();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['Manager', 'Dispatcher', 'Safety Officer', 'Analyst'] },
    { name: 'Vehicles', icon: <Truck size={20} />, path: '/vehicles', roles: ['Manager', 'Dispatcher'] },
    { name: 'Drivers', icon: <Users size={20} />, path: '/drivers', roles: ['Manager', 'Safety Officer'] },
    { name: 'Dispatch', icon: <Navigation size={20} />, path: '/dispatch', roles: ['Manager', 'Dispatcher'] },
    { name: 'Maintenance', icon: <ClipboardList size={20} />, path: '/maintenance', roles: ['Manager'] },
    { name: 'Expenses', icon: <Fuel size={20} />, path: '/expenses', roles: ['Manager', 'Analyst'] },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics', roles: ['Manager', 'Analyst'] },
    { name: 'Administration', icon: <ShieldCheck size={20} />, path: '/users', roles: ['Manager'] },
  ];

  const filteredItems = navItems.filter(item => !user || item.roles.includes(user.role));

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-logo">
        <ShieldCheck color="var(--accent-primary)" size={32} />
        <span>FleetFlow</span>
      </div>

      <nav className="sidebar-nav">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <div className="user-avatar">{user.name[0]}</div>
            <div className="user-meta">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
