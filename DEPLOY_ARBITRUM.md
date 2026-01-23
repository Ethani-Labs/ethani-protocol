# Deploy ETHANI Protocol ke Arbitrum Sepolia Testnet

## Prerequisites

1. **Install Foundry** (jika belum)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Persiapkan Private Key**
   - Gunakan MetaMask: Settings → Security & Privacy → Show Private Key
   - Export key ke environment variable:
   ```bash
   export PRIVATE_KEY="your_private_key_here"
   ```

3. **Get Testnet Funds**
   - Kunjungi faucet Arbitrum Sepolia: https://faucet.arbitrum.io
   - Minta eth untuk alamat deployer

## Langkah-Langkah Deployment

### 1. Setup Environment
```bash
cd contracts
cp .env.example .env
# Edit .env dan isi:
# - PRIVATE_KEY
# - ADMIN_ADDRESS
# - Network: arbitrum-sepolia
```

### 2. Deploy Contracts ke Arbitrum Sepolia
```bash
# Deploy semua contracts (EthaniPricing, EthaniRegion, EthaniIncentive)
forge script script/DeployEthani.s.sol \
  --network arbitrum-sepolia \
  --broadcast \
  -vvv

# Output akan menampilkan contract addresses seperti:
# EthaniPricing deployed at: 0x...
# EthaniRegion deployed at: 0x...
# EthaniIncentive deployed at: 0x...
```

### 3. Verify Contracts (Optional tapi Recommended)
```bash
# Jika punya Arbiscan API key:
export ARBISCAN_API_KEY="your_arbiscan_api_key"

forge verify-contract \
  <CONTRACT_ADDRESS> \
  contracts/src/EthaniPricing.sol:EthaniPricing \
  --etherscan-api-key $ARBISCAN_API_KEY \
  --chain-id 421614
```

### 4. Update Backend Configuration
```bash
# Copy contract addresses ke backend .env
cd ../backend
cp .env.example .env

# Edit .env dan isi:
CONTRACT_ETHANI_CORE=0x...          # dari deployment
CONTRACT_ETHANI_PRICING=0x...       # dari deployment
ORACLE_PRIVATE_KEY=your_oracle_key
ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_CHAIN_ID=421614
```

### 5. Update Frontend Configuration
```bash
cd ../frontend
cp .env.example .env.local

# Edit .env.local dan isi:
NEXT_PUBLIC_CONTRACT_ETHANI_CORE=0x...
NEXT_PUBLIC_CONTRACT_ETHANI_PRICING=0x...
NEXT_PUBLIC_NETWORK=arbitrum-sepolia
NEXT_PUBLIC_CHAIN_ID=421614
```

### 6. Test Backend Connection
```bash
cd ../backend

# Install dependencies
pip install -r requirements.txt

# Run backend server
python -m uvicorn app.main:app --reload

# Test endpoint
curl http://localhost:8000/health
```

### 7. Test Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Run frontend
npm run dev

# Buka http://localhost:3000
```

## Network Details

| Property | Value |
|----------|-------|
| Network | Arbitrum Sepolia |
| Chain ID | 421614 |
| RPC URL | https://sepolia-rollup.arbitrum.io/rpc |
| Explorer | https://sepolia.arbiscan.io |
| Faucet | https://faucet.arbitrum.io |

## Troubleshooting

### "Insufficient funds" error
- Pastikan deployer address punya ETH di Arbitrum Sepolia
- Kunjungi faucet: https://faucet.arbitrum.io

### "Network not found" error
- Pastikan foundry.toml sudah punya [rpc_endpoints] untuk arbitrum-sepolia
- Cek: `cat contracts/foundry.toml | grep arbitrum`

### Contract verification gagal
- Tunggu beberapa menit agar block fully indexed di Arbiscan
- Cek implementation vs proxy jika menggunakan proxy pattern

## Deployment Checklist

- [ ] Install Foundry
- [ ] Export PRIVATE_KEY environment variable
- [ ] Setup contracts/.env
- [ ] Deploy contracts dengan forge script
- [ ] Catat semua contract addresses
- [ ] Setup backend/.env dengan contract addresses
- [ ] Setup frontend/.env.local
- [ ] Test backend server
- [ ] Test frontend connection
- [ ] Verify contracts di Arbiscan (optional)

## Useful Commands

```bash
# Check balance
cast balance <ADDRESS> --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Get latest block
cast block latest --rpc-url https://sepolia-rollup.arbitrum.io/rpc

# Estimate gas
forge estimate <CONTRACT>

# Monitor transaction
cast receipt <TX_HASH> --rpc-url https://sepolia-rollup.arbitrum.io/rpc
```

## Support

- Arbitrum Docs: https://docs.arbitrum.io
- Foundry Book: https://book.getfoundry.sh
- Etherscan Explorer: https://sepolia.arbiscan.io
