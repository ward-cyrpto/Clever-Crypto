# Gas Fee Implementation Documentation

## Overview

Clever Crypto implements a 0.5% gas fee on all trades. These fees are automatically deducted from each trade execution and directed to your personal Base wallet address.

**Wallet Address:** `0xe401Ce54a66F8944706Ae928D144544ee3071556`  
**Network:** Base  
**Fee Percentage:** 0.5%  

## How It Works

### Trade Execution with Gas Fees

When a user executes a trade:

1. **Calculate Gross Amount**
   ```
   Gross Amount = Quantity × Price
   ```

2. **Calculate Gas Fee (0.5%)**
   ```
   Gas Fee = Gross Amount × 0.5 / 100
   ```

3. **Calculate Net Amount**
   ```
   Net Amount = Gross Amount - Gas Fee
   ```

4. **Record Transaction**
   - Trade executed with net amount
   - Fee recorded and tracked
   - Fee transferred to wallet

### Example

**Trade Details:**
- Symbol: BTC/USD
- Type: BUY
- Quantity: 0.5 BTC
- Price: $45,000

**Calculation:**
```
Gross Amount = 0.5 × $45,000 = $22,500
Gas Fee (0.5%) = $22,500 × 0.5 / 100 = $112.50
Net Amount = $22,500 - $112.50 = $22,387.50
```

**Fee Transfer:**
```
From: Trading Platform
To: 0xe401Ce54a66F8944706Ae928D144544ee3071556
Amount: $112.50 (in trade currency)
Network: Base
Type: Gas Fee
```

## API Endpoints

### Execute Trade (with automatic gas fee deduction)

**POST** `/api/trades/execute`

```bash
curl -X POST http://localhost:3000/api/trades/execute \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTC/USD",
    "type": "BUY",
    "quantity": 0.5,
    "price": 45000
  }'
```

**Response:**
```json
{
  "id": "trade_1624147200000",
  "symbol": "BTC/USD",
  "type": "BUY",
  "quantity": 0.5,
  "price": 45000,
  "grossAmount": 22500,
  "gasFeeAmount": 112.5,
  "gasFeePercentage": 0.5,
  "netAmount": 22387.5,
  "feeWallet": "0xe401Ce54a66F8944706Ae928D144544ee3071556",
  "feeTransaction": {
    "from": "trading_platform",
    "to": "0xe401Ce54a66F8944706Ae928D144544ee3071556",
    "value": 112.5,
    "currency": "BTC",
    "network": "base",
    "type": "gas_fee_transfer",
    "status": "pending",
    "transactionHash": "0x..."
  },
  "timestamp": "2026-06-20T10:00:00Z",
  "status": "executed",
  "network": "base"
}
```

### Get Gas Fee Statistics

**GET** `/api/gas-fees/statistics`

```bash
curl -X GET http://localhost:3000/api/gas-fees/statistics
```

**Response:**
```json
{
  "feeWallet": "0xe401Ce54a66F8944706Ae928D144544ee3071556",
  "feePercentage": 0.5,
  "accumulatedFees": {
    "BTC": 0.25,
    "ETH": 1.5,
    "USDC": 250
  },
  "totalFeesCombined": 251.75,
  "network": "base",
  "timestamp": "2026-06-20T10:00:00Z"
}
```

### Get Accumulated Fees

**GET** `/api/gas-fees/accumulated`

```bash
curl -X GET http://localhost:3000/api/gas-fees/accumulated
```

**Response:**
```json
{
  "accumulatedFees": {
    "BTC": 0.25,
    "ETH": 1.5,
    "USDC": 250
  },
  "feeWallet": "0xe401Ce54a66F8944706Ae928D144544ee3071556",
  "network": "base",
  "feePercentage": 0.5
}
```

## Fee Tracking

All fees are tracked by currency:

```javascript
accumulatedFees = {
  "BTC": 0.25,      // 0.25 BTC collected
  "ETH": 1.5,       // 1.5 ETH collected
  "USDC": 250,      // 250 USDC collected
  "USD": 5000       // $5,000 collected
}
```

## Fee Transfer Mechanism

### Real-time Transfer (Current Implementation)
- Fees are calculated immediately
- Transaction record created
- Fees directed to wallet on Base network

### Batch Transfer (Optional)
To enable batch transfers:
1. Set `batchProcessing: true` in config
2. Fees accumulate until reaching batch size
3. Single transaction processes all accumulated fees

## Configuration

**File:** `src/config/gasFees.js`

```javascript
{
  GAS_FEE_WALLET: '0xe401Ce54a66F8944706Ae928D144544ee3071556',
  GAS_FEE_PERCENTAGE: 0.5,
  BLOCKCHAIN_NETWORK: 'base',
  BASE_RPC_URL: 'https://mainnet.base.org',
  GAS_FEE_TRACKING: {
    enabled: true,
    logTransactions: true,
    batchProcessing: false,
    batchSize: 10
  }
}
```

## Security

1. **Wallet Validation**
   - Checks for valid Base wallet format (0x...)
   - Only valid addresses accepted

2. **Fee Calculation**
   - Precise decimal calculations
   - Rounded to 8 decimal places

3. **Transaction Logging**
   - All fees logged and tracked
   - Audit trail maintained
   - Timestamps recorded

4. **Network Security**
   - HTTPS only
   - JWT authentication
   - Rate limiting applied

## Blockchain Integration

### Currently Implemented
- Fee calculation
- Fee tracking
- Fee statistics
- Transaction hash generation

### To Be Implemented
- Real Base network integration via RPC
- Smart contract interaction (optional)
- Actual on-chain transfers
- Transaction confirmation handling

## Fee History Example

```json
{
  "trades": [
    {
      "id": "trade_1",
      "symbol": "BTC/USD",
      "grossAmount": 22500,
      "gasFeeAmount": 112.5,
      "gasFeePercentage": 0.5,
      "netAmount": 22387.5
    },
    {
      "id": "trade_2",
      "symbol": "ETH/USD",
      "grossAmount": 5000,
      "gasFeeAmount": 25,
      "gasFeePercentage": 0.5,
      "netAmount": 4975
    }
  ],
  "totalGasFeesCollected": 137.5
}
```

## Advantages

1. **Automated** - No manual intervention required
2. **Transparent** - Users see fees in responses
3. **Trackable** - All fees logged and auditable
4. **Flexible** - Easy to adjust percentage
5. **Network-based** - Funds go to Base wallet
6. **Scalable** - Handles high transaction volumes

## Support

For questions about gas fees:
- Check `/api/gas-fees/statistics`
- Review transaction history
- Email: support@clevercrypto.com
