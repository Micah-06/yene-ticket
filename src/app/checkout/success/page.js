'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Download, ArrowLeft, Ticket } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [data, setData] = useState(null);

  useEffect(() => {
    if (orderId) {
      supabase
        .from('tickets')
        .select('*, orders(*), events(*)')
        .eq('order_id', orderId)
        .single()
        .then(({ data }) => setData(data));
    }
  }, [orderId]);

  if (!data) return <div className="p-10 text-center">Loading ticket details...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-6 text-center space-y-4 border border-slate-100">
        <CheckCircle className="text-emerald-500 mx-auto" size={56} />
        <h1 className="text-2xl font-black text-slate-900">Payment Successful</h1>
        <p className="text-xs text-slate-500">Your order has been verified and your ticket is ready.</p>

        <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 text-xs text-slate-700">
          <p><strong>Event:</strong> {data.events.title}</p>
          <p><strong>Order #:</strong> {data.orders.order_number}</p>
          <p><strong>Amount:</strong> {data.orders.total_amount} ETB</p>
          <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">{data.status}</span></p>
        </div>

        <div className="border-t pt-4">
          <img src={data.qr_code_data} alt="Ticket QR Code" className="w-44 h-44 mx-auto border rounded-xl" />
        </div>

        <div className="space-y-2 pt-2">
          <button onClick={() => window.print()} className="w-full py-3 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <Download size={16} /> Download PDF Ticket
          </button>
          <button onClick={() => router.push('/')} className="w-full py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// 1. Move your main logic into a inner component
function CheckoutContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const ticketTypeId = searchParams.get('ticketTypeId');

  return (
    <div>
      <h1>Checkout for Event {eventId}</h1>
      <p>Ticket ID: {ticketTypeId}</p>
    </div>
  );
}

// 2. Export the main page wrapped in Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}