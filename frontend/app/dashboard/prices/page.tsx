'use client';

// HACKATHON DEMO MODE: Global Food Prices
// Mock data with USD pricing and regional filtering

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Region → Country → Province mapping
const LOCATION_DATA = {
  'Southeast Asia': {
    'Indonesia': ['Java', 'Sumatra', 'Kalimantan', 'Sulawesi'],
    'Thailand': ['Central Thailand', 'Northern Thailand', 'Southern Thailand'],
    'Philippines': ['Luzon', 'Visayas', 'Mindanao'],
    'Vietnam': ['Northern Vietnam', 'Central Vietnam', 'Southern Vietnam'],
  },
  'East Asia': {
    'China': ['Beijing', 'Shanghai', 'Guangdong', 'Sichuan'],
    'Japan': ['Kanto', 'Kansai', 'Kyushu'],
    'South Korea': ['Seoul', 'Busan', 'Jeju'],
  },
  'South Asia': {
    'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal'],
    'Pakistan': ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa'],
    'Bangladesh': ['Dhaka', 'Chittagong', 'Rajshahi'],
  },
  'Middle East': {
    'Saudi Arabia': ['Riyadh', 'Makkah', 'Eastern Province'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza'],
  },
  'Africa': {
    'Nigeria': ['Lagos', 'Kano', 'Rivers'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu'],
    'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
  },
  'Europe': {
    'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Berlin'],
    'France': ['Île-de-France', 'Provence', 'Brittany'],
    'Spain': ['Madrid', 'Catalonia', 'Andalusia'],
    'Italy': ['Lombardy', 'Lazio', 'Sicily'],
  },
  'North America': {
    'United States': ['California', 'Texas', 'New York', 'Florida'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia'],
    'Mexico': ['Mexico City', 'Jalisco', 'Nuevo León'],
  },
  'South America': {
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais'],
    'Argentina': ['Buenos Aires', 'Córdoba', 'Santa Fe'],
    'Colombia': ['Bogotá', 'Antioquia', 'Valle del Cauca'],
  },
  'Australia & Oceania': {
    'Australia': ['New South Wales', 'Victoria', 'Queensland'],
    'New Zealand': ['North Island', 'South Island'],
  },
  'Russia & Central Asia': {
    'Russia': ['Moscow', 'Saint Petersburg', 'Siberia'],
    'Kazakhstan': ['Almaty', 'Nur-Sultan', 'Shymkent'],
  },
};

// Global staple food prices (mock data)
const GLOBAL_FOOD_DATA = [
  // Southeast Asia
  { id: 1, region: 'Southeast Asia', country: 'Indonesia', province: 'Java', product: 'Rice', price: 0.68, availability: 'In Stock', change: 2.3, trend: 'up', flag: '🇮🇩' },
  { id: 2, region: 'Southeast Asia', country: 'Indonesia', province: 'Sumatra', product: 'Rice', price: 0.65, availability: 'In Stock', change: 1.8, trend: 'up', flag: '🇮🇩' },
  { id: 3, region: 'Southeast Asia', country: 'Indonesia', province: 'Java', product: 'Corn', price: 0.42, availability: 'In Stock', change: -0.5, trend: 'down', flag: '🇮🇩' },
  { id: 4, region: 'Southeast Asia', country: 'Thailand', province: 'Central Thailand', product: 'Rice', price: 0.58, availability: 'In Stock', change: -0.8, trend: 'down', flag: '🇹🇭' },
  { id: 5, region: 'Southeast Asia', country: 'Thailand', province: 'Northern Thailand', product: 'Rice', price: 0.55, availability: 'In Stock', change: 0.0, trend: 'stable', flag: '🇹🇭' },
  { id: 6, region: 'Southeast Asia', country: 'Philippines', province: 'Luzon', product: 'Rice', price: 0.72, availability: 'Limited', change: 3.5, trend: 'up', flag: '🇵🇭' },
  { id: 7, region: 'Southeast Asia', country: 'Vietnam', province: 'Southern Vietnam', product: 'Rice', price: 0.60, availability: 'In Stock', change: 1.2, trend: 'up', flag: '🇻🇳' },

  // East Asia
  { id: 8, region: 'East Asia', country: 'China', province: 'Shanghai', product: 'Rice', price: 0.72, availability: 'In Stock', change: 1.8, trend: 'up', flag: '🇨🇳' },
  { id: 9, region: 'East Asia', country: 'China', province: 'Beijing', product: 'Wheat', price: 0.42, availability: 'In Stock', change: 0.5, trend: 'up', flag: '🇨🇳' },
  { id: 10, region: 'East Asia', country: 'Japan', province: 'Kanto', product: 'Rice', price: 1.25, availability: 'Limited', change: 2.1, trend: 'up', flag: '🇯🇵' },
  { id: 11, region: 'East Asia', country: 'South Korea', province: 'Seoul', product: 'Rice', price: 1.15, availability: 'In Stock', change: 0.8, trend: 'up', flag: '🇰🇷' },

  // South Asia
  { id: 12, region: 'South Asia', country: 'India', province: 'Maharashtra', product: 'Rice', price: 0.52, availability: 'In Stock', change: 3.1, trend: 'up', flag: '🇮🇳' },
  { id: 13, region: 'South Asia', country: 'India', province: 'Karnataka', product: 'Wheat', price: 0.38, availability: 'In Stock', change: 1.5, trend: 'up', flag: '🇮🇳' },
  { id: 14, region: 'South Asia', country: 'Pakistan', province: 'Punjab', product: 'Wheat', price: 0.35, availability: 'In Stock', change: 2.8, trend: 'up', flag: '🇵🇰' },
  { id: 15, region: 'South Asia', country: 'Bangladesh', province: 'Dhaka', product: 'Rice', price: 0.48, availability: 'Limited', change: 4.2, trend: 'up', flag: '🇧🇩' },

  // Middle East
  { id: 16, region: 'Middle East', country: 'Saudi Arabia', province: 'Riyadh', product: 'Wheat', price: 0.75, availability: 'In Stock', change: 1.2, trend: 'up', flag: '🇸🇦' },
  { id: 17, region: 'Middle East', country: 'UAE', province: 'Dubai', product: 'Rice', price: 0.95, availability: 'In Stock', change: 0.0, trend: 'stable', flag: '🇦🇪' },
  { id: 18, region: 'Middle East', country: 'Egypt', province: 'Cairo', product: 'Wheat', price: 0.48, availability: 'Scarce', change: 5.5, trend: 'up', flag: '🇪🇬' },

  // Africa
  { id: 19, region: 'Africa', country: 'Nigeria', province: 'Lagos', product: 'Corn', price: 0.62, availability: 'In Stock', change: 2.8, trend: 'up', flag: '🇳🇬' },
  { id: 20, region: 'Africa', country: 'Kenya', province: 'Nairobi', product: 'Corn', price: 0.58, availability: 'Limited', change: -1.5, trend: 'down', flag: '🇰🇪' },
  { id: 21, region: 'Africa', country: 'South Africa', province: 'Gauteng', product: 'Corn', price: 0.55, availability: 'In Stock', change: 0.5, trend: 'up', flag: '🇿🇦' },

  // Europe
  { id: 22, region: 'Europe', country: 'Germany', province: 'Bavaria', product: 'Wheat', price: 0.68, availability: 'In Stock', change: -0.5, trend: 'down', flag: '🇩🇪' },
  { id: 23, region: 'Europe', country: 'France', province: 'Île-de-France', product: 'Wheat', price: 0.72, availability: 'In Stock', change: 0.3, trend: 'up', flag: '🇫🇷' },
  { id: 24, region: 'Europe', country: 'Spain', province: 'Madrid', product: 'Wheat', price: 0.65, availability: 'In Stock', change: -0.8, trend: 'down', flag: '🇪🇸' },
  { id: 25, region: 'Europe', country: 'Italy', province: 'Lombardy', product: 'Wheat', price: 0.70, availability: 'In Stock', change: 0.0, trend: 'stable', flag: '🇮🇹' },

  // North America
  { id: 26, region: 'North America', country: 'United States', province: 'California', product: 'Wheat', price: 0.52, availability: 'In Stock', change: 0.5, trend: 'up', flag: '🇺🇸' },
  { id: 27, region: 'North America', country: 'United States', province: 'Texas', product: 'Corn', price: 0.45, availability: 'In Stock', change: -0.8, trend: 'down', flag: '🇺🇸' },
  { id: 28, region: 'North America', country: 'Canada', province: 'Ontario', product: 'Wheat', price: 0.58, availability: 'In Stock', change: 1.2, trend: 'up', flag: '🇨🇦' },
  { id: 29, region: 'North America', country: 'Mexico', province: 'Jalisco', product: 'Corn', price: 0.38, availability: 'In Stock', change: 1.8, trend: 'up', flag: '🇲🇽' },

  // South America
  { id: 30, region: 'South America', country: 'Brazil', province: 'São Paulo', product: 'Corn', price: 0.38, availability: 'In Stock', change: 2.1, trend: 'up', flag: '🇧🇷' },
  { id: 31, region: 'South America', country: 'Brazil', province: 'Rio de Janeiro', product: 'Soybeans', price: 0.62, availability: 'In Stock', change: -1.8, trend: 'down', flag: '🇧🇷' },
  { id: 32, region: 'South America', country: 'Argentina', province: 'Buenos Aires', product: 'Wheat', price: 0.42, availability: 'In Stock', change: 1.5, trend: 'up', flag: '🇦🇷' },
  { id: 33, region: 'South America', country: 'Colombia', province: 'Bogotá', product: 'Corn', price: 0.52, availability: 'Limited', change: 3.2, trend: 'up', flag: '🇨🇴' },

  // Australia & Oceania
  { id: 34, region: 'Australia & Oceania', country: 'Australia', province: 'New South Wales', product: 'Wheat', price: 0.85, availability: 'In Stock', change: -2.1, trend: 'down', flag: '🇦🇺' },
  { id: 35, region: 'Australia & Oceania', country: 'New Zealand', province: 'North Island', product: 'Wheat', price: 0.92, availability: 'In Stock', change: 0.5, trend: 'up', flag: '🇳🇿' },

  // Russia & Central Asia
  { id: 36, region: 'Russia & Central Asia', country: 'Russia', province: 'Moscow', product: 'Wheat', price: 0.40, availability: 'In Stock', change: 3.5, trend: 'up', flag: '🇷🇺' },
  { id: 37, region: 'Russia & Central Asia', country: 'Kazakhstan', province: 'Almaty', product: 'Wheat', price: 0.38, availability: 'In Stock', change: 2.8, trend: 'up', flag: '🇰🇿' },
];

export default function GlobalPricesPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');

  // Get available countries for selected region
  const availableCountries = useMemo(() => {
    if (selectedRegion === 'All') return [];
    return Object.keys(LOCATION_DATA[selectedRegion as keyof typeof LOCATION_DATA] || {});
  }, [selectedRegion]);

  // Get available provinces for selected country
  const availableProvinces = useMemo(() => {
    if (selectedRegion === 'All' || selectedCountry === 'All') return [];
    const regionData = LOCATION_DATA[selectedRegion as keyof typeof LOCATION_DATA];
    return regionData?.[selectedCountry as keyof typeof regionData] || [];
  }, [selectedRegion, selectedCountry]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return GLOBAL_FOOD_DATA.filter((item) => {
      if (selectedRegion !== 'All' && item.region !== selectedRegion) return false;
      if (selectedCountry !== 'All' && item.country !== selectedCountry) return false;
      if (selectedProvince !== 'All' && item.province !== selectedProvince) return false;
      return true;
    });
  }, [selectedRegion, selectedCountry, selectedProvince]);

  // Handle region change - reset country and province
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCountry('All');
    setSelectedProvince('All');
  };

  // Handle country change - reset province
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedProvince('All');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-300">Arbitrum Sepolia</span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <p className="text-center text-sm text-amber-300">
            🎯 <strong>Demo Mode</strong> – Global prices shown for demonstration purposes only.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Global Food Prices</h1>
          <p className="text-slate-400">Real-time staple food pricing across all regions (USD)</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Filter by Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Regions</option>
                {Object.keys(LOCATION_DATA).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={selectedRegion === 'All'}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All Countries</option>
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Province Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Province / State</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={selectedCountry === 'All'}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All Provinces</option>
                {availableProvinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-200">{filteredData.length}</span> results
          </div>
        </div>

        {/* Prices Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">Price (USD/kg)</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase">24h Change</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No data available for selected filters
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.flag}</span>
                          <div>
                            <div className="text-sm font-medium text-slate-100">{item.country}</div>
                            <div className="text-xs text-slate-400">{item.province}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-slate-100">${item.price.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">per kilogram</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center text-sm font-medium ${
                            item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                          }`}
                        >
                          {item.trend === 'up' && '▲'}
                          {item.trend === 'down' && '▼'}
                          {item.trend === 'stable' && '●'}
                          <span className="ml-1">
                            {item.change > 0 ? '+' : ''}
                            {item.change.toFixed(1)}%
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.availability === 'In Stock'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : item.availability === 'Limited'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {item.availability}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-slate-500 text-center mt-6">
          Reference prices in USD — Demo Mode. Actual integration with oracles and smart contracts coming soon.
        </p>
      </main>
    </div>
  );
}
