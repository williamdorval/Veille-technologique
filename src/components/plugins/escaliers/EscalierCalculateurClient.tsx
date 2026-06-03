'use client';
import dynamic from 'next/dynamic';

const EscalierCalculateurPro = dynamic(
  () => import('./EscalierCalculateurPro').then(m => m.EscalierCalculateurPro),
  { ssr: false }
);

export function EscalierCalculateurClient() {
  return <EscalierCalculateurPro />;
}
