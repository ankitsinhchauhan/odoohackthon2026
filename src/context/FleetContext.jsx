import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FleetContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const FleetProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fleetUser')));
    const [token, setToken] = useState(() => localStorage.getItem('fleetToken'));
    const [loading, setLoading] = useState(true);

    // Set shared axios headers
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const fetchData = async () => {
        try {
            const [vRes, dRes, tRes, eRes, mRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/vehicles`),
                axios.get(`${API_BASE_URL}/drivers`),
                axios.get(`${API_BASE_URL}/trips`),
                axios.get(`${API_BASE_URL}/expenses`),
                axios.get(`${API_BASE_URL}/maintenance`)
            ]);
            setVehicles(vRes.data);
            setDrivers(dRes.data);
            setTrips(tRes.data);
            setExpenses(eRes.data);
            setLogs(mRes.data);
        } catch (err) {
            console.error('Error fetching data from backend', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const signup = async (userData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/signup`, userData);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Signup failed');
        }
    };

    const login = async (credentials) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, credentials);
            const { token, user } = res.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('fleetToken', token);
            localStorage.setItem('fleetUser', JSON.stringify(user));
            return user;
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('fleetToken');
        localStorage.removeItem('fleetUser');
    };

    const addVehicle = async (vehicleData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/vehicles`, vehicleData);
            setVehicles([...vehicles, res.data]);
        } catch (err) {
            console.error('Error adding vehicle', err);
        }
    };

    const addDriver = async (driverData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/drivers`, driverData);
            setDrivers([...drivers, res.data]);
        } catch (err) {
            console.error('Error adding driver', err);
            throw new Error(err.response?.data?.error || 'Failed to add driver');
        }
    };

    const addTrip = async (tripData) => {
        const vehicle = vehicles.find(v => Number(v.id) === Number(tripData.vehicleId));
        if (tripData.cargoWeight > vehicle.maxCapacity) {
            throw new Error(`Cargo weight (${tripData.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxCapacity}kg)`);
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/trips`, {
                ...tripData,
                date: new Date().toISOString().split('T')[0]
            });
            await fetchData();
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Failed to dispatch trip');
        }
    };

    const completeTrip = async (tripId, finalOdometer) => {
        try {
            await axios.post(`${API_BASE_URL}/trips/${tripId}/complete`, { finalOdometer });
            await fetchData();
        } catch (err) {
            console.error('Error completing trip', err);
        }
    };

    const addMaintenanceLog = async (logData) => {
        try {
            await axios.post(`${API_BASE_URL}/maintenance`, logData);
            await fetchData();
        } catch (err) {
            console.error('Error adding maintenance log', err);
        }
    };

    const addExpense = async (expenseData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/expenses`, expenseData);
            setExpenses([...expenses, res.data]);
        } catch (err) {
            console.error('Error adding expense', err);
        }
    };

    const getUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/users`);
            return res.data;
        } catch (err) {
            console.error('Error fetching users', err);
            return [];
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await axios.patch(`${API_BASE_URL}/users/${userId}/role`, { role: newRole });
        } catch (err) {
            console.error('Error updating role', err);
            throw new Error(err.response?.data?.error || 'Failed to update role');
        }
    };

    const updateUser = async (userId, userData) => {
        try {
            await axios.put(`${API_BASE_URL}/users/${userId}`, userData);
        } catch (err) {
            console.error('Error updating user', err);
            throw new Error(err.response?.data?.error || 'Failed to update user');
        }
    };

    return (
        <FleetContext.Provider value={{
            vehicles,
            drivers,
            trips,
            expenses,
            logs,
            user,
            login,
            signup,
            logout,
            addVehicle,
            addDriver,
            addTrip,
            completeTrip,
            addMaintenanceLog,
            addExpense,
            getUsers,
            updateUserRole,
            updateUser,
            loading
        }}>
            {children}
        </FleetContext.Provider>
    );
};

export const useFleet = () => useContext(FleetContext);
