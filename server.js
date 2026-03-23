require('dotenv').config(); // Load environment variables at the very top
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ⚡ TiDB Connection Pool (Using Environment Variables)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection((err, conn) => {
    if (err) {
        console.error("DB Connection Error ❌", err);
    } else {
        console.log("Connected to TiDB Cloud ✅");
        conn.release();
    }
});

// POST API
app.post("/api/feedback", (req, res) => {
    const { name, email, course, department, faculty, rating, message } = req.body;

    const sql = `
        INSERT INTO feedback 
        (name, email, course, department, faculty, rating, message) 
        (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, course, department, faculty, rating, message], (err, result) => {
        if (err) {
            console.error("DB ERROR:", err);
            return res.status(500).json({ error: "Error saving data ❌" });
        }
        res.status(200).send("Saved successfully ✅");
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});