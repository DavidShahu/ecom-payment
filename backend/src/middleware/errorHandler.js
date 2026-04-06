// ketu behen hangle errors (next(err))

function errorHandler(err, req, res, next) {
  // Error coming from a POK Pay API call
  if (err.response) {
    const status = err.response.status || 502;
    const message = err.response.data?.message || 'POK Pay API error';

    console.error(`[Error] POK Pay API ${status}:`, err.response.data);
    return res.status(status).json({ error: message });
  }

  // POK Pay API is unreachable
  if (err.request) {
    console.error('[Error] No response from POK Pay:', err.message);
    return res.status(503).json({ error: 'Payment gateway unreachable' });
  }

  // Everything else
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;