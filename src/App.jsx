import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FleetProvider, useFleet } from './context/FleetContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry';
import Drivers from './pages/Drivers';
import Dispatch from './pages/Dispatch';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import './index.css';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useFleet();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useFleet();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/vehicles" element={
        <ProtectedRoute roles={['Manager', 'Dispatcher']}>
          <Layout><VehicleRegistry /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/drivers" element={
        <ProtectedRoute roles={['Manager', 'Safety Officer']}>
          <Layout><Drivers /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/dispatch" element={
        <ProtectedRoute roles={['Manager', 'Dispatcher']}>
          <Layout><Dispatch /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/maintenance" element={
        <ProtectedRoute roles={['Manager']}>
          <Layout><Maintenance /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/expenses" element={
        <ProtectedRoute roles={['Manager', 'Analyst']}>
          <Layout><Expenses /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/analytics" element={
        <ProtectedRoute roles={['Manager', 'Analyst']}>
          <Layout><Analytics /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/users" element={
        <ProtectedRoute roles={['Manager']}>
          <Layout><Users /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <FleetProvider>
      <Router>
        <AppRoutes />
      </Router>
    </FleetProvider>
  );
}

export default App;
