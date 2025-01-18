const express = require('express');
const bodyParser = require('body-parser');
const { loadInitData } = require('./db');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const orderStatusRoutes = require('./routes/order_status');
const categoryRoutes = require('./routes/categories');
const initRoutes = require('./routes/init');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true // Include credentials like cookies or HTTP authentication
}));

app.use(bodyParser.json());

// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/order_status', orderStatusRoutes);
app.use('/categories', categoryRoutes);
app.use('/init', initRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        await loadInitData();
    }
    catch (err) {
        console.error("Error loading init data", err.message);
    }
});