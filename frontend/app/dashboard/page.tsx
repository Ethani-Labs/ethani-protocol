'use client';

import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(() => {
    // In a real app, this would check the user's role from localStorage or API
    // For demo, redirect to farmer dashboard
    const userRole = localStorage.getItem('userRole') || 'farmer';
    window.location.href = `/dashboard/${userRole}`;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Memuat Dashboard...</h1>
        <p className="text-gray-600">Mohon tunggu sebentar.</p>
      </div>
    </div>
  );
}
