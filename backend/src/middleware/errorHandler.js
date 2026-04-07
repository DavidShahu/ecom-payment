function errorHandler(err, req, res, _next) {
  if (err.response) {
    const status = err.response.status || 502;
    const pokMessage = err.response.data?.message || '';

    // Map POK Pay error messages to friendly ones
    const friendlyMessages = {
      'Unauthorized': 'Authentication failed. Please check your API credentials.',
      'Missing authentication': 'Authentication token is missing or expired.',
      'Invalid URL': 'Invalid webhook or redirect URL configuration.',
      '"amount" is required': 'Payment amount is required.',
      '"amount" is not allowed': 'This operation does not accept an amount.',
      'Not Found': 'The requested order was not found on POK Pay.',
      'Order already captured': 'This order has already been captured.',
      'Order already refunded': 'This order has already been refunded.',
      'Order already cancelled': 'This order has already been cancelled.',
    };

    const message = friendlyMessages[pokMessage] || pokMessage || 'Payment gateway error';

    console.error(`[Error] POK Pay API ${status}:`, err.response.data);
    return res.status(status).json({ error: message });
  }

  if (err.request) {
    console.error('[Error] No response from POK Pay:', err.message);
    return res.status(503).json({ error: 'Payment gateway is unreachable. Please try again.' });
  }

  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong. Please try again.' });
}

module.exports = errorHandler;