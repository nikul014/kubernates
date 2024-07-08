const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6001;
const PERSISTENT_DIR = "/path/to/your/persistent/volume";

app.use(bodyParser.json());

// Calculate API
app.post('/calculate', (req, res) => {
    const { file, product } = req.body;

    if (!file || !product) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join(PERSISTENT_DIR, file);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: "File not found." });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ file, error: "Error reading the file." });
        }

        try {
            const lines = data.split('\n');
            const header = lines[0].split(',').map(h => h.trim());
            const productIndex = header.indexOf('product');
            const amountIndex = header.indexOf('amount');

            if (productIndex === -1 || amountIndex === -1) {
                throw new Error("Input file not in CSV format.");
            }

            const sum = lines.slice(1).reduce((total, line) => {
                const columns = line.split(',').map(col => col.trim());
                if (columns[productIndex] === product) {
                    total += parseInt(columns[amountIndex], 10);
                }
                return total;
            }, 0);

            res.json({ file, sum });
        } catch (error) {
            res.status(400).json({ file, error: "Input file not in CSV format." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
