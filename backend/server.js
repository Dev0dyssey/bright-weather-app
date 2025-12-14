require('dotenv').config();
const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/search');
const PORT = process.env.PORT || 3000;
const app = express();

// CORS: Open for local development. Restrict in production.
app.use(cors());
app.use(express.json());

app.use('/search', searchRoutes);

app.get('/', (req, res) => {
    res.json({
        name: 'Bright Weather API',
        version: '1.0.0',
        status: 'ok'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
