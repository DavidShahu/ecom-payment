// routes ne node jan si controllers ne .net, bejn handle api requests



const express = require('express');
const router = express.Router();
const pokpay = require('../services/pokpay.service');

// In-memory store — like a temporary database


const orders = new Map();

// POST /api/orders 
// Create a new order
router.post('/', async (req, res, next) => {
  try {
    const { items, autoCapture = false, currency = 'ALL' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
 
    const total = items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
 
    const pokResponse = await pokpay.createOrder({
      amount: total,
      currencyCode: currency,
      autoCapture,
      products: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      ...(process.env.WEBHOOK_BASE_URL && {
        webhookUrl: `${process.env.WEBHOOK_BASE_URL}/api/webhooks/payment`
      }),
      redirectUrl: `${process.env.FRONTEND_URL}/orders`,
      failRedirectUrl: `${process.env.FRONTEND_URL}/orders`,
    });
    const pokOrder = pokResponse.data.sdkOrder;
 
    orders.set(pokOrder.id, {
      pokOrderId: pokOrder.id,
      autoCapture,
      status: 'PENDING',
      amount: total,
      currency,
      items,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      orderId: pokOrder.id,
      checkoutUrl: pokOrder._self?.confirmUrl ?? null,
      amount: total,
      currency,
      autoCapture,
    });
  } catch (err) {
    next(err);
  }
});
// ── GET /api/orders 
// Get all orders
router.get('/', (_req, res) => {
  const allOrders = Array.from(orders.entries()).map(([id, order]) => ({
    id,
    ...order,
  }));
  res.json(allOrders);
});

// ── GET /api/orders/:id 
// Get one order with live status from POK Pay
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const localOrder = orders.get(id);

    if (!localOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const pokResponse = await pokpay.getOrder(id);
    const pokOrder = pokResponse.data.sdkOrder;

     let derivedStatus = localOrder.status;
     if (pokOrder.isRefunded) {
       derivedStatus = 'REFUNDED';
     } else if (pokOrder.isCanceled) {
       derivedStatus = 'CANCELLED';
     } else if (localOrder.status === 'PARTIALLY_REFUNDED') {
       // Keep partial refund status 
       derivedStatus = 'PARTIALLY_REFUNDED';
     } else if (pokOrder.capturedAmount > 0) {
       derivedStatus = 'CAPTURED';
     } else if (pokOrder.canBeCaptured) {
       derivedStatus = 'AUTHORIZED';
     } else if (pokOrder.transactionId) {
       derivedStatus = 'AUTHORIZED';
     }
 
    localOrder.status = derivedStatus;

    res.json({
      id,
      ...localOrder,
      pokData: pokOrder,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = { router, orders };
