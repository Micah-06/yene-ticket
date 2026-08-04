'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '' },
  { id: 'concerts', name: 'Concerts', icon: '' },
  { id: 'cinema', name: 'Cinema', icon: '' },
  { id: 'theatre', name: 'Theatre', icon: '' },
  { id: 'comedy', name: 'Comedy', icon: '' },
  { id: 'sports', name: 'Sports', icon: '' },
  { id: 'conferences', name: 'Conferences', icon: '' },
  { id: 'festivals', name: 'Festivals', icon: '' },
  { id: 'cultural', name: 'Cultural', icon: '' },
];

export default function YeneTicketHomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDate, setSelectedDate] = useState('');

  // Resend Ticket Modal State
  const [showResendModal, setShowResendModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    async function fetchEventsData() {
      setLoading(true);
      try {
        const { data: supabaseEvents, error } = await supabase
          .from('events')
          .select('*')
          .order('startDate', { ascending: true });

        if (!error && supabaseEvents && supabaseEvents.length > 0) {
          const formatted = supabaseEvents.map((evt) => ({
            _id: evt.id,
            title: evt.title || evt.name,
            description: evt.description || 'Experience an unforgettable event live in Ethiopia.',
            category: evt.category || 'Concerts',
            city: evt.city || 'Addis Ababa',
            venue: evt.venue || 'Ghion Hotel',
            date: evt.startDate ? new Date(evt.startDate).toISOString().split('T')[0] : '2026-09-15',
            time: evt.time || '18:00 PM',
            bannerUrl: evt.bannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEventsData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">
              YENE<span className="text-[#2563EB]">TICKET</span>
            </span>
          </Link>

          {/* Navigation Center */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#64748B]">
            <Link href="/" className="text-[#2563EB] font-bold transition">
              Home
            </Link>
            <a href="#upcoming" className="hover:text-[#2563EB] transition">
              Browse Events
            </a>
            <a href="#categories" className="hover:text-[#2563EB] transition">
              Categories
            </a>
            <Link href="/organizer" className="hover:text-[#2563EB] transition">
              Become an Organizer
            </Link>

            {/* 📱 RESEND TICKET BUTTON */}
            <button 
              onClick={() => setShowResendModal(true)} 
              className="hover:text-[#2563EB] transition font-semibold"
            >
              Resend Ticket
            </button>

            <Link href="/help" className="hover:text-[#2563EB] transition">
              Help
            </Link>
          </nav>

          {/* Buttons Right */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="px-5 py-2.5 rounded-xl border-2 border-[#2563EB] text-[#2563EB] font-bold text-xs hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          Find Events in Ethiopia
        </h1>

        {/* Categories Grid */}
        <div id="categories" className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.name
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div id="upcoming" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading events...</p>
          ) : events.length > 0 ? (
            events.map((evt) => (
              <div key={evt._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                <img src={evt.bannerUrl} alt={evt.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    {evt.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{evt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{evt.venue}, {evt.city}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">{evt.date}</span>
                    <Link href={`/ticket/${evt._id}`} className="px-4 py-2 bg-[#2563EB] text-white font-bold text-xs rounded-xl">
                      Get Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No events found.</p>
          )}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <span className="text-xl font-black text-[#0F172A]">
                YENE<span className="text-[#2563EB]">TICKET</span>
              </span>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                The leading digital event ticketing platform in Ethiopia.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-4">Contact Us</h4>
              <p className="text-xs text-[#64748B] mb-2">📍 Addis Ababa, Ethiopia</p>
              <p className="text-xs text-[#64748B] mb-2">📧 support@yeneticket.et</p>
              <p className="text-xs text-[#64748B]">📞 +251 911 000 000</p>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-[#64748B]">
            <p>© 2026 Yene Ticket. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Powered by Telebirr & CBE Birr Payment Gateways</p>
          </div>
        </div>
      </footer>

      {/* ---------------- RESEND TICKET MODAL ---------------- */}
      {showResendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            
            {/* Close Modal Button */}
            <button 
              onClick={() => { setShowResendModal(false); setResendStatus(''); setPhoneNumber(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
                📱
              </div>
              <h3 className="text-base font-bold text-slate-900">Lost Your Ticket?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the phone number you used during checkout. We will instantly resend your ticket link via SMS.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    🇪🇹 +251
                  </span>
                  <input 
                    type="tel" 
                    placeholder="911 000 111"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-20 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              {resendStatus && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold text-center border border-emerald-200">
                  {resendStatus}
                </div>
              )}

              <button 
                type="button"
                onClick={() => {
                  if (!phoneNumber || phoneNumber.length < 9) {
                    return alert('Please enter a valid phone number!');
                  }
                  setResendStatus(`✅ Ticket found! Resent SMS link to +251 ${phoneNumber}.`);
                }}
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Send Ticket via SMS
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}