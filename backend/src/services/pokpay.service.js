
// the http client 
const axios = require('axios');

const BASE_URL = process.env.POKPAY_BASE_URL;
const MERCHANT_ID = process.env.POKPAY_MERCHANT_ID;
 
// cache per token qe mos te therriret ne cdo call por vetem kur ben expire
let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    console.log(cachedToken)
    return cachedToken;
  } 

  const response = await axios.post(`${BASE_URL}/auth/sdk/login`, {
    keyId: process.env.POKPAY_KEY_ID,
    keySecret: process.env.POKPAY_KEY_SECRET,
  });

  //console.log('[POK Pay] Login response:', JSON.stringify(response.data, null, 2));

  cachedToken = response.data.data.accessToken;
  // ben refresh 5 min para se te skadoj (60 min token mdk?)
  tokenExpiresAt = Date.now() + 5 * 10 * 1000;
  //console.log(cachedToken)

  console.log('Token refreshed');
  return cachedToken;
}


//kethen headers per hrttp requests 
async function authHeader() {
  const token = await getToken();
  return { Authorization: `Bearer ${token}` };
}

//   API calls 
async function createOrder(payload) {
  const headers = await authHeader();
  const response = await axios.post(
    `${BASE_URL}/merchants/${MERCHANT_ID}/sdk-orders`,
    payload,
    { headers }
  );
  return response.data;
}

async function getOrder(sdkOrderId) {
  const headers = await authHeader();
  const response = await axios.get(
    `${BASE_URL}/sdk-orders/${sdkOrderId}`,
    { headers }
  );
  return response.data;
}

async function captureOrder(sdkOrderId) {
  const headers = await authHeader();
  const response = await axios.post(
    `${BASE_URL}/merchants/${MERCHANT_ID}/sdk-orders/${sdkOrderId}/capture`,
    {},
    { headers }
  );
  return response.data;
}

async function refundOrder(sdkOrderId, amount) {
  const headers = await authHeader();
  const body = amount != null ? { amount: String(amount) } : {};
  const response = await axios.post(
    `${BASE_URL}/merchants/${MERCHANT_ID}/sdk-orders/${sdkOrderId}/refund`,
    body,
    { headers }
  );
  return response.data;
}

async function cancelOrder(sdkOrderId) {
  const headers = await authHeader();
  const response = await axios.post(
    `${BASE_URL}/merchants/${MERCHANT_ID}/sdk-orders/${sdkOrderId}/cancel`,
    {},
    { headers }
  );
  return response.data;
}

module.exports = {
  createOrder,
  getOrder,
  captureOrder,
  refundOrder,
  cancelOrder,
};