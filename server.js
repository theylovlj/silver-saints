const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/collection', (req, res) => {
    res.sendFile(path.join(__dirname, 'collection.html'));
});

app.listen(PORT, () => {
    console.log(`Silver Saints running on port ${PORT}`);
});
