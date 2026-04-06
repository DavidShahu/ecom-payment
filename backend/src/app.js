const express = require('express');
const cors = require('cors');

const { router: ordersRouter } = require('./routes/orders');
const paymentsRouter = require('./routes/payments');
const webhooksRouter = require('./routes/webhooks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middleware  
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:4200' }));
app.use(express.json());

// ── Routes 
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/webhooks', webhooksRouter);

//  Health check 
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

//  Error handler (must always be last) 
app.use(errorHandler);

module.exports = app;