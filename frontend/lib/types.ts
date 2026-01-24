/**
 * ETHANI Frontend Type Definitions
 * Global, role-aware, locale-aware
 */

// ==========================
// USER & AUTH TYPES
// ==========================

export type UserRole =
  | 'farmer'
  | 'livestock_farmer'
  | 'distributor'
  | 'buyer_restaurant'
  | 'buyer_factory'
  | 'buyer_market'
  | 'buyer_msme'
  | 'circular_economy'
  | 'learner';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  country: string;
  region: string;
  role: UserRole;
  roles: UserRole[]; // multiple roles supported
  locale: string; // e.g., "en-US", "id-ID", "es-ES"
  currency: string; // e.g., "USD", "IDR", "EUR"
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ==========================
// PRODUCT & PRICE TYPES
// ==========================

export type PriceTier = 'critical_shortage' | 'shortage' | 'balanced' | 'surplus';

export interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  basePrice: number; // in backend-defined currency
  currentPrice: number;
  tier: PriceTier;
  lastSupply: number;
  lastDemand: number;
  lastUpdatedAt: string;
}

export interface PriceInfo {
  productId: number;
  basePrice: number;
  currentPrice: number;
  tier: PriceTier;
  multiplier: number;
  reason: string; // human-readable explanation from backend
  reasonCode: string; // e.g., "SHORTAGE", "BALANCED"
  updatedAt: string;
}

// ==========================
// MARKET & SUPPLY TYPES
// ==========================

export interface MarketListing {
  id: number;
  productId: number;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  region: string;
  location: string;
  description: string;
  status: 'available' | 'partial' | 'sold_out';
  createdAt: string;
  expiresAt: string;
}

export interface Order {
  id: number;
  buyerId: string;
  farmerId: string;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled' | 'disputed';
  createdAt: string;
  confirmedAt?: string;
  fulfilledAt?: string;
  deliveryInfo: string;
}

export interface Supply {
  id: number;
  farmerId: string;
  farmerName: string;
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalSupply: number;
  category: string;
  createdAt: string;
}

// ==========================
// CIRCULAR ECONOMY TYPES
// ==========================

export interface WasteRecord {
  id: number;
  farmerId: string;
  wasteType: string;
  quantity: number;
  unit: string;
  tokensEarned: number;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface CircularEconomyStats {
  totalWasteProcessed: number;
  totalTokensEarned: number;
  currentBalance: number;
  conversions: Record<string, number>; // wasteType -> tokensPerUnit
}

// ==========================
// LOCALE & BACKEND TYPES
// ==========================

export interface LocaleConfig {
  locale: string;
  language: string;
  currency: string;
  currencySymbol: string;
  decimalPlaces: number;
  numberFormat: 'en-US' | 'de-DE' | 'fr-FR'; // for Intl formatting
}

export interface Explanation {
  code: string;
  title: string; // translated
  description: string; // translated
  region: string;
  timestamp: string;
}

export interface BackendResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  explanation?: string; // human-readable from backend
  locale?: LocaleConfig;
}

// ==========================
// ERROR & STATE TYPES
// ==========================

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface LoadingState {
  isLoading: boolean;
  error: APIError | null;
  isEmpty: boolean;
}

// ==========================
// DASHBOARD-SPECIFIC TYPES
// ==========================

export interface FarmerDashboard {
  profile: User;
  recentProductions: Supply[];
  activeListings: MarketListing[];
  totalProduction: {
    quantity: number;
    unit: string;
    value: number;
  };
  priceHistory: Array<{
    productId: number;
    tier: PriceTier;
    date: string;
  }>;
}

export interface BuyerDashboard {
  profile: User;
  availableProducts: MarketListing[];
  recentOrders: Order[];
  totalSpent: number;
  savedLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

export interface DistributorDashboard {
  profile: User;
  activeDeliveries: Order[];
  pastDeliveries: Order[];
  totalVolume: number;
  coverage: {
    regions: string[];
    routes: number;
  };
}

// ==========================
// UI COMPONENT PROPS TYPES
// ==========================

export interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface CartOrder {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
}

export interface PricingTier {
  tier: 'CRITICAL_SHORTAGE' | 'SHORTAGE' | 'BALANCED' | 'SURPLUS';
  ratio: number;
  multiplier: number;
  change: string;
  description: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: 'CRITICAL_SHORTAGE',
    ratio: 1.3,
    multiplier: 1.15,
    change: '+15%',
    description: 'Stok sangat sedikit - harga naik untuk dorong produksi',
  },
  {
    tier: 'SHORTAGE',
    ratio: 1.1,
    multiplier: 1.08,
    change: '+8%',
    description: 'Stok kurang - harga naik sedikit',
  },
  {
    tier: 'BALANCED',
    ratio: 1.0,
    multiplier: 1.0,
    change: '0%',
    description: 'Stok seimbang - harga normal',
  },
  {
    tier: 'SURPLUS',
    ratio: 0.8,
    multiplier: 0.9,
    change: '-10%',
    description: 'Stok berlimpah - harga turun untuk dorong pembelian',
  },
];
