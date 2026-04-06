//Webhook Implementation
//here we have the calls that will be from pok to my system, isntead of from front to back end


const express = require('express');
const router = express.Router();
const pokpay = require('../services/pokpay.service');
const { orders } = require('./orders');

// POST /api/webhooks/payment
// POK Pay calls this when a payment event happens
// Payload: { orderId }
router.post('/payment', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      console.warn('[Webhook] Received payload without orderId');
      return res.status(400).json({ error: 'orderId is required' });
    }

    console.log(`[Webhook] Payment event received for order: ${orderId}`);

    // Get the latest status from POK Pay
    const pokResponse = await pokpay.getOrder(orderId);
    const pokOrder = pokResponse.data;

    // Update our local order
    const localOrder = orders.get(orderId);
    if (localOrder) {
      localOrder.status = pokOrder.status ?? localOrder.status;
      localOrder.updatedAt = new Date().toISOString();
      console.log(`[Webhook] Order ${orderId} updated to: ${localOrder.status}`);
    }

    // If we return anything other than 200, POK Pay will keep retrying
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[Webhook] Error:', err.message);
    // Still return 200 to stop retrying
    res.status(200).json({ received: true });
  }
});

module.exports = router;

