'use client';

// HACKATHON DEMO MODE: Full dashboard with mock data + LEVEL 1 PSEUDO-REALTIME ENGINE
// No authentication/role required for demo purposes
// NO smart contracts, NO backend API calls, NO wallet dependency - Frontend-only mock data

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { usePriceSimulation } from '@/hooks/usePriceSimulation';
import { getStatusColor, getStatusEmoji, getStatusLabel } from '@/lib/price-data';

// ============================================================================
// CUSTOM CSS ANIMATIONS - Inline styles for live dashboard feel
// ============================================================================
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes count-up {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes price-flash {
    0% { background-color: transparent; }
    50% { background-color: rgba(34, 197, 94, 0.2); }
    100% { background-color: transparent; }
  }

  @keyframes price-flash-down {
    0% { background-color: transparent; }
    50% { background-color: rgba(239, 68, 68, 0.2); }
    100% { background-color: transparent; }
  }

  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes wave {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }

  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .animate-count-up { animation: count-up 0.5s ease-out; }
  .animate-price-flash { animation: price-flash 1s ease-out; }
  .animate-price-flash-down { animation: price-flash-down 1s ease-out; }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }
  .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 8s linear infinite; }
  .animate-wave { animation: wave 1s ease-in-out infinite; }

  .card-hover-effect {
    transition: all 0.3s ease;
  }
  .card-hover-effect:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .live-indicator {
    position: relative;
  }
  .live-indicator::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: inherit;
    animation: pulse-glow 1.5s ease-out infinite;
  }
`;

// ============================================================================
// LEVEL 1 PSEUDO-REALTIME ENGINE - DEMO MODE ONLY
// Mock data structure with basePrice and lastUpdated for dynamic updates
// ============================================================================

interface FoodPrice {
  id: string;
  country: string;
  flag: string;
  region: string;
  product: string;
  basePrice: number;
  currentPrice: number;
  previousPrice: number;
  change: number;
  status: 'up' | 'down' | 'stable';
  lastUpdated: number; // timestamp in ms
  // NEW: Geo-economic context
  staple: boolean; // Is this a primary staple food for this country?
  supplyStatus: 'Abundant' | 'Stable' | 'Tight Supply' | 'Import Dependent' | 'Climate Risk';
  reason: string; // Why this price/status?
}

// Base mock dataset with initial prices
// REALISTIC & GEO-AWARE: Prices reflect local currency reality, climate, and staple foods
const INITIAL_FOOD_PRICES: FoodPrice[] = [
  // ASIA - High population, rice/wheat dependent
  { id: 'idn-rice', country: 'Indonesia', flag: '🇮🇩', region: 'Asia', product: 'Rice', basePrice: 0.68, currentPrice: 0.68, previousPrice: 0.68, change: 2.3, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'Local production surplus, strong domestic output' },
  { id: 'idn-oil', country: 'Indonesia', flag: '🇮🇩', region: 'Asia', product: 'Cooking Oil', basePrice: 1.45, currentPrice: 1.45, previousPrice: 1.45, change: -1.2, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Tight Supply', reason: 'Global palm oil competition affecting local supply' },
  { id: 'chn-rice', country: 'China', flag: '🇨🇳', region: 'Asia', product: 'Rice', basePrice: 0.72, currentPrice: 0.72, previousPrice: 0.72, change: 1.8, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'Self-sufficient production in southern regions' },
  { id: 'chn-wheat', country: 'China', flag: '🇨🇳', region: 'Asia', product: 'Wheat', basePrice: 0.42, currentPrice: 0.42, previousPrice: 0.42, change: 0.5, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'Northern staple, consistent domestic harvest' },
  { id: 'tha-rice', country: 'Thailand', flag: '🇹🇭', region: 'Asia', product: 'Rice', basePrice: 0.58, currentPrice: 0.58, previousPrice: 0.58, change: -0.8, status: 'down', lastUpdated: Date.now(), staple: true, supplyStatus: 'Abundant', reason: 'Major global exporter, abundant local supply' },
  { id: 'ind-rice', country: 'India', flag: '🇮🇳', region: 'Asia', product: 'Rice', basePrice: 0.52, currentPrice: 0.52, previousPrice: 0.52, change: 3.1, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'World\'s largest producer, monsoon-dependent seasonal variation' },
  { id: 'ind-wheat', country: 'India', flag: '🇮🇳', region: 'Asia', product: 'Wheat', basePrice: 0.38, currentPrice: 0.38, previousPrice: 0.38, change: 1.5, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'Northern staple crop, reliable harvest cycles' },

  // OCEANIA - Temperate climate, wheat-focused
  { id: 'aus-wheat', country: 'Australia', flag: '🇦🇺', region: 'Oceania', product: 'Wheat', basePrice: 0.85, currentPrice: 0.85, previousPrice: 0.85, change: -2.1, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Abundant', reason: 'Major global exporter with seasonal abundance' },
  { id: 'aus-bread', country: 'Australia', flag: '🇦🇺', region: 'Oceania', product: 'Bread', basePrice: 2.40, currentPrice: 2.40, previousPrice: 2.40, change: 0.0, status: 'stable', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Processed good, stable local demand/supply' },

  // MIDDLE EAST - Import-dependent, arid climate
  { id: 'sau-wheat', country: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', product: 'Wheat', basePrice: 0.75, currentPrice: 0.75, previousPrice: 0.75, change: 1.2, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Import Dependent', reason: 'Arid climate, relies on global grain imports' },
  { id: 'uae-rice', country: 'UAE', flag: '🇦🇪', region: 'Middle East', product: 'Rice', basePrice: 0.95, currentPrice: 0.95, previousPrice: 0.95, change: 0.0, status: 'stable', lastUpdated: Date.now(), staple: false, supplyStatus: 'Import Dependent', reason: 'Desert region, no local rice production, imports from Asia' },
  { id: 'egy-bread', country: 'Egypt', flag: '🇪🇬', region: 'Middle East', product: 'Bread', basePrice: 0.35, currentPrice: 0.35, previousPrice: 0.35, change: 4.5, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Tight Supply', reason: 'Bread critical to food security, subsidy-dependent supply' },
  { id: 'egy-wheat', country: 'Egypt', flag: '🇪🇬', region: 'Middle East', product: 'Wheat', basePrice: 0.48, currentPrice: 0.48, previousPrice: 0.48, change: 3.2, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Import Dependent', reason: 'Nile valley limited, heavily import-reliant for wheat' },

  // AFRICA - Diverse climates, drought risk, staple diversity
  { id: 'nga-corn', country: 'Nigeria', flag: '🇳🇬', region: 'Africa', product: 'Corn', basePrice: 0.62, currentPrice: 0.62, previousPrice: 0.62, change: 2.8, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'West African staple, local production covers demand' },
  { id: 'nga-rice', country: 'Nigeria', flag: '🇳🇬', region: 'Africa', product: 'Rice', basePrice: 0.88, currentPrice: 0.88, previousPrice: 0.88, change: 1.5, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Tight Supply', reason: 'Growing demand, partial import dependency for rice' },
  { id: 'ken-corn', country: 'Kenya', flag: '🇰🇪', region: 'Africa', product: 'Corn', basePrice: 0.58, currentPrice: 0.58, previousPrice: 0.58, change: -1.5, status: 'down', lastUpdated: Date.now(), staple: true, supplyStatus: 'Climate Risk', reason: 'East African staple, vulnerable to seasonal droughts' },
  { id: 'ken-wheat', country: 'Kenya', flag: '🇰🇪', region: 'Africa', product: 'Wheat', basePrice: 0.65, currentPrice: 0.65, previousPrice: 0.65, change: 0.8, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Import Dependent', reason: 'Highland crop, mostly imported for urban consumption' },

  // EUROPE - Temperate, stable production, processed goods
  { id: 'deu-wheat', country: 'Germany', flag: '🇩🇪', region: 'Europe', product: 'Wheat', basePrice: 0.68, currentPrice: 0.68, previousPrice: 0.68, change: -0.5, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'EU self-sufficient in cereals, stable harvest cycles' },
  { id: 'deu-bread', country: 'Germany', flag: '🇩🇪', region: 'Europe', product: 'Bread', basePrice: 3.20, currentPrice: 3.20, previousPrice: 3.20, change: 0.0, status: 'stable', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Premium processed good, strong local bakery tradition' },
  { id: 'fra-wheat', country: 'France', flag: '🇫🇷', region: 'Europe', product: 'Wheat', basePrice: 0.72, currentPrice: 0.72, previousPrice: 0.72, change: 0.3, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'EU\'s largest wheat producer, consistent yields' },
  { id: 'gbr-wheat', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', product: 'Wheat', basePrice: 0.78, currentPrice: 0.78, previousPrice: 0.78, change: -1.2, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Domestic and EU grain sources, stable prices' },
  { id: 'gbr-bread', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', product: 'Bread', basePrice: 2.85, currentPrice: 2.85, previousPrice: 2.85, change: 1.0, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Premium consumer good, industrial bakery market' },

  // AMERICAS - Large exporters, mechanized agriculture
  { id: 'usa-corn', country: 'United States', flag: '🇺🇸', region: 'Americas', product: 'Corn', basePrice: 0.45, currentPrice: 0.45, previousPrice: 0.45, change: -0.8, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Abundant', reason: 'World\'s largest producer, abundant supply for export' },
  { id: 'usa-wheat', country: 'United States', flag: '🇺🇸', region: 'Americas', product: 'Wheat', basePrice: 0.52, currentPrice: 0.52, previousPrice: 0.52, change: 0.5, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Abundant', reason: 'Major global exporter, mechanized production' },
  { id: 'bra-corn', country: 'Brazil', flag: '🇧🇷', region: 'Americas', product: 'Corn', basePrice: 0.38, currentPrice: 0.38, previousPrice: 0.38, change: 2.1, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Large domestic/export production, tropical climate variability' },
  { id: 'bra-soy', country: 'Brazil', flag: '🇧🇷', region: 'Americas', product: 'Soybeans', basePrice: 0.62, currentPrice: 0.62, previousPrice: 0.62, change: -1.8, status: 'down', lastUpdated: Date.now(), staple: false, supplyStatus: 'Abundant', reason: 'Major global producer, economies of scale' },
  { id: 'arg-wheat', country: 'Argentina', flag: '🇦🇷', region: 'Americas', product: 'Wheat', basePrice: 0.42, currentPrice: 0.42, previousPrice: 0.42, change: 1.5, status: 'up', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Temperate agricultural belt, consistent harvests' },
  { id: 'arg-corn', country: 'Argentina', flag: '🇦🇷', region: 'Americas', product: 'Corn', basePrice: 0.35, currentPrice: 0.35, previousPrice: 0.35, change: 0.0, status: 'stable', lastUpdated: Date.now(), staple: false, supplyStatus: 'Stable', reason: 'Fertile Pampas region, reliable grain production' },

  // EURASIA - Transition markets, climate variability
  { id: 'rus-wheat', country: 'Russia', flag: '🇷🇺', region: 'Eurasia', product: 'Wheat', basePrice: 0.40, currentPrice: 0.40, previousPrice: 0.40, change: 3.5, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Climate Risk', reason: 'Major producer but continental climate creates harvest volatility' },
  { id: 'rus-bread', country: 'Russia', flag: '🇷🇺', region: 'Eurasia', product: 'Bread', basePrice: 0.95, currentPrice: 0.95, previousPrice: 0.95, change: 2.2, status: 'up', lastUpdated: Date.now(), staple: true, supplyStatus: 'Stable', reason: 'Essential staple with government price regulation' },
];

// DEMO MODE: Mock metadata
const MOCK_DATA = {
  marketStatus: 'Stable',
  avgPriceIndex: 1234,
  activeRegions: 15,
  activeParticipants: 1547,
};

// ============================================================================
// EXTENDED PRODUCT CATALOG - DEMO MODE ONLY
// Frontend-only mock data for marketplace functionality
// ============================================================================

interface CartProduct {
  id: string;
  name: string;
  category: string;
  region: string;
  price_per_kg: number;
  stock_kg: number;
  initial_stock: number;
  last_updated: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  emoji: string;
}

interface CartItem {
  product_id: string;
  quantity_kg: number;
  added_at: number;
}

const PRODUCT_CATALOG: CartProduct[] = [
  // ASIA
  { id: 'pr-asia-rice-1', name: 'Premium Jasmine Rice', category: 'Rice', region: 'Thailand', price_per_kg: 2.45, stock_kg: 500, initial_stock: 500, last_updated: Date.now(), status: 'In Stock', emoji: '🍚' },
  { id: 'pr-asia-rice-2', name: 'Basmati Rice', category: 'Rice', region: 'India', price_per_kg: 3.20, stock_kg: 800, initial_stock: 800, last_updated: Date.now(), status: 'In Stock', emoji: '🍚' },
  { id: 'pr-asia-wheat-1', name: 'Wheat Grain', category: 'Wheat', region: 'China', price_per_kg: 0.85, stock_kg: 1200, initial_stock: 1200, last_updated: Date.now(), status: 'In Stock', emoji: '🌾' },
  { id: 'pr-asia-oil-1', name: 'Palm Cooking Oil', category: 'Oil', region: 'Indonesia', price_per_kg: 4.50, stock_kg: 300, initial_stock: 300, last_updated: Date.now(), status: 'In Stock', emoji: '🛢️' },
  { id: 'pr-asia-veg-1', name: 'Fresh Tomatoes', category: 'Vegetables', region: 'Vietnam', price_per_kg: 1.20, stock_kg: 400, initial_stock: 400, last_updated: Date.now(), status: 'In Stock', emoji: '🍅' },
  { id: 'pr-asia-veg-2', name: 'Organic Spinach', category: 'Vegetables', region: 'Bangladesh', price_per_kg: 0.95, stock_kg: 250, initial_stock: 250, last_updated: Date.now(), status: 'Low Stock', emoji: '🥬' },

  // AFRICA
  { id: 'pr-africa-corn-1', name: 'Maize Corn', category: 'Corn', region: 'Nigeria', price_per_kg: 1.15, stock_kg: 750, initial_stock: 750, last_updated: Date.now(), status: 'In Stock', emoji: '🌽' },
  { id: 'pr-africa-rice-1', name: 'Long Grain Rice', category: 'Rice', region: 'Kenya', price_per_kg: 2.80, stock_kg: 600, initial_stock: 600, last_updated: Date.now(), status: 'In Stock', emoji: '🍚' },
  { id: 'pr-africa-beans-1', name: 'Black Beans', category: 'Legumes', region: 'Ethiopia', price_per_kg: 2.30, stock_kg: 300, initial_stock: 300, last_updated: Date.now(), status: 'In Stock', emoji: '🫘' },
  { id: 'pr-africa-onion-1', name: 'Yellow Onions', category: 'Vegetables', region: 'South Africa', price_per_kg: 1.50, stock_kg: 450, initial_stock: 450, last_updated: Date.now(), status: 'In Stock', emoji: '🧅' },

  // EUROPE
  { id: 'pr-europe-wheat-1', name: 'Winter Wheat', category: 'Wheat', region: 'France', price_per_kg: 0.95, stock_kg: 2000, initial_stock: 2000, last_updated: Date.now(), status: 'In Stock', emoji: '🌾' },
  { id: 'pr-europe-bread-1', name: 'Whole Grain Bread', category: 'Bread', region: 'Germany', price_per_kg: 5.20, stock_kg: 200, initial_stock: 200, last_updated: Date.now(), status: 'In Stock', emoji: '🍞' },
  { id: 'pr-europe-potato-1', name: 'Premium Potatoes', category: 'Vegetables', region: 'Poland', price_per_kg: 0.75, stock_kg: 600, initial_stock: 600, last_updated: Date.now(), status: 'In Stock', emoji: '🥔' },
  { id: 'pr-europe-carrot-1', name: 'Organic Carrots', category: 'Vegetables', region: 'Netherlands', price_per_kg: 1.10, stock_kg: 400, initial_stock: 400, last_updated: Date.now(), status: 'In Stock', emoji: '🥕' },

  // AMERICAS
  { id: 'pr-americas-corn-1', name: 'Sweet Corn', category: 'Corn', region: 'USA', price_per_kg: 1.35, stock_kg: 1500, initial_stock: 1500, last_updated: Date.now(), status: 'In Stock', emoji: '🌽' },
  { id: 'pr-americas-soybean-1', name: 'Soybeans', category: 'Legumes', region: 'Brazil', price_per_kg: 2.10, stock_kg: 1000, initial_stock: 1000, last_updated: Date.now(), status: 'In Stock', emoji: '🫘' },
  { id: 'pr-americas-wheat-1', name: 'Spring Wheat', category: 'Wheat', region: 'Canada', price_per_kg: 0.98, stock_kg: 800, initial_stock: 800, last_updated: Date.now(), status: 'In Stock', emoji: '🌾' },
  { id: 'pr-americas-bean-1', name: 'Pinto Beans', category: 'Legumes', region: 'Mexico', price_per_kg: 1.85, stock_kg: 350, initial_stock: 350, last_updated: Date.now(), status: 'In Stock', emoji: '🫘' },

  // MIDDLE EAST
  { id: 'pr-mideast-wheat-1', name: 'Durum Wheat', category: 'Wheat', region: 'Egypt', price_per_kg: 1.05, stock_kg: 900, initial_stock: 900, last_updated: Date.now(), status: 'In Stock', emoji: '🌾' },
  { id: 'pr-mideast-date-1', name: 'Medjool Dates', category: 'Fruits', region: 'Saudi Arabia', price_per_kg: 6.50, stock_kg: 150, initial_stock: 150, last_updated: Date.now(), status: 'Low Stock', emoji: '📅' },
];

// Utility: Calculate seconds since last update
const getSecondsSince = (timestamp: number): number => {
  return Math.floor((Date.now() - timestamp) / 1000);
};

// Utility: Random variation for pseudo-realtime
const getRandomVariation = (): number => {
  return (Math.random() - 0.5) * 0.06; // Range: -3% to +3%
};

// Utility: Calculate status based on change
const getStatus = (change: number): 'up' | 'down' | 'stable' => {
  if (change > 0.5) return 'up';
  if (change < -0.5) return 'down';
  return 'stable';
};

export default function Dashboard() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWhyEthaniModal, setShowWhyEthaniModal] = useState(false);
  
  // LEVEL 1 PSEUDO-REALTIME STATE
  const [foodPrices, setFoodPrices] = useState<FoodPrice[]>(INITIAL_FOOD_PRICES);

  // CART SYSTEM - DEMO MODE ONLY (Frontend-only, no persistence)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<CartProduct[]>(PRODUCT_CATALOG);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId && product.stock_kg > 0) {
          const newStock = Math.max(0, product.stock_kg - 50); // Remove 50kg per add
          const newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' =
            newStock === 0 ? 'Out of Stock' : newStock < 200 ? 'Low Stock' : 'In Stock';

          return { ...product, stock_kg: newStock, status: newStatus };
        }
        return product;
      })
    );

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product_id === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.product_id === productId ? { ...item, quantity_kg: item.quantity_kg + 50 } : item
        );
      }
      return [...prevCart, { product_id: productId, quantity_kg: 50, added_at: Date.now() }];
    });

    const product = products.find((p) => p.id === productId);
    setToastMessage(`✓ Added ${product?.name || 'Product'} (50kg)`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Get cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity_kg, 0);

  // PSEUDO-REALTIME ENGINE: Update prices every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodPrices((prevPrices) =>
        prevPrices.map((item) => {
          // Get variation and calculate new price
          const variation = getRandomVariation();
          const newPrice = item.basePrice * (1 + variation);
          const changePercent = ((newPrice - item.basePrice) / item.basePrice) * 100;

          return {
            ...item,
            previousPrice: item.currentPrice,
            currentPrice: newPrice,
            change: changePercent,
            status: getStatus(changePercent),
            lastUpdated: Date.now(),
          };
        })
      );
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const handleConnectWallet = () => {
    // Demo mode: just toggle state
    setWalletConnected(!walletConnected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Inject custom animations */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <span className="text-4xl group-hover:animate-wave inline-block transition-transform">🌾</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-100 group-hover:text-green-300 transition-colors">ETHANI</h1>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Food Price Stabilization</p>
              </div>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Network Badge */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-300">Arbitrum Sepolia</span>
              </div>

              {/* Cart Badge */}
              {cartCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg animate-pulse">
                  <span className="text-lg">🛒</span>
                  <span className="text-sm font-bold text-green-300">{Math.round(cartCount)}kg</span>
                </div>
              )}

              {/* Why ETHANI? Button */}
              <button
                onClick={() => setShowWhyEthaniModal(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors group"
                title="Why ETHANI?"
              >
                <span className="text-purple-300 font-bold text-lg group-hover:text-purple-200">?</span>
              </button>

              {/* Wallet Button */}
              <Button
                variant={walletConnected ? 'outline' : 'primary'}
                size="md"
                onClick={handleConnectWallet}
              >
                {walletConnected ? (
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    0x02cE...778e
                  </span>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-amber-300">
            🎯 <strong>Demo Mode</strong> – Hackathon preview with mock data. Full integration coming soon.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h2>
          <p className="text-slate-400">Real-time market insights and system controls</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Market Status */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover-effect cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 animate-shimmer" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <span className="text-2xl animate-bounce-subtle inline-block">📊</span>
                </div>
                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-300">{MOCK_DATA.marketStatus}</span>
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Market Status</h3>
              <p className="text-2xl font-bold text-slate-100 animate-count-up">Healthy</p>
            </div>
          </div>

          {/* Price Index */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover-effect cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 animate-shimmer" style={{ animationDelay: '0.5s' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <span className="text-2xl animate-float inline-block">💰</span>
                </div>
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <span className="animate-bounce-subtle inline-block">▲</span> +5.2%
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Avg Price Index</h3>
              <p className="text-2xl font-bold text-slate-100 tabular-nums">{MOCK_DATA.avgPriceIndex.toLocaleString()}</p>
            </div>
          </div>

          {/* Active Regions */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover-effect cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 animate-shimmer" style={{ animationDelay: '1s' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                  <span className="text-2xl animate-spin-slow inline-block">🗺️</span>
                </div>
                <span className="text-xs text-purple-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Active Regions</h3>
              <p className="text-2xl font-bold text-slate-100 tabular-nums">{MOCK_DATA.activeRegions}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 card-hover-effect cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 animate-shimmer" style={{ animationDelay: '1.5s' }} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                  <span className="text-2xl animate-wave inline-block">👥</span>
                </div>
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <span className="animate-bounce-subtle inline-block">▲</span> +12%
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-1">Participants</h3>
              <p className="text-2xl font-bold text-slate-100 tabular-nums">{MOCK_DATA.activeParticipants.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Feature Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* View Prices */}
            <Link href="/dashboard/prices" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-bounce-subtle inline-block">📈</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-green-300 transition-colors">View Food Prices</h4>
                    <p className="text-sm text-slate-400">Real-time pricing across regions</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>

            {/* Submit Supply */}
            <Link href="/dashboard/supply" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-bounce-subtle inline-block">📦</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-blue-300 transition-colors">Submit Supply Data</h4>
                    <p className="text-sm text-slate-400">Report available inventory</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>

            {/* View Demand */}
            <Link href="/dashboard/demand" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-bounce-subtle inline-block">📊</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-purple-300 transition-colors">View Demand Signals</h4>
                    <p className="text-sm text-slate-400">Market demand analytics</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>

            {/* Circular Economy */}
            <Link href="/dashboard/circular-economy" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-spin-slow inline-block">♻️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-emerald-300 transition-colors">Circular Economy</h4>
                    <p className="text-sm text-slate-400">Sustainability tracking</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>

            {/* Governance */}
            <Link href="/dashboard/governance" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-wave inline-block">⚖️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-amber-300 transition-colors">Governance Rules</h4>
                    <p className="text-sm text-slate-400">System rules & parameters</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link href="/dashboard/analytics" className="block">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-pink-500/50 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors group-hover:scale-110 duration-300">
                    <span className="text-3xl group-hover:animate-bounce-subtle inline-block">📉</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-pink-300 transition-colors">Market Analytics</h4>
                    <p className="text-sm text-slate-400">Trends & insights</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all duration-300">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* PRODUCT MARKETPLACE - DEMO MODE ONLY */}
        <div className="mb-12">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">🏪 Product Marketplace</h3>
            <p className="text-sm text-slate-400">
              <span className="text-amber-300 font-semibold">Demo Mode</span> – Frontend-only mock cart (data resets on refresh)
            </p>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed bottom-8 right-8 bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-3 rounded-lg shadow-lg animate-bounce-subtle z-40">
              {toastMessage}
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 group card-hover-effect">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">{product.emoji}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.status === 'In Stock'
                        ? 'bg-green-500/20 text-green-300'
                        : product.status === 'Low Stock'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mb-1 group-hover:text-green-300 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">{product.region}</span>
                  <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">{product.category}</span>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-slate-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Price:</span>
                    <span className="font-bold text-green-300">${product.price_per_kg.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Stock:</span>
                    <span className={product.stock_kg < 200 ? 'text-yellow-300 font-semibold' : 'text-slate-300'}>
                      {Math.round(product.stock_kg)}kg
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock_kg === 0}
                  className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                    product.stock_kg === 0
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:shadow-green-500/30 active:scale-95'
                  }`}
                >
                  {product.stock_kg === 0 ? 'Out of Stock' : '+ Add 50kg to Cart'}
                </button>

                <p className="text-xs text-slate-500 mt-2 text-center">
                  {product.stock_kg > 0 ? `Each add: 50kg` : 'No stock available'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Food Price Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-slate-100">Global Food Price Overview</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full animate-pulse-glow">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-300">● Live Signal (Demo)</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                <span className="text-amber-300 animate-pulse">Demo Mode</span> – Prices update every 15 seconds with simulated market movements
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ℹ️ Simulated real-time feed: Oracle-backed updates will be enabled in production.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Staple?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Supply Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Price (USD/kg)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Context
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {foodPrices.map((item, index) => {
                    const secondsSince = getSecondsSince(item.lastUpdated);
                    const isRecent = secondsSince < 3;
                    
                    // Supply status color mapping
                    const supplyStatusColor = {
                      'Abundant': 'text-green-400 bg-green-500/10 border-green-500/30',
                      'Stable': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
                      'Tight Supply': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
                      'Import Dependent': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                      'Climate Risk': 'text-red-400 bg-red-500/10 border-red-500/30',
                    };
                    
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-800/30 transition-all duration-300 ${
                          isRecent ? (item.status === 'up' ? 'animate-price-flash' : item.status === 'down' ? 'animate-price-flash-down' : '') : ''
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Country Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg transition-transform hover:scale-125 cursor-pointer">{item.flag}</span>
                            <span className="text-sm font-medium text-slate-100">{item.country}</span>
                          </div>
                        </td>
                        
                        {/* Product Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300">{item.product}</span>
                        </td>
                        
                        {/* Staple Indicator */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.staple ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300">
                              ⭐ Staple
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">–</span>
                          )}
                        </td>
                        
                        {/* Supply Status Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-medium whitespace-nowrap ${supplyStatusColor[item.supplyStatus as keyof typeof supplyStatusColor]}`}>
                            {item.supplyStatus === 'Abundant' && '📈'}
                            {item.supplyStatus === 'Stable' && '⚖️'}
                            {item.supplyStatus === 'Tight Supply' && '⚠️'}
                            {item.supplyStatus === 'Import Dependent' && '📦'}
                            {item.supplyStatus === 'Climate Risk' && '🌪️'}
                            <span className="ml-1">{item.supplyStatus}</span>
                          </span>
                        </td>
                        
                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-sm font-semibold tabular-nums transition-all duration-300 ${
                              isRecent ? 'text-white scale-105' : 'text-slate-100'
                            }`}>
                              ${item.currentPrice.toFixed(2)}
                            </span>
                            <span className={`text-xs transition-colors ${
                              isRecent ? 'text-green-400' : 'text-slate-500'
                            }`}>
                              {isRecent ? '● Just now' : `${secondsSince}s ago`}
                            </span>
                          </div>
                        </td>
                        
                        {/* Change */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`inline-flex items-center text-sm font-medium transition-all duration-300 ${
                              item.status === 'up'
                                ? 'text-green-400'
                                : item.status === 'down'
                                ? 'text-red-400'
                                : 'text-slate-400'
                            } ${isRecent ? 'scale-110' : ''}`}
                          >
                            <span className={item.status === 'up' ? 'animate-bounce-subtle' : item.status === 'down' ? 'animate-bounce-subtle' : ''}>
                              {item.status === 'up' && '▲'}
                              {item.status === 'down' && '▼'}
                              {item.status === 'stable' && '●'}
                            </span>
                            <span className="ml-1 tabular-nums">
                              {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                            </span>
                          </span>
                        </td>
                        
                        {/* Reason / Context */}
                        <td className="px-6 py-4">
                          <div className="group relative">
                            <p className="text-xs text-slate-400 max-w-xs truncate cursor-help hover:text-slate-300 transition-colors">
                              {item.reason}
                            </p>
                            {/* Tooltip on hover */}
                            <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 bg-slate-950 border border-slate-600 rounded-lg p-3 z-10 w-64 text-xs text-slate-300 whitespace-normal shadow-lg">
                              <p className="font-semibold text-slate-100 mb-1">📍 Supply Context:</p>
                              <p>{item.reason}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">
              <strong className="text-slate-300">💡 Realistic Pricing Model:</strong> Prices reflect regional economic factors, climate risks, and supply dependencies.
            </p>
            <p className="text-xs text-slate-500">
              • <strong>Staple</strong> = Primary food for that country  
              • <strong>Supply Status</strong> = Based on local production, imports, and climate  
              • <strong>Context</strong> = Explains why this price level is realistic for this region
            </p>
            <p className="text-xs text-slate-500 mt-2 border-t border-blue-500/10 pt-2">
              🔄 Prices update every 15 seconds with simulated market movements. Oracle-backed data will be enabled in production.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-400">
            <p>© 2026 ETHANI – Fair Food Prices for Everyone</p>
            <p className="mt-1 text-xs text-slate-500">
              Built on Arbitrum • Smart Contracts Verified • Demo Mode Active
            </p>
          </div>
        </div>
      </footer>

      {/* Why ETHANI? Modal */}
      {showWhyEthaniModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-100">Why ETHANI?</h2>
              <button
                onClick={() => setShowWhyEthaniModal(false)}
                className="text-slate-400 hover:text-slate-100 transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-8 space-y-8">
              {/* Section 1: Why ETHANI? */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🌱</span>
                  <h3 className="text-xl font-bold text-slate-100">Why does ETHANI exist?</h3>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    In many countries like Indonesia, agricultural resources are abundant. Farmers work hard to grow crops,
                    yet they often struggle to sell at fair prices. Oversupply, exploitative middlemen, and lack of transparent
                    pricing hurt farmers deeply.
                  </p>
                  <p>
                    At the same time, many regions across the world struggle to access affordable staple food:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Tropical regions with year-round harvests face price crashes</li>
                    <li>Cold climate regions depend on expensive imports during winter</li>
                    <li>Seasonal regions experience drastic price swings between harvests</li>
                    <li>Conflict zones or politically unstable regions face extreme food insecurity</li>
                  </ul>
                  <p className="font-semibold text-purple-300">
                    Food exists globally, but access and price are deeply unequal.
                  </p>
                </div>
              </div>

              {/* Section 2: Why Global? */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🌍</span>
                  <h3 className="text-xl font-bold text-slate-100">Why must ETHANI be global?</h3>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Staple food prices differ drastically between countries. Climate, logistics, politics, and conflict
                    create extreme price gaps that hurt both farmers and consumers.
                  </p>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <span className="text-red-400">⚠️ Farmers suffer</span> from low prices when oversupply floods local markets
                    </p>
                    <p className="text-sm">
                      <span className="text-red-400">⚠️ Consumers suffer</span> from high prices when scarcity or conflict disrupts supply
                    </p>
                  </div>
                  <p className="font-semibold text-purple-300">
                    ETHANI aims to reduce global food price imbalance by creating a shared, transparent, and cooperative protocol
                    that connects surplus regions with deficit regions.
                  </p>
                </div>
              </div>

              {/* Section 3: Why Arbitrum? */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">⚡</span>
                  <h3 className="text-xl font-bold text-slate-100">Why is ETHANI built on Arbitrum?</h3>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Food systems must be fast, affordable, and accessible to everyone—from smallholder farmers to global cooperatives.
                    Arbitrum enables that vision:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="font-semibold text-blue-300 mb-2">💸 Low Transaction Fees</p>
                      <p className="text-sm">Affordable for farmers and communities in developing economies</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="font-semibold text-green-300 mb-2">⚡ Fast Confirmation</p>
                      <p className="text-sm">Real-time price updates and governance decisions</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="font-semibold text-purple-300 mb-2">🔐 Ethereum Security</p>
                      <p className="text-sm">Inherits Ethereum's battle-tested security guarantees</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <p className="font-semibold text-orange-300 mb-2">📈 Scalable</p>
                      <p className="text-sm">Supports global participation without congestion</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Why Web3? */}
              <div className="border-t border-slate-700 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">🔗</span>
                  <h3 className="text-xl font-bold text-slate-100">Why Web3 & Decentralization?</h3>
                </div>
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p>
                    Traditional food pricing systems are controlled by governments, corporations, or cartels.
                    This creates opacity, corruption, and unfair practices.
                  </p>
                  <p>
                    Web3 enables a fundamentally different approach:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong>No single entity controls the data</strong> – Pricing logic is transparent and auditable by anyone</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong>Open participation</strong> – Farmers, cooperatives, NGOs, and communities can join directly</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong>Transparent governance</strong> – Rules are visible and can evolve through community consensus</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span><strong>Protocol-based fairness</strong> – Algorithms replace middlemen and rent-seeking behavior</span>
                    </li>
                  </ul>
                  <p className="font-semibold text-purple-300 text-lg">
                    ETHANI is a protocol, not a company.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-700 px-6 py-4 bg-amber-500/5">
              <p className="text-sm text-center text-amber-300">
                Demo Mode – Narrative & UI only. Protocol logic will evolve with community input.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
