/**
 * ETHANI Frontend Configuration
 * 
 * This file contains all environment-specific configuration including
 * API endpoints, smart contract addresses, and blockchain settings.
 */

// ========== ENVIRONMENT DETECTION ==========
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// ========== BACKEND API CONFIGURATION ==========
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_CONFIG = {
  // Backend API Base URL
  baseUrl: API_URL,
  
  // API Endpoints
  endpoints: {
    // Health & Info
    health: '/health',
    
    // Authentication
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
    },
    
    // User Management
    users: {
      profile: '/users/profile',
      update: '/users/profile/update',
      delete: '/users/profile/delete',
    },
    
    // Products & Pricing
    products: {
      list: '/products',
      detail: '/products/:id',
      byCategory: '/products/category/:category',
    },
    
    // Pricing Engine
    pricing: {
      latest: '/pricing/latest',
      calculate: '/pricing/calculate',
      history: '/pricing/history',
    },
    
    // Supply Management (Farmer)
    supplies: {
      add: '/supplies/add',
      list: '/supplies/list',
      delete: '/supplies/:id',
    },
    
    // Delivery Management (Distributor)
    deliveries: {
      list: '/deliveries',
      detail: '/deliveries/:id',
      update: '/deliveries/:id/status',
      create: '/deliveries/create',
    },
    
    // Orders (Buyer)
    orders: {
      create: '/orders/create',
      list: '/orders',
      detail: '/orders/:id',
      cancel: '/orders/:id/cancel',
    },
    
    // Blockchain Integration
    blockchain: {
      getRatio: '/blockchain/ratio',
      getPricing: '/blockchain/pricing',
      recordTransaction: '/blockchain/transaction',
    },
  },
  
  // Request timeout (milliseconds)
  timeout: 30000,
  
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
  },
};

// ========== BLOCKCHAIN CONFIGURATION ==========
export const BLOCKCHAIN_CONFIG = {
  // Network Configuration
  network: {
    name: process.env.NEXT_PUBLIC_NETWORK || 'arbitrum-sepolia',
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '421614'),
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://sepolia.arbiscan.io',
  },
  
    // Smart Contract Addresses (Arbitrum Sepolia Testnet - Deployed Jan 23, 2026)
  contracts: {
    // EthaniPricing - Calculates fair prices based on supply-demand
    pricing: {
      address: process.env.NEXT_PUBLIC_CONTRACT_PRICING || '0xc92fd01c122821Eb2C911d16468B20b07E25abC0',
      abi: 'EthaniPricingABI',
      functions: {
        calculatePrice: 'calculatePrice(uint256,uint256,uint256)',
        getSupplyDemandRatio: 'getSupplyDemandRatio(uint256,uint256)',
        getPricingTier: 'getPricingTier(uint256)',
      },
    },
    
    // EthaniRegion - Manages regional supply/demand data
    region: {
      address: process.env.NEXT_PUBLIC_CONTRACT_REGION || '0x5836cdDE4D05B0aBDB97AE556a0b9E3971a16143',
      abi: 'EthaniRegionABI',
      functions: {
        addRegion: 'addRegion(string,uint256,uint256,uint256)',
        updateRegion: 'updateRegion(uint256,uint256,uint256,uint256)',
        getRegion: 'getRegion(uint256)',
        getAllRegions: 'getAllRegions()',
      },
    },
    
    // EthaniIncentive - Manages farmer incentives and rewards
    incentive: {
      address: process.env.NEXT_PUBLIC_CONTRACT_INCENTIVE || '0xE6C246d7Ba92c4d35076C91B686d104ad3118172',
      abi: 'EthaniIncentiveABI',
      functions: {
        registerUser: 'registerUser(address)',
        grantPoints: 'grantPoints(address,uint256,string)',
        getPoints: 'getPoints(address)',
        redeemPoints: 'redeemPoints(uint256)',
      },
    },
    
    // EthaniCore - Core data management and price history
    core: {
      address: process.env.NEXT_PUBLIC_CONTRACT_CORE || '0x05aF2330e286197e4A2304fd708Aa333AB3ACDE4',
      abi: 'EthaniCoreABI',
      functions: {
        getRegion: 'getRegion(uint256)',
        getSupplyDemandRatio: 'getSupplyDemandRatio(uint256)',
      },
    },
    
    // PriceOracle - Advanced pricing engine
    oracle: {
      address: process.env.NEXT_PUBLIC_CONTRACT_ORACLE || '0x139a3036052761341212C7d06488C27fb000a167',
      abi: 'PriceOracleABI',
      functions: {
        calculatePrice: 'calculatePrice(uint256,uint256,uint256)',
        getLatestPrice: 'getLatestPrice(uint256)',
      },
    },
  },
  
  // Gas configuration
  gas: {
    // Standard gas limits for common operations
    limits: {
      transfer: 21000,
      updatePrice: 100000,
      registerUser: 80000,
      recordTransaction: 120000,
    },
    // Gas price multiplier (for faster transactions)
    speedMultiplier: 1.0,
  },
  
  // Web3 configuration
  web3: {
    // Timeout for blockchain operations
    timeout: 60000,
    // Number of block confirmations required
    confirmations: 2,
    // Maximum allowed gas price (in gwei)
    maxGasPrice: 100,
  },
};

// ========== PRICING ENGINE CONFIGURATION ==========
export const PRICING_CONFIG = {
  // Supply-Demand Ratio Tiers
  tiers: [
    {
      id: 'KRITIS',
      name: 'Critical Shortage',
      ratio_min: 1.30,
      ratio_max: Infinity,
      multiplier: 1.15, // +15%
      color: '#dc2626', // red
      emoji: '🔴',
      description: 'Supply critically low',
    },
    {
      id: 'KURANG',
      name: 'Shortage',
      ratio_min: 1.10,
      ratio_max: 1.29,
      multiplier: 1.08, // +8%
      color: '#ea580c', // orange
      emoji: '🟠',
      description: 'Supply below demand',
    },
    {
      id: 'SEIMBANG',
      name: 'Balanced',
      ratio_min: 0.80,
      ratio_max: 1.09,
      multiplier: 1.0, // 0%
      color: '#16a34a', // green
      emoji: '🟢',
      description: 'Market balanced',
    },
    {
      id: 'BANYAK',
      name: 'Surplus',
      ratio_min: 0,
      ratio_max: 0.79,
      multiplier: 0.9, // -10%
      color: '#2563eb', // blue
      emoji: '🔵',
      description: 'Supply exceeds demand',
    },
  ],
  
  // Hard limits to protect farmers and consumers
  hardLimits: {
    maxIncrease: 1.50, // +50% maximum
    maxDecrease: 0.70, // -30% minimum
  },
  
  // Update frequency
  updateInterval: 60 * 1000, // Update prices every 60 seconds
};

// ========== USER ROLES & PERMISSIONS ==========
export const USER_ROLES = {
  FARMER: {
    id: 'farmer',
    name: 'Petani',
    emoji: '👨‍🌾',
    description: 'Food producer',
    features: ['track-supply', 'view-price', 'sell-product', 'view-earnings'],
  },
  DISTRIBUTOR: {
    id: 'distributor',
    name: 'Distributor',
    emoji: '🚚',
    description: 'Supply chain manager',
    features: ['manage-deliveries', 'track-routes', 'view-analytics', 'optimize-routes'],
  },
  BUYER: {
    id: 'buyer',
    name: 'Pembeli',
    emoji: '🛒',
    description: 'Food consumer',
    features: ['browse-products', 'place-orders', 'track-orders', 'view-pricing'],
  },
};

// ========== PRODUCT CATEGORIES ==========
export const PRODUCT_CATEGORIES = [
  { id: 'rice', name: 'Beras', emoji: '🌾', color: '#fbbf24' },
  { id: 'corn', name: 'Jagung', emoji: '🌽', color: '#fbbf24' },
  { id: 'vegetables', name: 'Sayuran', emoji: '🥬', color: '#10b981' },
  { id: 'tubers', name: 'Umbi', emoji: '🥔', color: '#fb923c' },
  { id: 'legumes', name: 'Kacang', emoji: '🫘', color: '#d97706' },
];

// ========== LOCATION CONSTANTS ==========
export const REGIONS = [
  { id: 1, name: 'Jawa Barat', emoji: '🗺️' },
  { id: 2, name: 'Jawa Tengah', emoji: '🗺️' },
  { id: 3, name: 'Jawa Timur', emoji: '🗺️' },
  { id: 4, name: 'Sumatra Utara', emoji: '🗺️' },
  { id: 5, name: 'Sumatra Selatan', emoji: '🗺️' },
  { id: 6, name: 'Bali', emoji: '🗺️' },
  { id: 7, name: 'Lombok', emoji: '🗺️' },
];

// ========== VALIDATION RULES ==========
export const VALIDATION = {
  nik: {
    length: 16,
    pattern: /^\d{16}$/,
    errorMessage: 'NIK harus 16 digit angka',
  },
  phone: {
    pattern: /^(08|62)[0-9]{8,11}$/,
    errorMessage: 'Nomor HP tidak valid (08xxxx atau 62xxxx)',
  },
  password: {
    minLength: 8,
    errorMessage: 'Kata sandi minimal 8 karakter',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: 'Email tidak valid',
  },
};

// ========== TOAST NOTIFICATIONS ==========
export const NOTIFICATIONS = {
  duration: 3000, // Auto-dismiss after 3 seconds
  position: 'bottom-right',
};

// ========== CURRENCY & FORMATTING ==========
export const CURRENCY = {
  symbol: 'Rp',
  locale: 'id-ID',
  decimals: 0,
};

// ========== THEME COLORS ==========
export const THEME = {
  primary: '#16a34a', // Green
  success: '#15803d',
  warning: '#ea580c',
  danger: '#dc2626',
  info: '#2563eb',
  background: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

// ========== FEATURE FLAGS ==========
export const FEATURES = {
  enableBlockchain: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN !== 'false',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
  enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
};

// ========== DEVELOPMENT HELPERS ==========
if (isDev) {
  console.log('[ETHANI Config] Development Mode');
  console.log('[ETHANI Config] API Base URL:', API_CONFIG.baseUrl);
  console.log('[ETHANI Config] Network:', BLOCKCHAIN_CONFIG.network.name);
  console.log('[ETHANI Config] Blockchain Enabled:', FEATURES.enableBlockchain);
}

// ========== EXPORT ALL CONFIGS ==========
export default {
  API_CONFIG,
  BLOCKCHAIN_CONFIG,
  PRICING_CONFIG,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  REGIONS,
  VALIDATION,
  NOTIFICATIONS,
  CURRENCY,
  THEME,
  FEATURES,
};
