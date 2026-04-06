# ECOM Payment Integration — POK Pay

A full-stack e-commerce application demonstrating a complete payment lifecycle using the [POK Pay API](https://payments.doc.pokpay.io/).

**Stack:** Node.js + Express (backend) · Angular 21 (frontend)

---

## Features

 
| Product listing & cart 
| Order creation with Auto-Capture toggle 
| Redirect to POK Pay hosted checkout 
| Payment authorisation 
| Manual capture (when Auto-Capture OFF) 
| Order cancellation 
| Partial & full refunds 
| Webhook handling 
| Merchant dashboard 
 
## Project Structure

ecom-payment/
├── backend/
│   ├── server.js
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── middleware/
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── orders.js
│       │   ├── payments.js
│       │   └── webhooks.js
│       └── services/
│           └── pokpay.service.js
│
└── frontend/
└── src/
└── app/
├── core/services/
│   ├── cart.service.ts
│   └── order.service.ts
├── models/
│   └── index.ts
└── pages/
├── products/
├── checkout/
├── order-status/
└── dashboard/


## Setup

### Prerequisites

- Node.js v18+
- npm v9+
- Angular CLI v17+
- [ngrok](https://ngrok.com/) for webhook testing




### 1. Clone the repository
```bash
git clone 
cd ecom-payment
```

### 2. Install all dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Configure environment variables
```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your `WEBHOOK_BASE_URL` (ngrok URL).

### 4. Run everything with one command
```bash
# Start backend + frontend + ngrok tunnel all at once
npm run dev
```

Or without ngrok (if you don't need webhooks):
```bash
npm start
```

| Command | What it starts |
|---|---|
| `npm run dev` | Backend + Frontend + ngrok |
| `npm start` | Backend + Frontend only |
| `npm run backend` | Backend only |
| `npm run frontend` | Frontend only |
| `npm run tunnel` | ngrok only |

Frontend runs on **http://localhost:4200**  
Backend runs on **http://localhost:3000**  
ngrok dashboard at **http://localhost:4040**



## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 3000) |
| `POKPAY_BASE_URL` | POK Pay API base URL |
| `POKPAY_MERCHANT_ID` | Your merchant ID |
| `POKPAY_KEY_ID` | API key ID |
| `POKPAY_KEY_SECRET` | API key secret |
| `WEBHOOK_BASE_URL` | Public ngrok URL |
| `FRONTEND_URL` | Frontend URL for CORS |

---

## API Endpoints

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get single order |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/capture/:id` | Manually capture |
| POST | `/api/payments/cancel/:id` | Cancel order |
| POST | `/api/payments/refund/:id` | Partial or full refund |

### Webhooks
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/webhooks/payment` | Receive POK Pay events |

---

## Payment Flow


Add to cart → Checkout → POST /api/orders
-->
POK Pay creates SDK order
-->
Redirect to POK Pay checkout
-->
Customer enters card & pays

 
Auto-Capture ON?       
  YES --> Captured immediately   
  NO  --> Authorised, merchant   
         must capture manually  
 

POK Pay fires POST /api/webhooks/payment
Backend updates local order status


---

## Test Card

| Field | Value |
|---|---|
| Card Number | `4000 0000 0000 1091` |
| CVV | Any 3 digits |
| Expiry | Any date after 12/25 |
| 3DS Code | `1234` |

---

## Known Issues


During testing there have been problems with the checkout test enviorment at (`pay-staging.pokpay.io`) 'WebSocket connection to 'wss://api-staging.pokpay.io/socket.io/' failed' 
in diffrent browsers that prevents the payment flow to continue as predicted

Gjat testimit jan hasur probleme me ambjetin test per checkout te (`pay-staging.pokpay.io`) 'WebSocket connection to 'wss://api-staging.pokpay.io/socket.io/' failed' 
kjo eshte hasur ne browser te ndryshem dhe nuk eshte problem integrimi nga sistemi dhe pengon rrjedhen e konfirmit te pageses


API authentication  --works
Order creation  --works
Redirect to hosted checkout  --works
Order status tracking   --works 
Webhook endpoint  --works
Payment confirmation blocked by staging WebSocket issue  --doesnt work 
