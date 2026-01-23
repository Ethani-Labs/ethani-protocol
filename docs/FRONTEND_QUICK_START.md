# ETHANI Frontend - Quick Setup Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 🎨 Preview All Pages

| Page | URL | Purpose |
|------|-----|---------|
| Landing | http://localhost:3000 | Introduction & CTAs |
| Login | http://localhost:3000/login | User authentication |
| Register | http://localhost:3000/register | 3-step signup |
| Farmer Dashboard | http://localhost:3000/dashboard/farmer | Farmer analytics |
| Distributor Dashboard | http://localhost:3000/dashboard/distributor | Delivery management |
| Buyer Dashboard | http://localhost:3000/dashboard/buyer | Shopping interface |
| Market | http://localhost:3000/market | Product catalog |
| Profile | http://localhost:3000/profile | Account settings |

---

## 📱 Mobile Testing

### On Your Phone
1. Find your computer's IP: `ipconfig getifaddr en0` (macOS)
2. Visit: `http://YOUR_IP:3000`
3. Test on actual mobile device

### Browser DevTools
1. Open DevTools (F12 or Cmd+Option+I)
2. Click device toggle (Ctrl+Shift+M)
3. Select iPhone or Android

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run type-check  # Check TypeScript
```

### Key Files to Edit

- **Landing Page**: `app/page.tsx`
- **Navigation**: Update links in all page headers
- **Colors**: `tailwind.config.ts`
- **Types**: `lib/types.ts`
- **API**: `lib/api.ts`

---

## 🔗 Connect to Backend

### Environment Variables

Create `frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Test API Connection

The app will make API calls to:
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /products` - Get products
- And many more...

---

## 📝 Code Examples

### Add a New Page

Create `app/newpage/page.tsx`:

```typescript
'use client';

export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### Add a Form Input

```typescript
const [value, setValue] = useState('');

return (
  <input
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Enter text"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
  />
);
```

### Call API

```typescript
import { getProducts } from '@/lib/api';

const [products, setProducts] = useState([]);

useEffect(() => {
  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };
  load();
}, []);
```

---

## 🎯 Design Principles

1. **Simple**: No fancy effects, clear purpose
2. **Mobile-First**: Optimize for small screens first
3. **Accessible**: Works for 40-60 year old farmers
4. **Trustworthy**: Neutral colors, professional look
5. **Clear**: Large buttons, readable text

### Colors to Use
- Green `#16a34a` - Primary action, growth
- Blue `#2563eb` - Secondary info
- Red `#dc2626` - Danger/error
- Gray `#666` - Secondary text

### Button Sizes
- Height: 48px minimum (tap target)
- Padding: 16px horizontal
- Text: 16px, bold

---

## ✅ Checklist Before Launch

- [ ] All pages load without errors
- [ ] Mobile responsive (test on phone)
- [ ] Form validation works
- [ ] API calls succeed (with working backend)
- [ ] Login/Register flow works
- [ ] Navigation works on all pages
- [ ] No console errors
- [ ] TypeScript type-checks pass
- [ ] Tested with older users (readability check)
- [ ] Images/emojis display correctly

---

## 🐛 Troubleshooting

### Page won't load
```bash
rm -rf .next
npm run dev
```

### TypeScript errors
```bash
npm run type-check
# Fix errors in code
```

### API not connecting
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check network tab in DevTools

### Styling issues
- Clear Tailwind cache: `npm run dev` again
- Check class names spelled correctly
- Use browser DevTools to inspect

---

## 📚 Learn More

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Basics](https://www.typescriptlang.org/docs/handbook)
- [React Hooks](https://react.dev/reference/react)

---

## 📞 Getting Help

1. Check `docs/FRONTEND_COMPLETE.md` for detailed docs
2. Review existing code in similar pages
3. Check console for error messages
4. Test in multiple browsers/devices

---

## 🎉 Next Steps

1. **Setup**: `npm install && npm run dev`
2. **Explore**: Visit all pages at http://localhost:3000
3. **Connect**: Setup backend API connection
4. **Customize**: Modify branding, colors, text
5. **Deploy**: Build and deploy to production

---

**Happy coding! 🌾**

For questions or issues, check the detailed documentation in `docs/FRONTEND_COMPLETE.md`
