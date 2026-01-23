# ETHANI Frontend - Complete Documentation

## Overview

The ETHANI frontend is a mobile-first web application built with Next.js and TypeScript. It provides an intuitive interface for farmers, distributors, and buyers to interact with the food price stabilization system.

**Design Principle**: "Simplicity over beauty. Clarity for 40-60 year old farmers."

---

## Architecture

### Page Hierarchy

```
/
├── /login                        # Authentication
├── /register                     # 3-step registration
├── /dashboard                    # Route to correct role
│   ├── /farmer                   # Farmer dashboard
│   ├── /distributor              # Distributor dashboard
│   └── /buyer                    # Buyer dashboard
├── /market                       # Product catalog
└── /profile                      # User settings
```

### Data Flow

```
User Input → Components → API Client (lib/api.ts)
                          ↓
                      Backend API
                          ↓
                    State Update → Re-render
```

---

## Page Details

### 1. Landing Page (`/`)

**Purpose**: Introduce ETHANI and encourage sign-up

**Sections**:
- Header with Login/Register buttons
- Hero section (main heading + CTA)
- 3 feature cards (Harga Stabil, Transparan, Untuk Semua)
- How it works (4-step process)
- Pricing tiers explanation
- 3 role cards with CTA buttons
- Footer

**Key Features**:
- Uses gradients for visual appeal
- Large, clickable CTA buttons
- Emoji for visual recognition
- Mobile-friendly grid layout

**Color Scheme**:
- Green (#16a34a) for primary actions
- Blue, orange for supplementary info
- White backgrounds for clarity

---

### 2. Login Page (`/login`)

**Purpose**: Authenticate existing users

**Fields**:
- Phone number or email
- Password
- Submit button

**Flow**:
1. User enters credentials
2. Submit to API: `POST /auth/login`
3. Store token in localStorage
4. Redirect to dashboard

**Error Handling**:
- Display error message if login fails
- Client-side validation

**Mobile Optimization**:
- Large input fields (48px+ height)
- Numeric keyboard for phone input
- One column layout

---

### 3. Register Page (`/register`)

**Purpose**: Onboard new users

**Flow**: 3-step multi-step form

**Step 1**: Basic Info
- Phone number
- Full name
- Validation: Both fields required

**Step 2**: Identity & Location
- NIK (16-digit ID)
- Location (City/Province)
- Input masking for NIK (numbers only)

**Step 3**: Role & Password
- Radio buttons for role selection (Farmer/Distributor/Buyer)
- Password input
- Confirm password input
- Validation: Passwords must match

**Error States**:
- Missing required fields
- Password mismatch
- Invalid NIK format

**Accessibility**:
- Each radio button is a full clickable label
- Clear visual feedback for selected role
- Progress indicator (Step 1 of 3)

---

### 4. Farmer Dashboard (`/dashboard/farmer`)

**Purpose**: Help farmers track prices, supplies, and sales

**Components**:

**Header**:
- ETHANI logo
- User role badge (👨‍🌾 Petani)
- Profile link
- Logout button

**Welcome Card**: Gradient banner with greeting

**Key Metrics** (3 cards):
1. Today's Price
   - Shows current stable price
   - Price per unit (kg, ikat, etc.)
   - Pricing tier (SEIMBANG, KRITIS, BANYAK)
   - Supply/demand ratio

2. Your Supply
   - Total inventory
   - Unit type
   - Button to add new supply

3. Weekly Earnings
   - Total revenue this week
   - Comparison to previous week
   - Show trend (up/down arrow)

**Add Supply Modal**:
- Triggered by "Tambah Panen" button
- Dropdown for product selection (Beras, Jagung, Sayuran, Singkong)
- Number input for quantity (kg)
- Submit/Cancel buttons

**Sales History Table**:
- Columns: Date, Product, Quantity, Price, Total
- Sortable by date (newest first)
- Shows transaction history

---

### 5. Distributor Dashboard (`/dashboard/distributor`)

**Purpose**: Manage deliveries and optimize routes

**Components**:

**Key Metrics** (4 cards):
1. Pengiriman Hari Ini - Count of today's deliveries
2. Terkirim - Total delivered this month
3. Total Berat - Total tonnage this month
4. Bonus Efisiensi - Incentive earned for route optimization

**Delivery List**:
- Cards for each delivery showing:
  - Product name and quantity
  - From (farmer location)
  - To (buyer location)
  - Status badge (Pending/In-Transit/Delivered)
  - ETA (estimated time of arrival)
  - Action buttons based on status:
    - Pending: "Mulai Pengiriman", "Tolak"
    - In-Transit: "Tandai Terkirim"
    - Delivered: "Lihat Detail"

**Status Colors**:
- Green: Delivered (✓)
- Blue: In Transit (🚚)
- Orange: Pending (⏳)

**Route Optimization Tip**:
- Info box explaining efficiency bonus
- Encourages combining deliveries

---

### 6. Buyer Dashboard (`/dashboard/buyer`)

**Purpose**: Let buyers browse and purchase food

**Layout**: Two-column (products + sticky cart)

**Left Column**:

**Filters**:
- Horizontal scrollable filter buttons
- Categories: Semua, Beras, Jagung, Sayuran

**Product Grid**:
- 2 columns on mobile, 2 on tablet
- Each product card shows:
  - Product name
  - Farmer name
  - Status badge (TERBATAS/Normal/Murah)
  - Stock level with progress bar
  - Price per unit
  - Price color: Orange (primary action)
  - + button to add to cart

**Right Column** (Sticky on desktop):

**Shopping Cart**:
- Item list (scrollable if long)
- Each item shows:
  - Product name
  - Quantity × Price
  - Total for item
  - Remove (✕) button
- Total price at bottom
- "Pesan Sekarang" button (primary CTA)
- "Kosongkan" button (clear cart)
- Empty state message if no items

**Mobile**: Cart becomes full-width below products

---

### 7. Market Page (`/market`)

**Purpose**: Browse all available food products

**Sections**:

**Header**:
- Page title
- Subtitle explaining purpose

**Info Card** (blue):
- How prices are determined
- Explanation of supply-demand logic

**Category Filter**:
- Horizontal scroll buttons
- All categories selectable

**Product Grid**:
- 3 columns on desktop, 2 on mobile
- Each product card shows:
  - Emoji icon
  - Product name
  - Category
  - Current price (large, bold)
  - Price per unit
  - Status with color coding
  - Description of why price is at this level
  - "Pesan" and "Detail" buttons

**Responsive Design**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

### 8. Profile Page (`/profile`)

**Purpose**: Manage user account information

**Sections**:

**Profile Header**:
- Large circular avatar with emoji (role-based)
- Green gradient background banner

**Edit Mode Toggle**:
- "Sunting" button (default)
- Changes to "Simpan" and "Batal" when editing

**Editable Fields**:
- Nama Lengkap (Full Name)
- Nomor Telepon (Phone)
- Email
- Lokasi (Location)
- Peran (Role) - read-only with note to contact support
- NIK - read-only with note (verification initial)

**Account Settings**:
- Ganti Kata Sandi (Change Password)
- Keamanan & Privasi (Security & Privacy)
- Notifikasi (Notifications)
- Each is clickable to open settings

**Danger Zone** (red section):
- Hapus Akun (Delete Account) button
- Warning: "Irreversible"
- Explains all data will be deleted

---

## Component Design Patterns

### Buttons

**Primary Button** (Green):
```tsx
<button className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700 transition">
  Tindakan Utama
</button>
```

**Secondary Button** (Border):
```tsx
<button className="border-2 border-green-600 text-green-600 py-3 px-6 rounded-lg font-bold hover:bg-green-50">
  Tindakan Alternatif
</button>
```

**Danger Button** (Red):
```tsx
<button className="border-2 border-red-600 text-red-600 py-3 px-6 rounded-lg font-bold hover:bg-red-50">
  Tindakan Berbahaya
</button>
```

### Cards

**Info Card**:
```tsx
<div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-600">
  <h3>Judul</h3>
  <p>Konten</p>
</div>
```

### Status Badges

```tsx
<span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(status)}`}>
  {getStatusLabel(status)}
</span>
```

### Forms

**Input Field**:
```tsx
<input
  type="text"
  placeholder="Placeholder text"
  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
/>
```

**Select Dropdown**:
```tsx
<select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500">
  <option>Pilih opsi</option>
</select>
```

### Tables

**Row Styling**:
- Hover effect: `hover:bg-gray-50`
- Border bottom: Separator between rows
- Alternating backgrounds optional

---

## State Management

Currently using React hooks (`useState`). For larger app, consider:
- Context API for user authentication
- TanStack Query for server state
- Zustand for local state

### Example: Cart State (Buyer)

```typescript
const [cart, setCart] = useState<CartItem[]>([]);

const addToCart = (product: Product) => {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    setCart(cart.map(item =>
      item.id === product.id ? { ...item, qty: item.qty + 1 } : item
    ));
  } else {
    setCart([...cart, { id: product.id, name: product.name, ... }]);
  }
};
```

---

## Responsive Design Breakpoints

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

Tailwind classes:
- `md:` = Tablet and up (640px+)
- `lg:` = Desktop (1024px+)

Example:
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## Mobile-First Design Checklist

- [ ] Touch targets: 48x48px minimum
- [ ] Font size: 16px+ (avoid zoom)
- [ ] Spacing: 16px base unit
- [ ] Max width: 100% on mobile
- [ ] Single column layout
- [ ] Large buttons
- [ ] Test on actual mobile devices
- [ ] Test with older age group (40-60)
- [ ] Emoji for icon recognition
- [ ] High contrast text
- [ ] Simple color palette

---

## Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<label>`, `<form>`)
- [ ] ARIA labels for icons/emojis
- [ ] Color + text (not color alone)
- [ ] Focus states visible
- [ ] Keyboard navigation
- [ ] Form labels associated with inputs
- [ ] Alt text for images
- [ ] Language attribute (`lang="id"`)

---

## Performance Optimizations

### Code Splitting
- Automatic with Next.js App Router
- Each page is a separate bundle

### Image Optimization
- Use `next/image` component (not implemented yet)
- Support webp with fallbacks

### Caching
- Cache product catalog (revalidate every hour)
- Don't cache user-specific data
- Use SWR for real-time updates

### Monitoring
- Use Next.js Analytics
- Track key pages: landing, register, orders

---

## API Integration Guide

All API calls go through `lib/api.ts`. When adding new features:

1. Add function to `lib/api.ts`:
```typescript
export async function newFeature(param: string, token: string) {
  try {
    const response = await fetch(`${API_BASE}/endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ param }),
    });
    if (!response.ok) throw new Error('Error message');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

2. Use in component:
```typescript
const handleClick = async () => {
  try {
    const result = await newFeature('value', token);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

3. Add TypeScript types to `lib/types.ts`

---

## Internationalization (i18n)

Currently hardcoded in Indonesian. To add English support:

1. Install `next-intl`
2. Create `messages/id.json` and `messages/en.json`
3. Wrap app with provider
4. Use `useTranslations()` hook

---

## Testing Strategy

### Unit Tests
- Component rendering
- Event handlers
- Utility functions

### Integration Tests
- Form submission flows
- API integration
- Navigation

### E2E Tests
- Complete user journeys (register → order)
- Mobile device testing

### Manual Testing
- Always test on real mobile devices
- Test with actual farmers/users
- Accessibility testing

---

## Deployment Checklist

- [ ] Environment variables set
- [ ] API URL correct for environment
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] Mobile testing completed
- [ ] Login/register flow works
- [ ] All pages load
- [ ] Images load correctly
- [ ] Forms submit without errors
- [ ] Delete sensitive data from code

---

## Common Tasks

### Add a New Page
1. Create directory: `app/newpage/`
2. Create `page.tsx` file
3. Add `'use client'` if interactive
4. Update navigation links

### Add a New Form Field
1. Add state: `const [value, setValue] = useState('')`
2. Add input element
3. Add onChange handler
4. Add validation logic
5. Include in form submission

### Modify Button Styling
- Primary: `bg-green-600 text-white`
- Secondary: `border-2 border-green-600 text-green-600`
- Danger: `bg-red-600 text-white`

### Update API Endpoint
1. Modify `lib/api.ts`
2. Update TypeScript types in `lib/types.ts`
3. Use new function in component

---

## Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript: `npm run type-check`

### Layout Issues
- Check responsive classes (md:, lg:)
- Use browser DevTools to debug CSS
- Test on actual devices

### API Errors
- Check backend is running
- Verify API URL in `.env.local`
- Check network tab in DevTools
- Ensure token is passed for authenticated routes

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Hooks Guide](https://react.dev/reference/react)
- [Web Accessibility](https://www.w3.org/WAI)

---

## Notes for Developers

- Keep components simple and focused
- Prioritize clarity over cleverness
- Test with actual users (especially older farmers)
- Mobile first approach
- Avoid jargon in UI text
- Use emoji for visual recognition
- Large buttons and clear CTAs
- Simple color scheme (trust-based)

---

**Built for ETHANI with 💚**

Last Updated: January 2026
