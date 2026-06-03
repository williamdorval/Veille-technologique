'use client';
import dynamic from 'next/dynamic';

const AnalysePlanCalculateur = dynamic(
  () => import('./AnalysePlanCalculateur').then((m) => m.AnalysePlanCalculateur),
  { ssr: false }
);

export function AnalysePlanClient() {
  return <AnalysePlanCalculateur />;
}
