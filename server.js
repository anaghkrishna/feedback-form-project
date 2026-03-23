require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/feedback", (req, res) => {
    const { name, email, course, department, faculty, rating, message } = req.body;
    
    // Explicitly convert rating to a number just in case
    const numericRating = parseInt(rating);

    const sql = `INSERT INTO feedback (name, email, course, department, faculty, rating, message) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, email, course, department, faculty, numericRating, message], (err, result) => {
        if (err) {
            console.error("❌ DATABASE INSERT ERROR:", err.message); // This will show the exact error in Render Logs
            return res.status(500).json({ error: err.message });
        }
        console.log("✅ Data saved to TiDB");
        res.status(200).send("Saved successfully ✅");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});