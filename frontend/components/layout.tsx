'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description: string;
}

// ETHANI Navigation Structure - Clear & Intuitive
const NAV_ITEMS: NavItem[] = [
  { 
    href: '/dashboard', 
    label: 'Dashboard', 
    icon: '📊', 
    description: 'Global overview & system status' 
  },
  { 
    href: '/market', 
    label: 'Global Market', 
    icon: '🌾', 
    description: 'Browse food commodities' 
  },
  { 
    href: '/global-prices', 
    label: 'Global Prices', 
    icon: '🌍', 
    description: 'Country & region price comparison' 
  },
  { 
    href: '/stability-rules', 
    label: 'Stability Rules', 
    icon: '⚖️', 
    description: 'Rule-based price stabilization' 
  },
  { 
    href: '/dashboard/governance', 
    label: 'Governance', 
    icon: '🏛️', 
    description: 'DAO & protocol governance' 
  },
  { 
    href: '/profile', 
    label: 'Wallet & Profile', 
    icon: '👛', 
    description: 'Wallet identity & user info' 
  },
];

// Sub-menu items for Stability Rules
const STABILITY_SUBMENU = [
  { id: 'overview', label: 'Overview', icon: '📘' },
  { id: 'pricing-tiers', label: 'Pricing Tiers', icon: '📊' },
  { id: 'safety-limits', label: 'Safety Limits', icon: '🔐' },
  { id: 'algorithm-flow', label: 'Algorithm Flow', icon: '⚙️' },
  { id: 'regional-impact', label: 'Regional Impact', icon: '🌍' },
  { id: 'why-matters', label: 'Why It Matters', icon: '❓' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [isSubSidebarOpen, setIsSubSidebarOpen] = React.useState(false);
  const [isLogoHovered, setIsLogoHovered] = React.useState(false);
  const subSidebarTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine active item - strictly route-based, one item active at a time
  const getIsActive = (href: string): boolean => {
    if (!mounted) return false;
    
    // Exact match for dashboard (default to dashboard for root)
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard' || pathname === '';
    }
    
    // Exact match for other routes
    return pathname === href;
  };

  // Handle sub-sidebar open
  const handleSubSidebarOpen = () => {
    if (subSidebarTimeoutRef.current) {
      clearTimeout(subSidebarTimeoutRef.current);
    }
    setIsSubSidebarOpen(true);
  };

  // Handle sub-sidebar close with delay to prevent flicker
  const handleSubSidebarClose = () => {
    subSidebarTimeoutRef.current = setTimeout(() => {
      setIsSubSidebarOpen(false);
    }, 150);
  };

  React.useEffect(() => {
    return () => {
      if (subSidebarTimeoutRef.current) {
        clearTimeout(subSidebarTimeoutRef.current);
      }
    };
  }, []);

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:flex flex-col bg-stability-navy border-r border-stability-border z-40 relative">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-stability-border">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <span 
            className={`text-3xl transition-all duration-300 ${
              isLogoHovered 
                ? 'animate-sway-fast drop-shadow-lg' 
                : 'animate-sway'
            }`}
            style={{
              filter: isLogoHovered 
                ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))' 
                : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.15))'
            }}
          >
            🌾
          </span>
          <div>
            <h1 className="text-lg font-bold text-stability-text group-hover:text-stability-green transition-colors">ETHANI</h1>
            <p className="text-xs text-stability-text-muted">Food Price Stability</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1 bg-gradient-to-b from-stability-navy to-stability-slate/20 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = getIsActive(item.href);
          const isStabilityRulesItem = item.href === '/stability-rules';

          return (
            <div
              key={item.href}
              onMouseEnter={isStabilityRulesItem ? handleSubSidebarOpen : undefined}
              onMouseLeave={isStabilityRulesItem ? handleSubSidebarClose : undefined}
              className="relative"
            >
              <Link
                href={item.href}
                className={`
                  group flex items-start gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 relative
                  ${
                    isActive
                      ? 'bg-stability-green/12 text-stability-green border border-stability-green/40'
                      : 'text-stability-text-muted hover:text-stability-text hover:bg-stability-slate/40'
                  }
                `}
                title={item.description}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-stability-green rounded-r-lg" />
                )}
                
                {/* Icon */}
                <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                
                {/* Label + Description */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isActive ? 'text-stability-green' : 'text-stability-text'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-stability-text-muted line-clamp-1 group-hover:text-stability-text">
                    {item.description}
                  </p>
                </div>


              </Link>

              {/* Sub-Sidebar Flyout - Only for Stability Rules */}
              {isStabilityRulesItem && (
                <div
                  className={`
                    absolute left-64 top-0 w-56 bg-stability-slate border border-stability-border rounded-lg shadow-2xl
                    transition-all duration-300 ease-out pointer-events-none z-50
                    ${
                      isSubSidebarOpen
                        ? 'opacity-100 translate-x-0 pointer-events-auto'
                        : 'opacity-0 -translate-x-2 pointer-events-none'
                    }
                  `}
                  onMouseEnter={handleSubSidebarOpen}
                  onMouseLeave={handleSubSidebarClose}
                >
                  {/* Sub-Sidebar Header */}
                  <div className="px-4 py-3 border-b border-stability-border/50">
                    <p className="text-xs font-bold uppercase text-stability-text-muted tracking-wider">Rule Explorer</p>
                  </div>

                  {/* Sub-Menu Items */}
                  <div className="py-2 space-y-1">
                    {STABILITY_SUBMENU.map((submenu) => (
                      <Link
                        key={submenu.id}
                        href={`/stability-rules#${submenu.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-stability-text hover:bg-stability-green/10 hover:text-stability-green transition-all duration-150 group"
                      >
                        <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                          {submenu.icon}
                        </span>
                        <span className="text-sm font-medium truncate">{submenu.label}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Sub-Sidebar Footer */}
                  <div className="px-4 py-2 border-t border-stability-border/50 text-xs text-stability-text-muted">
                    💡 Hover to explore
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer - Deployment Badge (Sticky) */}
      <div className="sticky bottom-0 px-4 py-4 border-t border-stability-border bg-stability-slate/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 justify-center px-3 py-2 rounded-lg bg-stability-gold/10 border border-stability-gold/20">
          <span className="text-stability-gold text-lg">🚀</span>
          <span className="text-xs font-medium text-stability-gold">Deployed on Arbitrum</span>
        </div>
      </div>
    </aside>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex lg:ml-64 h-16 items-center justify-between px-6 bg-gradient-to-r from-stability-slate to-stability-slate/80 border-b border-stability-border sticky top-0 z-40">
        <div>
          <h2 className="text-lg font-bold text-stability-text">ETHANI Protocol</h2>
          <p className="text-xs text-stability-text-muted">Rule-based food price stabilization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stability-green/10 border border-stability-green/20">
            <div className="w-2 h-2 bg-stability-green rounded-full animate-pulse" />
            <span className="text-xs font-medium text-stability-green">Live · Demo</span>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-stability-slate border-b border-stability-border flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-stability-text">ETHANI</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-stability-text-muted hover:text-stability-text text-2xl"
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-stability-slate border-b border-stability-border p-4 space-y-2 z-40">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-stability-text hover:bg-stability-border/30 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-stability-text-muted">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        /* Logo Rice Icon - Sway Animation (Idle) */
        @keyframes sway {
          0% {
            transform: rotate(-2deg);
            opacity: 1;
          }
          50% {
            transform: rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: rotate(-2deg);
            opacity: 1;
          }
        }

        /* Logo Rice Icon - Faster Sway Animation (Hover) */
        @keyframes sway-fast {
          0% {
            transform: rotate(-3deg);
            opacity: 1;
          }
          50% {
            transform: rotate(3deg);
            opacity: 1;
          }
          100% {
            transform: rotate(-3deg);
            opacity: 1;
          }
        }

        /* Apply animations with prefers-reduced-motion support */
        .animate-sway {
          animation: sway 5s ease-in-out infinite;
        }

        .animate-sway-fast {
          animation: sway-fast 3s ease-in-out infinite;
        }

        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-sway,
          .animate-sway-fast {
            animation: none;
          }
        }

        /* Smooth origin for rotation */
        .animate-sway,
        .animate-sway-fast {
          transform-origin: center;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
