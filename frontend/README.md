# ETHANI Frontend

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Blockchain**: Arbitrum Sepolia (5 Smart Contracts - Verified ✅)  
**Last Updated**: 23 Januari 2026

---

A complete, mobile-first web application for ETHANI's transparent, rule-based food price stabilization system. Built with Next.js, TypeScript, and Tailwind CSS. Integrated with 5 verified smart contracts on Arbitrum Sepolia.

## ✅ Live Deployment

**Network**: Arbitrum Sepolia (Chain ID: 421614)  
**RPC**: https://sepolia-rollup.arbitrum.io/rpc  
**Explorer**: https://sepolia.arbiscan.io

**Smart Contracts** (all verified ✅):
- **EthaniPricing** - `0xc92fd01c122821Eb2C911d16468B20b07E25abC0`
- **EthaniRegion** - `0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143`
- **EthaniIncentive** - `0xE6C246d7Ba92c4d35076C91B686d104ad3118172`
- **EthaniCore** - `0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4`
- **PriceOracle** - `0x139a3036052761341212C7d06488C27fb000a167`

## 🎯 Features

### User Roles
- **👨‍🌾 Farmer Dashboard**: Track supply, monitor daily prices, view earnings
- **🚚 Distributor Dashboard**: Manage deliveries, optimize routes, track performance
- **🛒 Buyer Dashboard**: Browse products, add to cart, place orders

### Pages
- **Landing Page** (`/`) - Introduction and value proposition
- **Login** (`/login`) - Authentication with phone/email
- **Register** (`/register`) - 3-step multi-role registration
- **Dashboard** (`/dashboard`) - Role-specific interface
- **Market** (`/market`) - Product catalog with pricing
- **Profile** (`/profile`) - User settings and account management

### Blockchain Integration
- **EthaniPricing Contract** - Transparent price calculations (supply-demand rules)
- **EthaniRegion Contract** - Regional data management
- **EthaniIncentive Contract** - Farmer rewards and points system
- **EthaniCore Contract** - Price history transparency
- **PriceOracle Contract** - Orchestrator with access control

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.3 (strict mode) |
| **Styling** | Tailwind CSS 3.3 |
| **Blockchain** | Solidity 0.8.20 (Arbitrum Sepolia - Verified ✅) |
| **Authentication** | JWT tokens |
| **Database** | FastAPI backend integration |
| **Deployment** | Vercel / Docker |

## 🚀 Quick Start (5 minutes)

### Prerequisites
```bash
- Node.js 18+
- npm 9+
```

### Installation & Run

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Visit **http://localhost:3000**

### Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```env
# Backend API (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Smart Contract Addresses (from contract deployment)
NEXT_PUBLIC_CONTRACT_PRICING=0x...
NEXT_PUBLIC_CONTRACT_REGION=0x...
NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...

# Blockchain Network
NEXT_PUBLIC_NETWORK=mantle-testnet
NEXT_PUBLIC_CHAIN_ID=5001
NEXT_PUBLIC_RPC_URL=https://rpc.testnet.mantle.xyz
```

## 📚 Documentation

### Main Docs
- **[Setup & Integration Guide](./README.md)** - This file (complete setup)
- **[FRONTEND_BUILD_COMPLETE.md](../FRONTEND_BUILD_COMPLETE.md)** - Architecture overview
- **[FRONTEND_INTEGRATION.md](../docs/FRONTEND_INTEGRATION.md)** - Backend & contract integration
- **[FRONTEND_QUICK_START.md](../FRONTEND_QUICK_START.md)** - Quick reference guide

### Contract Docs
- **[SMART_CONTRACTS_DEPLOYED.md](../docs/SMART_CONTRACTS_DEPLOYED.md)** - Deployment guide
- **[SMART_CONTRACTS_QUICK_REF.md](../docs/SMART_CONTRACTS_QUICK_REF.md)** - Contract reference
- **[SMART_CONTRACTS_COMPLETE.md](../docs/SMART_CONTRACTS_COMPLETE.md)** - Full contract documentation

### Backend Docs
- **[BACKEND_SERVICE.md](../docs/BACKEND_SERVICE.md)** - API documentation

## 🔗 Backend Integration

The frontend expects a backend API on `NEXT_PUBLIC_API_URL` with these endpoints:

### Authentication
```
POST   /auth/login              - Login
POST   /auth/register           - Register
GET    /auth/refresh            - Refresh token
POST   /auth/logout             - Logout
```

### User Management
```
GET    /users/profile           - Get profile
POST   /users/profile/update    - Update profile
DELETE /users/profile/delete    - Delete account
```

### Products & Pricing
```
GET    /products                - List products
GET    /products/:id            - Product details
GET    /products/category/:cat  - By category
GET    /pricing/latest          - Current pricing
POST   /pricing/calculate       - Calculate price
GET    /pricing/history         - Price history
```

### Supplies (Farmer)
```
POST   /supplies/add            - Add supply
GET    /supplies/list           - List supplies
DELETE /supplies/:id            - Delete supply
```

### Deliveries (Distributor)
```
GET    /deliveries              - List deliveries
POST   /deliveries/create       - Create delivery
PATCH  /deliveries/:id/status   - Update status
```

### Orders (Buyer)
```
POST   /orders/create           - Create order
GET    /orders                  - List orders
PATCH  /orders/:id/cancel       - Cancel order
```

See **[FRONTEND_INTEGRATION.md](../docs/FRONTEND_INTEGRATION.md)** for detailed API documentation.

## ⛓️ Smart Contracts Integration

### Three Smart Contracts (Mantle Testnet)

#### 1. **EthaniPricing** - Transparent Price Calculation
```typescript
// Calculate price from supply-demand ratio
const result = await contractPricing.calculatePrice(100, 150, 8500);
// Returns: { price: 9180, multiplier: 1.08, reason: 'Shortage' }

// Get ratio analysis
const ratio = await contractPricing.getSupplyDemandRatio(100, 150);
// Returns: { ratio: 1.5, tier: 'KRITIS' }
```

**Pricing Rules** (Deterministic, no AI):
```
Ratio ≥ 1.30: +15% 🔴 Critical Shortage
Ratio ≥ 1.10: +8%  🟠 Shortage
Ratio 0.80-1.10: 0% 🟢 Balanced
Ratio ≤ 0.80: -10% 🔵 Surplus

Hard Limits: ±50% max increase, -30% max decrease
```

#### 2. **EthaniRegion** - Regional Data Management
```typescript
// Get region
const region = await contractRegion.getRegion(1);
// Returns: { id: 1, name: "Jawa Barat", supply: 1000, demand: 1200 }

// Get all regions
const regions = await contractRegion.getAllRegions();

// Update region (admin only)
await contractRegion.updateRegion(1, 1100, 1300);
```

#### 3. **EthaniIncentive** - Farmer Rewards
```typescript
// Get farmer points
const points = await contractIncentive.getFarmerPoints(farmerAddress);
// Returns: { points: 500, level: "Silver" }

// Grant points (admin only)
await contractIncentive.grantPoints(farmerAddress, 100, "Supplied 500kg rice");

// Redeem points
const reward = await contractIncentive.redeemPoints(100);
// Returns: { pointsRedeemed: 100, rewardAmount: 50000 }
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Landing page (380 lines)
│   ├── login/page.tsx          # Login (85 lines)
│   ├── register/page.tsx       # Registration (210 lines)
│   ├── market/page.tsx         # Market (210 lines)
│   ├── profile/page.tsx        # Profile (290 lines)
│   └── dashboard/
│       ├── page.tsx            # Router
│       ├── farmer/page.tsx     # Farmer dashboard (230 lines)
│       ├── distributor/page.tsx # Distributor dashboard (220 lines)
│       └── buyer/page.tsx      # Buyer dashboard (310 lines)
│
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── config.ts               # Config (API, contracts, pricing)
│   └── api.ts                  # API & blockchain client
│
├── .env.example                # Environment template
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
└── README.md                   # This file
```

## 🎨 Design System

### Colors
```
Primary:    #16a34a (Green - Trust, agriculture)
Success:    #15803d (Dark green)
Warning:    #ea580c (Orange)
Danger:     #dc2626 (Red)
Info:       #2563eb (Blue)
```

### Components
- Buttons: 48px height (touch-friendly)
- Cards: Rounded corners, shadow, border accents
- Forms: Large inputs, clear validation
- Tables: Hover states, readable text
- Badges: Status indicators with colors

### Responsive
- Mobile: 1 column (0px+)
- Tablet: 2 columns (640px+)
- Desktop: 3 columns (1024px+)

## 🧪 Testing & Development

### Commands
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Run production server
npm run type-check  # Check TypeScript types
npm run lint        # Run ESLint
```

### Manual Testing Checklist
- [ ] All pages load without errors
- [ ] Forms validate and submit
- [ ] Navigation works on all pages
- [ ] Responsive on mobile/tablet/desktop
- [ ] Login/register flows work
- [ ] Dashboards display correctly for all roles
- [ ] Shopping cart functions
- [ ] Contract addresses display in config

### Mobile Testing
```bash
# Find local IP
ipconfig getifaddr en0

# Visit on phone
http://YOUR_IP:3000
```

## 🚀 Production Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables (Production)
Set on your hosting platform:
```
NEXT_PUBLIC_API_URL=https://api.ethani.io
NEXT_PUBLIC_CONTRACT_PRICING=0x...
NEXT_PUBLIC_CONTRACT_REGION=0x...
NEXT_PUBLIC_CONTRACT_INCENTIVE=0x...
```

## ✅ Pre-Launch Checklist

- [ ] Backend API running (`NEXT_PUBLIC_API_URL` responds)
- [ ] Smart contracts deployed to Mantle Testnet
- [ ] Contract addresses in `.env.local`
- [ ] All environment variables configured
- [ ] Frontend builds: `npm run build` ✓
- [ ] All pages accessible at `/`
- [ ] Authentication flows tested
- [ ] All role dashboards working
- [ ] API calls to backend successful
- [ ] Smart contract calls working
- [ ] Mobile responsive design verified
- [ ] TypeScript strict mode passing
- [ ] No console errors
- [ ] Accessibility features working

## 🐛 Troubleshooting

### Build Errors
```bash
rm -rf .next && npm install
npm run type-check
```

### API Connection Issues
- Backend running? `curl http://localhost:8000/health`
- Correct API_URL in `.env.local`?
- Check browser console for errors

### Contract Issues
- Contracts deployed? Check explorer: https://explorer.testnet.mantle.xyz
- Correct addresses in `.env.local`?
- Backend can access contracts?

### Mobile Issues
- Test on real device
- Check responsive breakpoints
- Verify touch targets (48px minimum)

## 📞 Support

For issues:
1. Check [FRONTEND_INTEGRATION.md](../docs/FRONTEND_INTEGRATION.md)
2. Review console errors
3. Verify `.env.local` configuration
4. Check backend and contracts are running
5. Create GitHub issue with error details

## 🔗 Useful Links

- **ETHANI GitHub**: [Link to repository]
- **Mantle Testnet Explorer**: https://explorer.testnet.mantle.xyz
- **Mantle RPC**: https://rpc.testnet.mantle.xyz
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Solidity Docs**: https://docs.soliditylang.org

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   ├── login/               # Login page
│   ├── register/            # Registration pages
│   ├── dashboard/           # Dashboard route
│   │   ├── page.tsx         # Route to correct role dashboard
│   │   ├── farmer/          # Farmer dashboard
│   │   ├── distributor/     # Distributor dashboard
│   │   └── buyer/           # Buyer dashboard
│   ├── market/              # Market/products page
│   └── profile/             # User profile page
├── lib/
│   ├── types.ts             # TypeScript types
│   └── api.ts               # API client functions
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Key Pages

### Landing Page (`/`)
- Hero section with value prop
- Feature cards
- How it works section
- Pricing tier explanation
- Role-specific call-to-action buttons
- Footer

### Registration (`/register`)
- Multi-step form (3 steps)
- Step 1: Phone + Name
- Step 2: NIK + Location
- Step 3: Role selection + Password
- Mobile-optimized form fields

### Login (`/login`)
- Phone/email authentication
- Password input
- Remember me option
- Link to registration

### Farmer Dashboard (`/dashboard/farmer`)
- Today's price card
- Current supply card
- Earnings card
- Add new supply modal
- Sales history table

### Distributor Dashboard (`/dashboard/distributor`)
- Active deliveries count
- Completed deliveries count
- Total weight transported
- Efficiency bonus
- Delivery list with status
- Actions: Start, Mark Complete

### Buyer Dashboard (`/dashboard/buyer`)
- Browse products with stock status
- Product filtering by category
- Add to cart functionality
- Sticky cart sidebar
- Order total
- Responsive product grid

### Market Page (`/market`)
- Full product catalog
- Category filtering
- Price display with status
- Explanation of pricing system
- Product details card

### Profile Page (`/profile`)
- User avatar
- Editable user information
- Account security settings
- Danger zone for account deletion

## Design System

### Colors
- **Primary Green**: `#16a34a` - Trust, nature, growth
- **Status Colors**:
  - Red `#dc2626`: Critical/Shortage
  - Orange `#ea580c`: Moderate shortage
  - Green `#16a34a`: Balanced
  - Blue `#2563eb`: Surplus/Low price

### Typography
- **Headings**: Bold, 32-48px for main titles
- **Body**: 16px on mobile, readable and clear
- **Buttons**: Large (48px minimum height), obvious tap targets

### Spacing
- Mobile first: 16px base unit
- Generous padding for older users
- Clear visual hierarchy

### Components
- Large buttons (48x48px minimum touch targets)
- High contrast text
- Simple color scheme
- Emoji for visual recognition
- Border indicators for important sections

## Mobile Optimization

- **Viewport**: Responsive meta tags set
- **Touch targets**: 48x48px minimum
- **Font size**: 16px+ for readability
- **Spacing**: Generous for large fingers
- **Forms**: One column, large inputs
- **Buttons**: Full width on mobile, large and obvious

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## API Integration

The frontend expects a backend API at the configured URL with these endpoints:

### Auth
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user

### Users
- `GET /users/{id}` - Get user profile
- `PATCH /users/{id}` - Update user

### Products
- `GET /products` - Get all products
- `GET /products?category={category}` - Filter by category

### Supplies (Farmer)
- `POST /supplies` - Add new supply
- `GET /supplies?farmerId={id}` - Get farmer's supplies

### Deliveries (Distributor)
- `GET /deliveries?status=pending` - Get available deliveries
- `PATCH /deliveries/{id}` - Update delivery status

### Orders (Buyer)
- `POST /orders` - Create order
- `GET /orders?buyerId={id}` - Get buyer's orders

### Pricing
- `GET /pricing/latest` - Get current pricing data
- `POST /pricing/calculate` - Calculate price for given supply/demand

## Type Definitions

See `lib/types.ts` for TypeScript interfaces:
- `User`, `UserRole`
- `Product`, `Supply`
- `Delivery`, `Order`, `CartItem`
- `PricingTier`, `PRICING_TIERS`

## Testing

Currently no tests set up. To add:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## Performance Tips

- Images: Use webp format with fallbacks
- Code splitting: Automatic with Next.js App Router
- Caching: Implement revalidation in production
- Monitoring: Use Next.js Analytics

## Accessibility

- Semantic HTML (`<button>`, `<label>`, `<form>`)
- ARIA labels where needed
- Color not only indicator (use text/icon + color)
- Keyboard navigation support
- Large touch targets (48x48px)
- Clear focus states

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (latest)

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment for Production

```env
NEXT_PUBLIC_API_URL=https://api.ethani.example.com
```

## Contributing

1. Use TypeScript for all new code
2. Follow naming conventions
3. Keep components small and focused
4. Mobile-first responsive design
5. Test on actual mobile devices

## License

MIT - See LICENSE file

## Support

For issues or questions:
- Check documentation in `docs/` folder
- Review smart contract docs for blockchain interaction
- Contact team lead

---

**Built with ❤️ for ETHANI**
