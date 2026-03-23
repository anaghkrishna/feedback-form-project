const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 TiDB Connection Pool (STABLE)
const db = mysql.createPool({
    host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
    user: "3U8YTCtxzbrGx49.root",
    password: "4NDesH9UTeLrs3vr",
    database: "feedback_db", // ⚠️ make sure your table is here
    port: 4000,
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
        console.log("DB Connection Error ❌", err);
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
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, course, department, faculty, rating, message], (err, result) => {
        if (err) {
            console.log("DB ERROR:", err);
            return res.status(500).send("Error saving data ❌");
        }

        res.send("Saved successfully ✅");
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000 🚀");
});