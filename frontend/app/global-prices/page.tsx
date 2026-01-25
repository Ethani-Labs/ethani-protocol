'use client';

// Redirect to the actual global prices page at /dashboard/prices
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalPricesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/prices');
  }, [router]);

  return null;
}
