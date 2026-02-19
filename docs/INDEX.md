# 📚 ETHANI Documentation Index

Complete guide to ETHANI system - rule-based food price stabilization on Arbitrum.

---

## 🚀 Quick Start
- **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** - Dev environment setup (5 min)
- **[VERCEL_RAILWAY_DEPLOYMENT.md](./VERCEL_RAILWAY_DEPLOYMENT.md)** - Production deployment guide

---

## 📌 Current Deployment Status

### Live Services ✅
```
Frontend:  https://ethani-frontend.vercel.app
Backend:   https://agile-quietude-production.up.railway.app
```

**Full Details:** [DEPLOYMENT_COMPLETE_PRODUCTION.md](./DEPLOYMENT_COMPLETE_PRODUCTION.md)

---

## 📖 Architecture & Design

### System Overview
- **[architecture.md](./architecture.md)** - System architecture overview
- **[HYBRID_ARCHITECTURE.md](./HYBRID_ARCHITECTURE.md)** - Stylus + Solidity hybrid design
- **[pricing-model.md](./pricing-model.md)** - Pricing rules and calculations

### Smart Contracts
- **[SMART_CONTRACTS.md](./SMART_CONTRACTS.md)** - Contract overview & addresses
- **[STYLUS_SOURCE_CODE.md](./STYLUS_SOURCE_CODE.md)** - Stylus contract source code
- **[STYLUS_VERIFICATION_GUIDE.md](./STYLUS_VERIFICATION_GUIDE.md)** - Verification steps
- **[STYLUS_CONTRACT_ANALYSIS.md](./STYLUS_CONTRACT_ANALYSIS.md)** - Gap analysis & features

### Backend & Frontend
- **[BACKEND_SERVICE.md](./BACKEND_SERVICE.md)** - Backend API documentation
- **[FRONTEND.md](./FRONTEND.md)** - Frontend features and pages
- **[INTEGRATION_TESTING.md](./INTEGRATION_TESTING.md)** - Testing procedures

---

## 🔍 Audits & Reports
- **[AUDIT_REPORT.md](./AUDIT_REPORT.md)** - Security audit results
- **[REPOSITORY_AUDIT_REPORT.md](./REPOSITORY_AUDIT_REPORT.md)** - Code structure audit

---

## 🎯 Vision & Roadmap
- **[vision.md](./vision.md)** - Project vision and goals
- **[roadmap.md](./roadmap.md)** - Development roadmap

---

## 📋 File Organization

```
docs/
├── 📌 INDEX.md (this file) ← START HERE
├── 📘 README.md (legacy - see INDEX.md instead)
│
├── 🚀 QUICK START
│   ├── LOCAL_SETUP.md
│   └── VERCEL_RAILWAY_DEPLOYMENT.md
│
├── 📊 CURRENT STATE
│   └── DEPLOYMENT_COMPLETE_PRODUCTION.md (LATEST)
│
├── 🏗️ ARCHITECTURE
│   ├── architecture.md
│   ├── HYBRID_ARCHITECTURE.md
│   ├── pricing-model.md
│   ├── vision.md
│   └── roadmap.md
│
├── 🔐 SMART CONTRACTS
│   ├── SMART_CONTRACTS.md
│   ├── STYLUS_SOURCE_CODE.md
│   ├── STYLUS_VERIFICATION_GUIDE.md
│   └── STYLUS_CONTRACT_ANALYSIS.md
│
├── 🛠️ BACKEND & FRONTEND
│   ├── BACKEND_SERVICE.md
│   ├── FRONTEND.md
│   └── INTEGRATION_TESTING.md
│
└── 🔍 AUDITS
    ├── AUDIT_REPORT.md
    └── REPOSITORY_AUDIT_REPORT.md
```

---

## 🔗 Key Links

### Repositories
- **Backend**: https://github.com/maniknur/Ethani-Backend
- **Frontend**: https://github.com/maniknur/Ethani-Frontend
- **Protocol**: https://github.com/Ethani-Labs/ethani-protocol

### Live Deployments
- **Frontend**: https://ethani-frontend.vercel.app
- **Backend API**: https://agile-quietude-production.up.railway.app
- **Health Check**: https://agile-quietude-production.up.railway.app/health

### Blockchain
- **Network**: Arbitrum Sepolia
- **Chain ID**: 421614
- **RPC**: https://sepolia-rollup.arbitrum.io/rpc
- **Explorer**: https://sepolia.arbiscan.io

### Smart Contracts on Arbitrum Sepolia
- **EthaniPricing (Stylus)**: `0xf174bC196b4e0886aeA7e48D91661798B376F57C`
- **EthaniPricing (Solidity)**: `0xc92fd01c122821Eb2C911d16468B20b07E25abC0`
- **EthaniRegion**: `0x5836cdDEb6AD9c4b10f2aD413Db29ca67e89dFab`
- **EthaniCore**: `0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4`
- **EthaniIncentive**: `0xE6C246d7Ba92c4d35076C91B686d104ad3118172`

---

## 🎓 Learning Path

### For Newcomers
1. Read: [vision.md](./vision.md) - Understand why ETHANI exists
2. Read: [architecture.md](./architecture.md) - How it works
3. Follow: [LOCAL_SETUP.md](./LOCAL_SETUP.md) - Run it locally
4. Test: Backend API at http://localhost:8000/docs

### For Developers
1. [BACKEND_SERVICE.md](./BACKEND_SERVICE.md) - API documentation
2. [SMART_CONTRACTS.md](./SMART_CONTRACTS.md) - Contract addresses
3. [INTEGRATION_TESTING.md](./INTEGRATION_TESTING.md) - Testing guide
4. [HYBRID_ARCHITECTURE.md](./HYBRID_ARCHITECTURE.md) - Stylus integration

### For Auditors
1. [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Security findings
2. [STYLUS_VERIFICATION_GUIDE.md](./STYLUS_VERIFICATION_GUIDE.md) - Contract verification
3. [STYLUS_SOURCE_CODE.md](./STYLUS_SOURCE_CODE.md) - Source code review

---

## 🔄 Status Summary

| Component | Status | Link |
|-----------|--------|------|
| Frontend | ✅ Live | https://ethani-frontend.vercel.app |
| Backend | ✅ Live | https://agile-quietude-production.up.railway.app |
| Contracts | ✅ Deployed | [Arbitrum Sepolia](https://sepolia.arbiscan.io) |
| Stylus | ✅ Operational | Pricing engine running |
| Documentation | ✅ Complete | You are here |

---

## 📞 Need Help?

- **Setup Issues?** → [LOCAL_SETUP.md](./LOCAL_SETUP.md)
- **API Questions?** → [BACKEND_SERVICE.md](./BACKEND_SERVICE.md)
- **Contract Details?** → [SMART_CONTRACTS.md](./SMART_CONTRACTS.md)
- **Deployment Help?** → [VERCEL_RAILWAY_DEPLOYMENT.md](./VERCEL_RAILWAY_DEPLOYMENT.md)

---

**Last Updated:** February 19, 2026  
**ETHANI Status:** Production Ready ✅
