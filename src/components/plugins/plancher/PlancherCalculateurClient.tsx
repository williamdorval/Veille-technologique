'use client';
import dynamic from 'next/dynamic';

const PlancherCalculateur = dynamic(
  () => import('./PlancherCalculateur').then(m => m.PlancherCalculateur),
  { ssr: false }
);

export function PlancherCalculateurClient() {
  return <PlancherCalculateur />;
}
