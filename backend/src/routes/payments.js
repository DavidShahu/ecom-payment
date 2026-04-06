const express = require('express');
const router = express.Router();
const pokpay = require('../services/pokpay.service');
const { orders } = require('./orders');

// ── POST /api/payments/capture/:orderId ───────────────────────
router.post('/capture/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.autoCapture) {
      return res.status(400).json({ error: 'This order uses auto-capture' });
    }

    const result = await pokpay.captureOrder(orderId);

    order.status = 'CAPTURED';
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/payments/cancel/:orderId ────────────────────────
router.post('/cancel/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (['CAPTURED', 'REFUNDED', 'CANCELLED'].includes(order.status)) {
      return res.status(400).json({ error: `Cannot cancel an order with status: ${order.status}` });
    }

    const result = await pokpay.cancelOrder(orderId);

    order.status = 'CANCELLED';
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/payments/refund/:orderId ────────────────────────
// Send { amount: 1000 } in the body for partial refund
// Send nothing for a full refund
router.post('/refund/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body;
    const order = orders.get(orderId);

    if (!order) {
      return res. status(404).json({ error: 'Ordernot found' });
    }
    if (order.status !== 'CAPTURED') {
      return res.status(400).json({ error: 'Only captured orders can be refunded' });
    }

    const result = await pokpay.refundOrder(orderId, amount ?? null);

    const isPartial = amount != null && parseFloat(amount) < parseFloat(order.amount);
    order.status = isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED';
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, isPartial, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;