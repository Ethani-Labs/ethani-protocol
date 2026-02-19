# 🚀 ETHANI Deployment to Vercel & Railway

**Updated: February 19, 2026**

## Quick Start

This guide covers deploying ETHANI system to production:
- **Frontend:** Vercel (Next.js)
- **Backend:** Railway (FastAPI)

---

## Part 1: Backend Deployment to Railway

### Prerequisites

✅ Railway account: https://railway.app  
✅ GitHub repository with code  
✅ Procfile configured (already done!)

### Step 1: Create Railway Project

```bash
# Option A: Using Railway CLI
npm i -g @railway/cli
railway login
cd backend
railway init
# Select: Create a new project
# Project name: ethani-backend
```

**Option B: Railway Dashboard**
1. Go to https://railway.app
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your Ethani-Labs/ethani-protocol repository
5. Give it a name: `ethani-backend`

### Step 2: Add Environment Variables

In Railway Dashboard > Variables, add:

```env
# Blockchain
ARBITRUM_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_CHAIN_ID=421614
BLOCKCHAIN_ENABLED=true

# Smart Contracts
ETHANI_PRICING_CONTRACT=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
ETHANI_REGION_CONTRACT=0x5836cdDEb6AD9c4b10f2aD413Db29ca67e89dFab
ETHANI_CORE_CONTRACT=0x05aF2330b4f04d49e52D1dE5c5c59DeF3C16f3Ad
ETHANI_INCENTIVE_CONTRACT=0xE6C246d7c0cda1c7b21D24F79e0dFEd6Cb7FB3CE

# Security
SECRET_KEY=your-random-secret-key-32-chars-minimum
DEBUG=false
ENVIRONMENT=production

# API
CORS_ORIGINS=["https://ethani-frontend.vercel.app","https://ethani.app"]
API_RELOAD=false
```

### Step 3: Configure Build Settings

Railway will auto-detect `Procfile`:

```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

If needed, set manually:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Deploy

```bash
# Option A: Push to GitHub (Railway auto-deploys)
git push origin main

# Option B: Deploy via CLI
railway service add python
railway up --service api
```

### Step 5: Get Your Backend URL

After deploy:
```bash
railway status
# Shows: https://ethani-backend-production.railway.app
```

### Test Backend

```bash
curl https://ethani-backend-production.railway.app/health

# Expected:
# {"status":"operational","service":"ETHANI Pricing API",...}
```

---

## Part 2: Frontend Deployment to Vercel

### Prerequisites

✅ Vercel account: https://vercel.com  
✅ GitHub repository connected  
✅ Next.js 14+ configured

### Step 1: Connect GitHub to Vercel

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Select "Ethani-Labs/ethani-protocol" repository
4. Click "Import"

### Step 2: Configure Project

In **Settings** tab:

```
Framework Preset: Next.js
Root Directory: ./frontend
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

### Step 3: Add Environment Variables

In **Settings > Environment Variables**, add:

```env
NEXT_PUBLIC_API_URL=https://ethani-backend-production.railway.app
NEXT_PUBLIC_API_TIMEOUT=10000

NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

NEXT_PUBLIC_PRICING_CONTRACT=0xc92fd01c122821Eb2C911d16468B20b07E25abC0
NEXT_PUBLIC_REGION_CONTRACT=0x5836cdDEb6AD9c4b10f2aD413Db29ca67e89dFab
NEXT_PUBLIC_CORE_CONTRACT=0x05aF2330b4f04d49e52D1dE5c5c59DeF3C16f3Ad
NEXT_PUBLIC_INCENTIVE_CONTRACT=0xE6C246d7c0cda1c7b21D24F79e0dFEd6Cb7FB3CE

NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_NETWORK=arbitrum_sepolia
```

### Step 4: Deploy

```bash
# Auto-deploy triggers on push to main
git push origin main

# Or manually in Vercel dashboard:
# Go to Deployments > Deploy
```

### Step 5: Get Your Frontend URL

After deploy, Vercel shows:
- Production URL: `https://ethani-protocol.vercel.app`
- Or custom domain if configured

---

## Part 3: Verify Production Deployment

### Backend Health Check

```bash
BACKEND_URL="https://ethani-backend-production.railway.app"

# 1. Health endpoint
curl $BACKEND_URL/health | jq .

# 2. Pricing calculation
curl -X POST $BACKEND_URL/api/v1/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "supply": 100,
    "demand": 150,
    "base_price": 10000,
    "region": "ID"
  }' | jq .

# 3. API documentation
curl $BACKEND_URL/docs
```

### Frontend Health Check

1. Visit https://ethani-protocol.vercel.app
2. ✅ Dashboard loads
3. ✅ Global Prices page works
4. ✅ Stability Rules page displays
5. ✅ Marketplace functional
6. Open DevTools > Network
   - ✅ API calls go to Railway backend
   - ✅ No 404s or CORS errors

---

## Part 4: Auto-Deployment Setup

### Enable GitHub Integration

**For Railway:**
1. Dashboard > Project Settings
2. GitHub > Connect Repo
3. Branch: `main`
4. Auto Deploy: ON

**For Vercel:**
1. Dashboard > Deployments
2. GitHub > Configure GitHub App
3. Auto Deploy: Enabled for `main`

Now every `git push origin main` automatically deploys both! 🎉

---

## Monitoring & Logs

### Railroad Logs

```bash
railway logs
railway logs -f  # Follow logs
```

Or in Dashboard: **Logs** tab

### Vercel Logs

Dashboard > Deployments > Click deployment > Logs

### Check Error Rates

```bash
# Backend errors
railway logs | grep -i error

# Frontend errors (check Vercel logs tab)
```

---

## Troubleshooting

### Backend Failed to Deploy

**Error: "ModuleNotFoundError: No module named 'fastapi'"**
- Check `requirements.txt` is in backend/ directory
- Verify all dependencies listed

**Error: "Port already in use"**
- Railway auto-handles port assignment
- Check SERVER configuration in Railway dashboard

### Frontend Not Connecting to Backend

**Error: "API call failed"**
1. Verify `NEXT_PUBLIC_API_URL` in Vercel environment
2. Check backend `CORS_ORIGINS` includes frontend domain
3. Test: `curl https://backend-url/health` from browser console

**Error: "Contract addresses undefined"**
1. Check all `NEXT_PUBLIC_*_CONTRACT` vars in Vercel
2. Verify addresses are correct (copy from deployment log)

### Both Services Running but API Timeouts

- Check Railway backend logs for errors
- Verify Arbitrum RPC is reachable
- Check network connectivity on Railway

---

## Production Checklist

Before going live:

- [ ] Change `SECRET_KEY` to random value
- [ ] Set `DEBUG=false` (Railway)
- [ ] Set `ENVIRONMENT=production` (Railway)
- [ ] CORS configured for production domain only
- [ ] Both services responding to health checks
- [ ] Test pricing endpoint with various inputs
- [ ] Frontend connects to backend successfully
- [ ] No console errors in browser DevTools
- [ ] API response times < 2 seconds
- [ ] Check Gas for Arbitrum (keep wallet funded)

---

## Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://ethani-protocol.vercel.app |
| Backend | https://ethani-backend-production.railway.app |
| API Docs | https://ethani-backend-production.railway.app/docs |
| Smart Contracts | Arbitrum Sepolia |

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Vercel
3. ✅ Verify both services working
4. 📋 Setup custom domains (optional)
5. 📋 Configure CDN caching (Vercel auto)
6. 📋 Setup monitoring & alerts
7. 📋 Plan mainnet migration (Q2 2026)

---

**Last Updated: February 19, 2026**  
**Status: ✅ Ready for Production**
