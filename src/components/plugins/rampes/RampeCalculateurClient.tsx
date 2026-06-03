'use client';
import dynamic from 'next/dynamic';

const RampeCalculateur = dynamic(
  () => import('./RampeCalculateur').then(m => m.RampeCalculateur),
  { ssr: false }
);

export function RampeCalculateurClient() {
  return <RampeCalculateur />;
}
