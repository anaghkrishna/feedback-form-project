require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path"); // Added this to help find your files

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- NEW PART: This tells the server to serve your HTML, CSS, and JS files ---
app.use(express.static(path.join(__dirname)));

// This tells the server: "When someone visits my link, show them index.html"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
// ---------------------------------------------------------------------------

// TiDB Connection Pool
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

// POST API for Feedback
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
    console.log(`Server running on port ${PORT} 🚀`);
});