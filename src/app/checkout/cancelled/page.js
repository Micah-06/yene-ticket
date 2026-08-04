'use client';

import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export default function CancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 text-center space-y-4 border border-slate-100">
        <AlertTriangle className="text-amber-500 mx-auto" size={56} />
        <h1 className="text-2xl font-black text-slate-900">Payment Cancelled</h1>
        <p className="text-xs text-slate-500">You cancelled the payment transaction before completion.</p>

        <div className="space-y-2 pt-4">
          <button onClick={() => router.back()} className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Continue Payment
          </button>
          <button onClick={() => router.push('/')} className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <ArrowRight size={16} /> Return to Event
          </button>
        </div>
      </div>
    </div>
  );
}