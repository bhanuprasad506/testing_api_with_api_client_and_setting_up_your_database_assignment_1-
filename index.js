const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Load student data from data.json
const dataPath = path.join(__dirname, 'data.json');

// POST /students/above-threshold
app.post('/students/above-threshold', (req, res) => {
    const { threshold } = req.body;

    // Validate input
    if (typeof threshold !== 'number' || isNaN(threshold)) {
        return res.status(400).json({ error: "Invalid input. 'threshold' must be a number." });
    }

    // Read student data
    fs.readFile(dataPath, 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading student data.' });
        }

        let students;
        try {
            students = JSON.parse(jsonData);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Error parsing student data.' });
        }

        const filtered = students.filter(student => student.total > threshold);
        const result = filtered.map(s => ({ name: s.name, total: s.total }));

        res.json({ count: result.length, students: result });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
