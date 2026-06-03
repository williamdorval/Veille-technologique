'use client';
import dynamic from 'next/dynamic';

const ToitureCalculateur = dynamic(
  () => import('./ToitureCalculateur').then(m => m.ToitureCalculateur),
  { ssr: false }
);

export function ToitureCalculateurClient() {
  return <ToitureCalculateur />;
}
