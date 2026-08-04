'use client';

import { useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 text-center space-y-4 border border-slate-100">
        <XCircle className="text-rose-500 mx-auto" size={56} />
        <h1 className="text-2xl font-black text-slate-900">Payment Failed</h1>
        <p className="text-xs text-slate-500">We could not process your Telebirr payment transaction.</p>

        <div className="space-y-2 pt-4">
          <button onClick={() => router.back()} className="w-full py-3 bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Try Again
          </button>
          <button onClick={() => router.push('/')} className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Return to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}