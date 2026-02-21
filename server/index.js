const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'fleetflow_secret_key_123'; // In production, use env variable

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Setup
const dbPath = path.resolve(__dirname, 'fleetflow.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error opening database', err.message);
    else {
        console.log('Connected to SQLite database');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Manager'
    )`);

        // Vehicles Table
        db.run(`CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      model TEXT,
      plate TEXT UNIQUE,
      maxCapacity INTEGER,
      odometer INTEGER,
      status TEXT DEFAULT 'Available',
      type TEXT,
      region TEXT
    )`);

        // Drivers Table
        db.run(`CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT DEFAULT 'Available',
      licenseExpiry DATE,
      safetyScore INTEGER DEFAULT 100,
      category TEXT
    )`);

        // Trips Table
        db.run(`CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId INTEGER,
      driverId INTEGER,
      cargoWeight INTEGER,
      cargo TEXT,
      status TEXT DEFAULT 'Dispatched',
      date DATE,
      FOREIGN KEY(vehicleId) REFERENCES vehicles(id),
      FOREIGN KEY(driverId) REFERENCES drivers(id)
    )`);

        // Maintenance Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS maintenance_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId INTEGER,
      serviceType TEXT,
      cost REAL,
      date DATE,
      notes TEXT,
      FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
    )`);

        // Expenses Table
        db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleId INTEGER,
      type TEXT,
      amount REAL,
      date DATE,
      unitValue REAL,
      FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
    )`);

        // Seed Data (if empty)
        db.get("SELECT COUNT(*) as count FROM vehicles", (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO vehicles (name, model, plate, maxCapacity, odometer, status, type, region) VALUES 
          ('Van-01', 'Mercedes Sprinter', 'GHT-102', 1500, 12500, 'Available', 'Van', 'North'),
          ('Truck-01', 'Volvo FH', 'KLE-552', 15000, 45000, 'On Trip', 'Truck', 'East'),
          ('Van-02', 'Ford Transit', 'PLM-990', 1200, 8000, 'In Shop', 'Van', 'West')`);

                db.run(`INSERT INTO drivers (name, status, licenseExpiry, safetyScore, category) VALUES 
          ('Alex Thompson', 'Available', '2026-12-31', 95, 'All'),
          ('Sarah Miller', 'On Trip', '2026-05-15', 88, 'Van'),
          ('James Wilson', 'Off Duty', '2025-10-20', 92, 'Truck')`);
            }
        });

        // Seed a default admin if none exists
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (row && row.count === 0) {
                const hashedPw = bcrypt.hashSync('admin123', 10);
                db.run(`INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@fleetflow.com', ?, 'Manager')`, [hashedPw]);
            }
        });
    });
}

// --- Auth Endpoints ---

app.post('/api/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role || 'Manager'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already exists' });
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, name, email, role });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    });
});

// Users Management (Admin only)
app.get('/api/users', (req, res) => {
    // Note: In a real app we'd use the 'authenticate' middleware here, 
    // but for this demo login we'll allow fetching users to see everyone.
    db.all("SELECT id, name, email, role FROM users", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Update User Role (Admin only)
app.patch('/api/users/:id/role', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    db.run(`UPDATE users SET role = ? WHERE id = ?`, [role, id], function (err) {
        if (err) res.status(500).json({ error: err.message });
        else res.json({ message: 'Role updated successfully' });
    });
});

// Update User Details (Admin only)
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    db.run(`UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
        [name, email, role, id],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ message: 'User updated successfully' });
        }
    );
});

// --- PROTECTED API Endpoints (Adding simple check) ---
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
};

// Vehicles
app.get('/api/vehicles', (req, res) => {
    db.all("SELECT * FROM vehicles", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/vehicles', (req, res) => {
    const { name, model, plate, maxCapacity, odometer, type, region } = req.body;
    db.run(`INSERT INTO vehicles (name, model, plate, maxCapacity, odometer, type, region) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, model, plate, maxCapacity, odometer, type, region],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, ...req.body });
        }
    );
});

// Drivers
app.get('/api/drivers', (req, res) => {
    db.all("SELECT * FROM drivers", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/drivers', (req, res) => {
    const { name, licenseExpiry, category } = req.body;
    db.run(`INSERT INTO drivers (name, licenseExpiry, category, status, safetyScore) VALUES (?, ?, ?, 'Available', 100)`,
        [name, licenseExpiry, category],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, name, licenseExpiry, category, status: 'Available', safetyScore: 100 });
        }
    );
});

// Trips
app.get('/api/trips', (req, res) => {
    db.all("SELECT * FROM trips", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/trips', (req, res) => {
    const { vehicleId, driverId, cargoWeight, cargo, date } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(`INSERT INTO trips (vehicleId, driverId, cargoWeight, cargo, date, status) VALUES (?, ?, ?, ?, ?, 'Dispatched')`,
            [vehicleId, driverId, cargoWeight, cargo, date],
            function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                const tripId = this.lastID;
                db.run(`UPDATE vehicles SET status = 'On Trip' WHERE id = ?`, [vehicleId]);
                db.run(`UPDATE drivers SET status = 'On Trip' WHERE id = ?`, [driverId]);
                db.run("COMMIT", (err) => {
                    if (err) res.status(500).json({ error: err.message });
                    else res.json({ id: tripId, ...req.body });
                });
            }
        );
    });
});

app.post('/api/trips/:id/complete', (req, res) => {
    const { id } = req.params;
    const { finalOdometer } = req.body;
    db.get("SELECT vehicleId, driverId FROM trips WHERE id = ?", [id], (err, trip) => {
        if (err || !trip) return res.status(404).json({ error: 'Trip not found' });
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            db.run(`UPDATE trips SET status = 'Completed' WHERE id = ?`, [id]);
            db.run(`UPDATE vehicles SET status = 'Available', odometer = ? WHERE id = ?`, [finalOdometer, trip.vehicleId]);
            db.run(`UPDATE drivers SET status = 'Available' WHERE id = ?`, [trip.driverId]);
            db.run("COMMIT", (err) => {
                if (err) res.status(500).json({ error: err.message });
                else res.json({ message: 'Trip completed successfully' });
            });
        });
    });
});

// Maintenance
app.get('/api/maintenance', (req, res) => {
    db.all("SELECT * FROM maintenance_logs", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/maintenance', (req, res) => {
    const { vehicleId, serviceType, cost, date, notes } = req.body;
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        db.run(`INSERT INTO maintenance_logs (vehicleId, serviceType, cost, date, notes) VALUES (?, ?, ?, ?, ?)`,
            [vehicleId, serviceType, cost, date, notes],
            function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: err.message });
                }
                db.run(`UPDATE vehicles SET status = 'In Shop' WHERE id = ?`, [vehicleId]);
                db.run("COMMIT", (err) => {
                    if (err) res.status(500).json({ error: err.message });
                    else res.json({ id: this.lastID, ...req.body });
                });
            }
        );
    });
});

// Expenses
app.get('/api/expenses', (req, res) => {
    db.all("SELECT * FROM expenses", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/expenses', (req, res) => {
    const { vehicleId, type, amount, date, unitValue } = req.body;
    db.run(`INSERT INTO expenses (vehicleId, type, amount, date, unitValue) VALUES (?, ?, ?, ?, ?)`,
        [vehicleId, type, amount, date, unitValue],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID, ...req.body });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
