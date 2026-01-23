# ETHANI Deployment Checklist

**Document Version**: 1.0.0  
**Date**: 1 Januari 2026  
**Status**: Pre-Deployment Ready  
**Network**: Mantle Testnet → Mainnet

---

## ⚠️ CRITICAL REQUIREMENT

### Smart Contract Deployment & Verification

**Before using contract addresses in frontend, you MUST:**

1. ✅ **Deploy all 3 contracts to Mantle Testnet**
2. ✅ **Verify each contract on Mantle Testnet Explorer**
3. ✅ **Copy verified contract addresses to frontend**
4. ✅ **Test all contract interactions**
5. ✅ **Only then proceed with frontend deployment**

---

## 📋 Smart Contract Deployment Checklist

### Pre-Deployment

- [ ] All contracts compiled without errors
  ```bash
  cd contracts
  forge build
  ```

- [ ] All tests passing (17/17)
  ```bash
  forge test -vvv
  ```

- [ ] Private key configured
  ```bash
  export PRIVATE_KEY=0x...
  ```

- [ ] Mantle Testnet RPC configured
  ```bash
  # foundry.toml should have:
  [rpc_endpoints]
  mantle-testnet = "https://rpc.testnet.mantle.xyz"
  ```

- [ ] Account has MNT tokens for gas fees
  - Get testnet MNT from: https://faucet.testnet.mantle.xyz

### Deployment to Mantle Testnet

- [ ] Deploy contracts
  ```bash
  forge script script/DeployEthani.s.sol \
    --network mantle-testnet \
    --broadcast -vvv
  ```

- [ ] **Record all 3 contract addresses**
  ```
  [OK] EthaniPricing deployed at:  0x________
  [OK] EthaniRegion deployed at:   0x________
  [OK] EthaniIncentive deployed at: 0x________
  ```

- [ ] **SAVE ADDRESSES SAFELY**
  - Create file: `contracts/DEPLOYMENT_ADDRESSES.md`
  - Format:
    ```markdown
    # Mantle Testnet Deployment
    Date: [Date]
    Deployer: [Your Address]
    
    - EthaniPricing:   0x...
    - EthaniRegion:    0x...
    - EthaniIncentive: 0x...
    ```

### Verification on Mantle Testnet Explorer

#### ⭐ CRITICAL: Verify Each Contract

For each contract (EthaniPricing, EthaniRegion, EthaniIncentive):

1. **Go to Mantle Explorer**
   - Visit: https://explorer.testnet.mantle.xyz

2. **Search Contract Address**
   - Click "Search" 
   - Enter: `0x...` (contract address)

3. **Verify Source Code**
   - Click "Contract" tab
   - Click "Code" section
   - Click "Verify & Publish"

4. **Verification Details**
   ```
   Contract Name: EthaniPricing (or EthaniRegion, EthaniIncentive)
   Compiler Version: 0.8.20
   Optimization: Yes
   Optimization Runs: 200
   
   License Type: MIT
   ```

5. **Copy Contract Code**
   - From: `contracts/src/EthaniPricing.sol` (or other file)
   - Paste in explorer verification form

6. **Verify Constructor Arguments** (if any)
   ```
   No constructor arguments needed for these contracts
   ```

7. **Submit**
   - Click "Verify & Publish"
   - Wait for confirmation (usually <1 minute)

8. **Confirm Verification**
   - Should see "✓ Contract Verified" on explorer
   - Green checkmark on contract address page

#### Verification Checklist for All 3 Contracts

- [ ] **EthaniPricing** verified on explorer
  - Address: `0x...`
  - Link: `https://explorer.testnet.mantle.xyz/address/0x...`
  - Status: ✓ Verified

- [ ] **EthaniRegion** verified on explorer
  - Address: `0x...`
  - Link: `https://explorer.testnet.mantle.xyz/address/0x...`
  - Status: ✓ Verified

- [ ] **EthaniIncentive** verified on explorer
  - Address: `0x...`
  - Link: `https://explorer.testnet.mantle.xyz/address/0x...`
  - Status: ✓ Verified

### Post-Verification Testing

- [ ] Can read contract functions on explorer
  - Each verified contract should have "Read Contract" tab
  - Click to test `getSupplyDemandRatio`, `getRegion`, `getPoints` etc.

- [ ] Transactions visible on explorer
  - Any state-changing calls should appear

- [ ] Contract state accessible
  - Should be able to view storage/state on explorer

---

## 🔗 Frontend Integration Checklist

### Environment Configuration

- [ ] Copy contract addresses to `.env.local`
  ```env
  NEXT_PUBLIC_CONTRACT_PRICING=0x...
  NEXT_PUBLIC_CONTRACT_REGION=0x...
  NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...
  ```

- [ ] Verify addresses are correct (copy-paste carefully)
  ```bash
  # Check addresses match explorer
  grep NEXT_PUBLIC_CONTRACT .env.local
  ```

- [ ] Set correct network
  ```env
  NEXT_PUBLIC_NETWORK=mantle-testnet
  NEXT_PUBLIC_CHAIN_ID=5001
  NEXT_PUBLIC_RPC_URL=https://rpc.testnet.mantle.xyz
  NEXT_PUBLIC_EXPLORER_URL=https://explorer.testnet.mantle.xyz
  ```

- [ ] Backend API URL configured
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

### Frontend Build & Test

- [ ] Frontend builds without errors
  ```bash
  cd frontend
  npm run build
  ```

- [ ] TypeScript checking passes
  ```bash
  npm run type-check
  ```

- [ ] Development server starts
  ```bash
  npm run dev
  ```

- [ ] Pages load at localhost:3000
  - [ ] Landing page: http://localhost:3000
  - [ ] Login: http://localhost:3000/login
  - [ ] Register: http://localhost:3000/register
  - [ ] Dashboard: http://localhost:3000/dashboard

### Contract Integration Testing

- [ ] Backend running
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```

- [ ] Can login to frontend

- [ ] Pricing data loads from contract
  - [ ] `/pricing/latest` endpoint responds
  - [ ] Contract functions callable via backend

- [ ] Can view products (uses pricing from contract)

- [ ] Can add supply (farmer dashboard)
  - [ ] Triggers region update via contract

- [ ] Can place order (buyer dashboard)

- [ ] Can track delivery (distributor dashboard)

---

## 🚀 Backend Deployment Checklist

### Local Testing

- [ ] All endpoints tested locally
  ```bash
  curl http://localhost:8000/health
  curl http://localhost:8000/products
  curl http://localhost:8000/pricing/latest
  ```

- [ ] Can call smart contracts via backend
  - [ ] EthaniPricing callable
  - [ ] EthaniRegion callable
  - [ ] EthaniIncentive callable

- [ ] Web3 library configured correctly
  - [ ] RPC URL correct
  - [ ] Contract addresses correct in backend
  - [ ] ABI files present

### Production Deployment

- [ ] Backend deployed to production server
  - [ ] Domain/IP: `_____________`
  - [ ] Port: `_____________`
  - [ ] SSL: https configured

- [ ] Environment variables set on server
  ```env
  RPC_URL=https://rpc.testnet.mantle.xyz
  CONTRACT_PRICING=0x...
  CONTRACT_REGION=0x...
  CONTRACT_INCENTIVE=0x...
  ```

- [ ] Database migrations run
  ```bash
  python -m alembic upgrade head
  ```

- [ ] Health check passes
  ```bash
  curl https://api.ethani.io/health
  ```

- [ ] Logging configured
  - Logs to file or service (CloudWatch, DataDog, etc.)

- [ ] Monitoring enabled
  - Performance metrics tracked
  - Error tracking enabled
  - Uptime monitoring active

---

## 🌐 Frontend Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured in `.env.local`

- [ ] Build successful
  ```bash
  npm run build
  ```

- [ ] No TypeScript errors
  ```bash
  npm run type-check
  ```

- [ ] All pages accessible locally

### Deployment to Vercel (Recommended)

- [ ] Vercel account created
  - [ ] Connected to GitHub
  - [ ] Project created

- [ ] Environment variables set in Vercel
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_CONTRACT_PRICING`
  - [ ] `NEXT_PUBLIC_CONTRACT_REGION`
  - [ ] `NEXT_PUBLIC_CONTRACT_INCENTIVE`
  - [ ] `NEXT_PUBLIC_NETWORK`
  - [ ] `NEXT_PUBLIC_CHAIN_ID`
  - [ ] `NEXT_PUBLIC_RPC_URL`
  - [ ] `NEXT_PUBLIC_EXPLORER_URL`

- [ ] Domain configured
  - [ ] Domain: `_____________`
  - [ ] SSL: ✓ Automatic

- [ ] Deployment successful
  ```
  Build Status: ✓ Success
  Deployment URL: https://ethani.vercel.app
  ```

- [ ] Production site accessible
  - [ ] https://yourdomain.com loads
  - [ ] All pages accessible
  - [ ] No console errors

### Alternative: Docker Deployment

- [ ] Dockerfile created
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY . .
  RUN npm install && npm run build
  EXPOSE 3000
  CMD ["npm", "start"]
  ```

- [ ] Docker image built
  ```bash
  docker build -t ethani-frontend:latest .
  ```

- [ ] Docker image tested
  ```bash
  docker run -p 3000:3000 ethani-frontend:latest
  ```

- [ ] Image deployed to registry
  - [ ] Docker Hub
  - [ ] AWS ECR
  - [ ] Google Container Registry

- [ ] Container orchestration configured
  - [ ] Docker Compose or Kubernetes
  - [ ] Auto-scaling enabled
  - [ ] Health checks configured

---

## 🔐 Security Checklist

### Frontend Security

- [ ] No private keys in code
  - Grep check: `grep -r "0x[a-fA-F0-9]" frontend/` (should be empty except .env)

- [ ] No API keys in code
  - All sensitive data in environment variables

- [ ] HTTPS enforced
  - [ ] Certificate valid
  - [ ] Certificate auto-renewal configured

- [ ] CORS properly configured
  - [ ] Only allow necessary origins
  - [ ] Credentials handled correctly

- [ ] CSP headers set
  - [ ] Content-Security-Policy configured

### Backend Security

- [ ] Database secured
  - [ ] Strong password
  - [ ] Encrypted connections
  - [ ] Regular backups

- [ ] API authentication required
  - [ ] JWT tokens validated
  - [ ] Token expiration set
  - [ ] Refresh token mechanism

- [ ] Rate limiting enabled
  - [ ] Prevents brute force attacks
  - [ ] Per-endpoint limits configured

- [ ] Input validation strict
  - [ ] SQL injection prevented
  - [ ] XSS protected

- [ ] Error messages safe
  - [ ] No sensitive info in errors
  - [ ] Proper error logging

### Smart Contract Security

- [ ] Contracts audited (internal review)
  - [ ] All functions reviewed
  - [ ] No obvious vulnerabilities

- [ ] Contract addresses immutable
  - [ ] No way to change contract address
  - [ ] Frontend points to correct address

- [ ] Access control verified
  - [ ] Only owner can update regions
  - [ ] Only admin can grant points
  - [ ] Public functions identified

- [ ] Gas limits acceptable
  - [ ] No unbounded loops
  - [ ] Reasonable gas usage

---

## 📊 Monitoring & Maintenance

### Monitoring Setup

- [ ] Uptime monitoring
  - [ ] Frontend: https://yourdomain.com
  - [ ] Backend: https://api.yourdomain.com/health
  - [ ] Smart contracts: explorer calls

- [ ] Error tracking
  - [ ] Service: Sentry, DataDog, etc.
  - [ ] Notifications configured
  - [ ] Slack/email alerts enabled

- [ ] Performance monitoring
  - [ ] Page load times tracked
  - [ ] API response times tracked
  - [ ] Database query times monitored

- [ ] Transaction monitoring
  - [ ] Smart contract calls logged
  - [ ] Failed transactions tracked
  - [ ] Gas usage monitored

### Maintenance Schedule

- [ ] Daily checks
  - [ ] Services running: ✓
  - [ ] No errors: ✓
  - [ ] Performance normal: ✓

- [ ] Weekly checks
  - [ ] Database backup: ✓
  - [ ] Logs reviewed: ✓
  - [ ] Metrics analyzed: ✓

- [ ] Monthly checks
  - [ ] Security updates: ✓
  - [ ] Dependency updates: ✓
  - [ ] Performance optimization: ✓

---

## 🎯 Go-Live Checklist

### 48 Hours Before Launch

- [ ] All systems tested end-to-end
- [ ] Backup plan documented
- [ ] Rollback plan documented
- [ ] Support team trained
- [ ] Communication plan ready

### Launch Day

- [ ] Monitor systems continuously
  - [ ] Frontend: No 5xx errors
  - [ ] Backend: No exceptions
  - [ ] Smart contracts: Calls successful

- [ ] Be ready to rollback
  - [ ] Previous version on standby
  - [ ] Rollback procedure tested

- [ ] Communicate status
  - [ ] Status page updated
  - [ ] Team notified
  - [ ] Users informed (if needed)

### Post-Launch

- [ ] Monitor 24/7 for first week
  - [ ] No critical issues: ✓
  - [ ] Performance acceptable: ✓
  - [ ] Users happy: ✓

- [ ] Collect feedback
  - [ ] User issues reported
  - [ ] Performance metrics
  - [ ] Bug reports

- [ ] Plan improvements
  - [ ] High-priority bugs fixed
  - [ ] Performance optimizations
  - [ ] Feature requests tracked

---

## 🔄 Update & Upgrade Process

### When Updating Smart Contracts

⚠️ **Important: Smart contracts are IMMUTABLE**

If you need to change contract logic:
1. Deploy new contract version
2. Copy new address to frontend `.env`
3. Update documentation
4. Announce to users
5. Migrate data if needed

### When Updating Frontend

1. Update code in GitHub
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `vercel --prod`
5. Verify at production domain
6. Monitor for errors

### When Updating Backend

1. Update code in GitHub
2. Run tests: `pytest`
3. Test locally: `uvicorn app.main:app --reload`
4. Deploy to production
5. Monitor logs
6. Verify endpoints working

### When Updating Dependencies

```bash
# Check for updates
npm outdated
pip list --outdated

# Update carefully
npm update
pip install --upgrade -r requirements.txt

# Test thoroughly
npm run build
npm run type-check
pytest
forge test

# Deploy only if all tests pass
```

---

## 📚 Documentation During Deployment

### Keep Updated

- [ ] `DEPLOYMENT_ADDRESSES.md` - Contract addresses
- [ ] `DEPLOYMENT_LOG.md` - Dates and versions deployed
- [ ] `.env.example` - Template for environment variables
- [ ] `README.md` - Setup instructions
- [ ] API docs - Backend endpoints
- [ ] Contract docs - ABI and functions

### Handoff Documentation

- [ ] How to redeploy if needed
- [ ] How to rollback
- [ ] How to scale up
- [ ] How to monitor
- [ ] How to debug issues
- [ ] Who to contact for each component

---

## ✅ Final Verification

### Before Announcing Launch

- [ ] All 3 contracts verified on explorer ✓
- [ ] Frontend connected to backend ✓
- [ ] Contract addresses correct ✓
- [ ] All endpoints working ✓
- [ ] Mobile responsive ✓
- [ ] No console errors ✓
- [ ] All roles tested ✓
- [ ] Pricing calculation verified ✓
- [ ] Authentication working ✓
- [ ] Performance acceptable ✓

### Sign-Off

- [ ] Lead Developer: _______________ Date: _______
- [ ] Backend Dev: _______________ Date: _______
- [ ] Frontend Dev: _______________ Date: _______
- [ ] DevOps/Deployment: _______________ Date: _______
- [ ] Product Owner: _______________ Date: _______

---

## 📞 Deployment Support

### If Something Goes Wrong

1. **Check Explorer**
   - Contract addresses correct?
   - Functions callable?

2. **Check Backend Logs**
   - Errors logged?
   - Can call contracts?

3. **Check Frontend Console**
   - JavaScript errors?
   - Network errors?

4. **Check Network**
   - RPC responding?
   - Can reach explorer?

5. **Rollback if Needed**
   - Revert to previous version
   - Update `.env` with old addresses
   - Redeploy

### Emergency Contacts

```
Lead Developer: _______________
DevOps: _______________
Contract Owner: _______________
```

---

## 🎉 Post-Launch

### Success Metrics

- [ ] 99.9% uptime achieved
- [ ] < 2 second page load time
- [ ] 0 critical bugs
- [ ] Users can complete transactions
- [ ] Prices update correctly
- [ ] All roles work as expected

### Next Steps

1. Monitor for 1 week continuously
2. Collect user feedback
3. Fix any bugs found
4. Plan improvements
5. Prepare for scaling

---

**Document Version**: 1.0.0  
**Last Updated**: 1 Januari 2026  
**Next Review**: After first deployment

**Remember**: Verify all contracts on explorer before going live! ✓
