'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard/farmer', label: 'Farmer Dashboard', icon: '🚜', roles: ['farmer'] },
  { href: '/dashboard/distributor', label: 'Distributor', icon: '🚚', roles: ['distributor'] },
  { href: '/dashboard/buyer', label: 'Buyer', icon: '🛒', roles: ['buyer'] },
  { href: '/market', label: 'Market', icon: '📊' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setRole(storedRole);
  }, []);

  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:flex flex-col bg-slate-900 border-r border-slate-700">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl">🌾</span>
          <div>
            <h1 className="text-xl font-bold text-slate-100">ETHANI</h1>
            <p className="text-xs text-slate-400">Price Stability</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg
                transition-colors duration-200
                ${
                  isActive
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden lg:flex lg:ml-64 h-16 items-center justify-between px-6 bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">ETHANI System</h2>
          <p className="text-xs text-slate-400">Rule-based price stabilization</p>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-slate-100">ETHANI</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-slate-100 text-2xl"
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-slate-800 border-b border-slate-700 p-4 space-y-2 z-40">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
