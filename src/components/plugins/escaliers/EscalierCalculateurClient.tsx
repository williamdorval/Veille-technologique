'use client';
import dynamic from 'next/dynamic';

const EscalierCalculateur = dynamic(
  () => import('./EscalierCalculateur').then(m => m.EscalierCalculateur),
  { ssr: false }
);

export function EscalierCalculateurClient() {
  return <EscalierCalculateur />;
}
