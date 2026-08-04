'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Share2,
  Check,
  Copy,
  ArrowLeft,
  Maximize2,
  X,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function EventDetailsPage({ params }) {
  // Mock event data (in production, fetch via event ID from Supabase)
  const event = {
    id: 'evt-1',
    title: 'Addis Music Festival 2026',
    category: 'Concert',
    status: 'Available', // Available, Sold Out, Cancelled
    startingPrice: 500, // ETB
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    organizerName: 'Ethio Concerts Ltd.',
    startDate: '2026-08-15',
    startTime: '16:00 PM',
    endTime: '23:30 PM',
    venue: 'Ghion Hotel Grounds',
    city: 'Addis Ababa',
    description: `Experience the biggest musical showcase of the year in Addis Ababa! Addis Music Festival 2026 brings together East Africa's top live bands, legendary vocalists, and world-class electronic DJs for an unforgettable night under the stars. Enjoy premium sound systems, gourmet food trucks, artisan crafts markets, and dedicated VIP lounges.`,
    ticketTypes: [
      { id: 't1', name: 'Regular Admission', price: 500, available: 450, salesEnd: '2026-08-15' },
      { id: 't2', name: 'VIP Experience', price: 1500, available: 85, salesEnd: '2026-08-14' },
      { id: 't3', name: 'VVIP Table (4 Persons)', price: 8000, available: 12, salesEnd: '2026-08-12' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    ],
    similarEvents: [
      {
        id: 'evt-2',
        title: 'Ethio Tech Summit 2026',
        date: '2026-09-02',
        price: 300,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      },
      {
        id: 'evt-3',
        title: 'Addis Comedy Night Live',
        date: '2026-08-20',
        price: 400,
        image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600',
      },
    ]
  };

  // State Management
  const [selectedTicket, setSelectedTicket] = useState(event.ticketTypes[0]);
  const [quantity, setQuantity] = useState(1);
  const [fullscreenImg, setFullscreenImg] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Total Price Calculation
  const totalPrice = selectedTicket.price * quantity;

  // Copy Link Handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-16">
      
      {/* TOP NAVIGATION BAR */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition">
            <ArrowLeft size={16} />
            <span>Back to Events</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <Share2 size={16} />
              <span>Share Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-950 h-72 md:h-[420px]">
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  {event.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  event.status === 'Available' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {event.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">{event.title}</h1>
              <p className="text-xs md:text-sm text-slate-300 flex items-center gap-2 font-medium">
                <MapPin size={16} className="text-blue-400" />
                <span>{event.venue}, {event.city}</span>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Starting From</span>
              <span className="text-xl md:text-2xl font-black text-white">{event.startingPrice} ETB</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: INFO, GALLERY, SIMILAR */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* EVENT INFORMATION CARD */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900">About This Event</h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <Calendar className="text-blue-600" size={20} />
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Date</span>
                  <span className="font-bold text-slate-800">{event.startDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <Clock className="text-blue-600" size={20} />
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Time</span>
                  <span className="font-bold text-slate-800">{event.startTime} - {event.endTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <Building className="text-blue-600" size={20} />
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Organizer</span>
                  <span className="font-bold text-slate-800">{event.organizerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <ShieldCheck className="text-emerald-600" size={20} />
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Ticket Security</span>
                  <span className="font-bold text-slate-800">Verified QR Code</span>
                </div>
              </div>
            </div>
          </div>

          {/* EVENT GALLERY */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900">Event Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {event.gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setFullscreenImg(imgUrl)}
                  className="relative group h-36 rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-slate-200"
                >
                  <img src={imgUrl} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Maximize2 size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMILAR EVENTS */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.similarEvents.map((sim) => (
                <div key={sim.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="h-36 relative">
                      <img src={sim.image} alt={sim.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-sm text-slate-900">{sim.title}</h3>
                      <p className="text-xs text-slate-500">{sim.date} • From {sim.price} ETB</p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/events/${sim.id}`}
                      className="w-full py-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TICKET SELECTOR & CHECKOUT BOX */}
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-20 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900">Select Tickets</h3>
              <Ticket className="text-blue-600" size={20} />
            </div>

            {/* Ticket Types Selection */}
            <div className="space-y-3">
              {event.ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    selectedTicket.id === ticket.id
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-900">{ticket.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{ticket.available} tickets left</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm text-blue-600">{ticket.price} ETB</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Adjuster */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">Quantity</span>
              <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 bg-white rounded-lg font-black text-sm shadow-xs flex items-center justify-center hover:bg-slate-50"
                >
                  -
                </button>
                <span className="font-extrabold text-xs w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-white rounded-lg font-black text-sm shadow-xs flex items-center justify-center hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Calculation */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                <span className="text-xs font-semibold text-slate-600">{quantity}x {selectedTicket.name}</span>
              </div>
              <span className="text-xl font-black text-slate-900">{totalPrice.toLocaleString()} ETB</span>
            </div>

            {/* Buy Ticket Checkout CTA */}
            <button
              onClick={() => alert(`Redirecting to Telebirr checkout for ${totalPrice} ETB`)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Ticket size={18} />
              <span>Proceed to Checkout</span>
            </button>

            <p className="text-[10px] text-center text-slate-400 font-semibold">
              🔒 Secured by Telebirr & YeneTicket Verification
            </p>
          </div>
        </div>

      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {fullscreenImg && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setFullscreenImg(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <X size={24} />
            </button>
            <img src={fullscreenImg} alt="Fullscreen preview" className="w-full max-h-[85vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Share Event</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(event.title)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-blue-50 text-blue-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-100 transition"
              >
                <Send size={16} />
                <span>Telegram</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-indigo-50 text-indigo-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
              >
                {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Event Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}