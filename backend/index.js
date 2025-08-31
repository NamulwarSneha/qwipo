const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating customers table:', err.message);
        } else {
            console.log('Customers table created or already exists.');
        }
    });

    // Create addresses table
    db.run(`CREATE TABLE IF NOT EXISTS addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creating addresses table:', err.message);
        } else {
            console.log('Addresses table created or already exists.');
        }
    });
}

// Customer Routes
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    
    // Validation
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
    db.run(sql, [first_name, last_name, phone_number], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'Customer created successfully',
            id: this.lastID 
        });
    });
});

app.get('/api/customers', (req, res) => {
    const { page = 1, limit = 10, search, city, state, pin_code, sortBy = 'id', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM customers';
    let countSql = 'SELECT COUNT(*) as total FROM customers';
    let params = [];
    let whereConditions = [];
    
    // Add search functionality
    if (search) {
        whereConditions.push(`(first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?)`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Add filter conditions
    if (city || state || pin_code) {
        const addressConditions = [];
        if (city) addressConditions.push('city = ?');
        if (state) addressConditions.push('state = ?');
        if (pin_code) addressConditions.push('pin_code = ?');
        
        if (addressConditions.length > 0) {
            sql = `SELECT DISTINCT c.* FROM customers c 
                   JOIN addresses a ON c.id = a.customer_id 
                   WHERE ${addressConditions.join(' AND ')}`;
            countSql = `SELECT COUNT(DISTINCT c.id) as total FROM customers c 
                        JOIN addresses a ON c.id = a.customer_id 
                        WHERE ${addressConditions.join(' AND ')}`;
        }
    }
    
    if (whereConditions.length > 0) {
        const whereClause = whereConditions.join(' AND ');
        sql += ` WHERE ${whereClause}`;
        countSql += ` WHERE ${whereClause}`;
    }
    
    // Add sorting and pagination
    sql += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    // Get total count
    db.get(countSql, params.slice(0, -2), (err, countResult) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Get customers with pagination
        db.all(sql, params, (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            res.json({
                message: 'success',
                data: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(countResult.total / limit),
                    totalItems: countResult.total,
                    itemsPerPage: parseInt(limit)
                }
            });
        });
    });
});

app.get('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM customers WHERE id = ?';
    db.get(sql, [id], (err, customer) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'success', data: customer });
    });
});

app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number } = req.body;
    
    // Validation
    if (!first_name || !last_name || !phone_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [first_name, last_name, phone_number, id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer updated successfully' });
    });
});

app.delete('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM customers WHERE id = ?';
    db.run(sql, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    });
});

// Address Routes
app.post('/api/customers/:id/addresses', (req, res) => {
    const { id } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    
    // Validation
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: 'All address fields are required' });
    }
    
    // Check if customer exists
    db.get('SELECT id FROM customers WHERE id = ?', [id], (err, customer) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [id, address_details, city, state, pin_code], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ 
                message: 'Address added successfully',
                id: this.lastID 
            });
        });
    });
});

app.get('/api/customers/:id/addresses', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM addresses WHERE customer_id = ?';
    db.all(sql, [id], (err, addresses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'success', data: addresses });
    });
});

app.put('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
    const { address_details, city, state, pin_code } = req.body;
    
    // Validation
    if (!address_details || !city || !state || !pin_code) {
        return res.status(400).json({ error: 'All address fields are required' });
    }
    
    const sql = `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [address_details, city, state, pin_code, addressId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json({ message: 'Address updated successfully' });
    });
});

app.delete('/api/addresses/:addressId', (req, res) => {
    const { addressId } = req.params;
    
    const sql = 'DELETE FROM addresses WHERE id = ?';
    db.run(sql, [addressId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json({ message: 'Address deleted successfully' });
    });
});

// Special endpoints for assignment requirements
app.get('/api/customers-with-multiple-addresses', (req, res) => {
    const sql = `
        SELECT c.*, COUNT(a.id) as address_count 
        FROM customers c 
        JOIN addresses a ON c.id = a.customer_id 
        GROUP BY c.id 
        HAVING COUNT(a.id) > 1
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'success', data: rows });
    });
});

app.get('/api/customers-single-address', (req, res) => {
    const sql = `
        SELECT c.*, COUNT(a.id) as address_count 
        FROM customers c 
        JOIN addresses a ON c.id = a.customer_id 
        GROUP BY c.id 
        HAVING COUNT(a.id) = 1
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'success', data: rows });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});