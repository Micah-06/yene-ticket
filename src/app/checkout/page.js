'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const eventId = searchParams.get('eventId') || 'evt_1';
  const basePrice = Number(searchParams.get('price')) || 500;

  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendees, setAttendees] = useState([
    { fullName: '', phoneNumber: '' }
  ]);
  const [loading, setLoading] = useState(false);

  // Update quantity and adjust attendees array accordingly
  const handleQuantityChange = (count) => {
    const qty = Number(count);
    setTicketQuantity(qty);
    setAttendees((prev) => {
      const updated = [...prev];
      if (qty > prev.length) {
        for (let i = prev.length; i < qty; i++) {
          updated.push({ fullName: '', phoneNumber: '' });
        }
      } else {
        return updated.slice(0, qty);
      }
      return updated;
    });
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Process payment logic here
    setTimeout(() => {
      setLoading(false);
      alert('Order placed successfully! Redirecting...');
    }, 1500);
  };

  const totalPrice = basePrice * ticketQuantity;

  return (
    <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-6 sm:p-10 w-full max-w-xl">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center mb-8">
        Select Tickets & Details
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of Tickets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Number of Tickets
          </label>
          <select
            value={ticketQuantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Ticket' : 'Tickets'}
              </option>
            ))}
          </select>
        </div>

        {/* Attendee Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Attendee Information
          </h2>

          {attendees.map((attendee, index) => (
            <div
              key={index}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3"
            >
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block">
                ATTENDEE {index + 1}
              </span>

              {/* Full Name Input */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={attendee.fullName}
                  onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              {/* Mobile Phone Number Input */}
              <div>
                <input
                  type="tel"
                  required
                  placeholder="Mobile Phone Number (e.g. +251 9...)"
                  value={attendee.phoneNumber}
                  onChange={(e) => handleInputChange(index, 'phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Footer Action Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Price
            </span>
            <span className="text-2xl font-black text-slate-900">
              {totalPrice} <span className="text-lg text-blue-600">ETB</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay with Telebirr'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<div className="text-center text-slate-500 font-medium">Loading checkout...</div>}>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}