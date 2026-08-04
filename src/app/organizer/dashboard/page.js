'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock Data pre-populated for design verification
const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'Great Ethiopian Music Fest 2026',
    category: 'Concerts',
    venue: 'Ghion Hotel, Addis Ababa',
    city: 'Addis Ababa',
    date: '2026-09-15',
    time: '18:00',
    status: 'Published',
    ticketsSold: 420,
    totalTickets: 500,
    price: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
  },
  {
    id: '2',
    title: 'Ethiopian Tech Summit 2026',
    category: 'Conferences',
    venue: 'Millennium Hall, Addis Ababa',
    city: 'Addis Ababa',
    date: '2026-10-10',
    time: '09:00',
    status: 'Sold Out',
    ticketsSold: 300,
    totalTickets: 300,
    price: 350,
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  }
];

const INITIAL_STAFF = [
  { id: 'st_1', name: 'Abebe Kebede', phone: '+251 911 223 344', email: 'abebe@yeneticket.et', event: 'Great Ethiopian Music Fest 2026', role: 'QR Scanner', status: 'Active' },
  { id: 'st_2', name: 'Tigist Haile', phone: '+251 922 556 677', email: 'tigist@yeneticket.et', event: 'Ethiopian Tech Summit 2026', role: 'Manual Ticket Check', status: 'Active' }
];

const INITIAL_ATTENDEES = [
  { id: 'att_1', name: 'Mulugeta Tadesse', type: 'VIP', ticketId: 'YT-882910', payStatus: 'Paid', checkinStatus: 'Checked In', date: '2026-07-28' },
  { id: 'att_2', name: 'Bethlehem Assefa', type: 'Regular', ticketId: 'YT-993012', payStatus: 'Paid', checkinStatus: 'Not Checked In', date: '2026-07-30' }
];

const INITIAL_PAYOUTS = [
  { id: 'po_1', event: 'Great Ethiopian Music Fest 2026', gross: 210000, fee: 10500, net: 199500, status: 'Paid', date: '2026-07-25' },
  { id: 'po_2', event: 'Ethiopian Tech Summit 2026', gross: 105000, fee: 5250, net: 99750, status: 'Processing', date: '2026-08-01' }
];

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
// States
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [attendees, setAttendees] = useState(INITIAL_ATTENDEES);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    businessName: 'Yene Events PLC',
    email: 'organizer@yeneticket.et',
    phone: '+251 911 000 111',
    holderName: 'Yene Events PLC',
    bankName: 'Commercial Bank of Ethiopia (CBE)',
    accountNumber: '1000123456789'
  });

  // Form States
  const [newEvent, setNewEvent] = useState({
    title: '', 
    category: 'Concerts', 
    description: '', 
    bannerUrl: '', 
    city: 'Addis Ababa',
    venue: '', 
    date: '', 
    startTime: '', 
    endTime: '', 
    terms: '',
    regularPrice: 500,
    regularTickets: 200,
    vipPrice: 1500,
    vipTickets: 50
  });

  const [newStaff, setNewStaff] = useState({
    name: '', phone: '', email: '', event: '', role: 'QR Scanner'
  });

  const [searchAttendee, setSearchAttendee] = useState('');

  // Badge Color Helper
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Published':
      case 'Paid':
      case 'Active':
      case 'Checked In':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sold Out':
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Draft':
      case 'Pending':
      case 'Not Checked In':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Cancelled':
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  // Actions
  const handleCreateEvent = (e) => {
    e.preventDefault();
    const created = {
      ...newEvent,
      id: Date.now().toString(),
      status: 'Published',
      ticketsSold: 0,
      bannerUrl: newEvent.bannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    };
    setEvents([created, ...events]);
    alert('Event created and published successfully!');
    setActiveTab('My Events');
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    setStaffList([...staffList, { ...newStaff, id: Date.now().toString(), status: 'Active' }]);
    setNewStaff({ name: '', phone: '', email: '', event: '', role: 'QR Scanner' });
    alert('Staff assigned successfully!');
  };

  const handleToggleStatus = (id) => {
    setEvents(events.map(evt => {
      if (evt.id === id) {
        const nextStatus = evt.status === 'Published' ? 'Draft' : 'Published';
        return { ...evt, status: nextStatus };
      }
      return evt;
    }));
  };

  const handleDeleteEvent = (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 font-sans">
      
      {/* ---------------- SIDEBAR NAVIGATION ---------------- */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 z-40 flex flex-col justify-between ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex sticky top-0 h-screen`}>
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                Y
              </div>
              <div>
                <span className="font-black text-slate-900 tracking-tight block leading-none">Yene Ticket</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Organizer Portal</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs">
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {[
              { name: 'Dashboard', icon: '📊' },
              { name: 'My Events', icon: '🎟️' },
              { name: 'Create Event', icon: '➕' },
              { name: 'Ticket Sales', icon: '💳' },
              { name: 'Staff Management', icon: '👥' },
              { name: 'Attendees', icon: '📋' },
              { name: 'Analytics', icon: '📈' },
              { name: 'Payouts', icon: '💰' },
              { name: 'Notifications', icon: '🔔' },
              { name: 'Settings', icon: '⚙️' },
              { name: 'Help Center', icon: '❓' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === item.name
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <Link href="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition">
            <span className="text-base">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* ---------------- MOBILE BOTTOM NAVIGATION ---------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 text-[10px] font-bold text-slate-600">
        <button onClick={() => setActiveTab('Dashboard')} className={`flex flex-col items-center ${activeTab === 'Dashboard' && 'text-blue-600'}`}>
          <span>📊</span> Summary
        </button>
        <button onClick={() => setActiveTab('My Events')} className={`flex flex-col items-center ${activeTab === 'My Events' && 'text-blue-600'}`}>
          <span>🎟️</span> Events
        </button>
        <button onClick={() => setActiveTab('Create Event')} className={`flex flex-col items-center ${activeTab === 'Create Event' && 'text-blue-600'}`}>
          <span>➕</span> Create
        </button>
        <button onClick={() => setActiveTab('Attendees')} className={`flex flex-col items-center ${activeTab === 'Attendees' && 'text-blue-600'}`}>
          <span>📋</span> Attendees
        </button>
        <button onClick={() => setActiveTab('Settings')} className={`flex flex-col items-center ${activeTab === 'Settings' && 'text-blue-600'}`}>
          <span>⚙️</span> Settings
        </button>
      </div>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full mb-16 md:mb-0">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your events, staff, tickets, and revenue payouts</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('Create Event')} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition">
              + New Event
            </button>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              YT
            </div>
          </div>
        </header>

        {/* ---------------- DASHBOARD OVERVIEW TAB ---------------- */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Gross Revenue</span>
                <div className="text-2xl font-black text-slate-900 mt-2">ETB 315,000</div>
                <span className="text-[11px] font-semibold text-emerald-600">↑ 18% from last month</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Tickets Sold</span>
                <div className="text-2xl font-black text-slate-900 mt-2">720 / 800</div>
                <span className="text-[11px] font-semibold text-blue-600">90% Capacity</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Payouts Received</span>
                <div className="text-2xl font-black text-slate-900 mt-2">ETB 199,500</div>
                <span className="text-[11px] font-semibold text-emerald-600">Paid out</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Staff</span>
                <div className="text-2xl font-black text-slate-900 mt-2">{staffList.length} Members</div>
                <span className="text-[11px] font-semibold text-slate-500">Across active events</span>
              </div>
            </div>

            {/* Performance List */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Event Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <img src={evt.bannerUrl} alt={evt.title} className="h-40 w-full object-cover" />
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{evt.category}</span>
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border ${getBadgeStyle(evt.status)}`}>
                            {evt.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{evt.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">📍 {evt.venue}</p>
                        <p className="text-xs text-slate-500 mt-0.5">📅 {evt.date} • {evt.time}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block">Tickets Sold</span>
                          <span className="text-sm font-black text-slate-900">{evt.ticketsSold} / {evt.totalTickets}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleToggleStatus(evt.id)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition">
                            {evt.status === 'Published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button onClick={() => handleDeleteEvent(evt.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold rounded-lg transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MY EVENTS TAB ---------------- */}
        {activeTab === 'My Events' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900">All Created Events</h2>
              <button onClick={() => setActiveTab('Create Event')} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl">
                + Create Event
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Tickets Sold</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 font-medium">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{evt.title}</td>
                      <td className="py-3 px-4 text-slate-600">{evt.category}</td>
                      <td className="py-3 px-4 text-slate-600">{evt.date}</td>
                      <td className="py-3 px-4 text-slate-900">{evt.ticketsSold} / {evt.totalTickets}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">ETB {evt.ticketsSold * evt.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getBadgeStyle(evt.status)}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => handleToggleStatus(evt.id)} className="text-blue-600 font-bold hover:underline">
                          {evt.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDeleteEvent(evt.id)} className="text-rose-600 font-bold hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- CREATE EVENT TAB ---------------- */}
        {activeTab === 'Create Event' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title</label>
                <input required type="text" placeholder="e.g. Addis Music Festival 2026" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600">
                    {['Concerts', 'Cinema', 'Theatre', 'Comedy', 'Sports', 'Conferences', 'Festivals', 'Cultural'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Banner Image URL</label>
                  <input type="url" placeholder="https://..." value={newEvent.bannerUrl} onChange={e => setNewEvent({...newEvent, bannerUrl: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea rows="3" placeholder="Provide details about the event..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                  <input type="text" value={newEvent.city} onChange={e => setNewEvent({...newEvent, city: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Venue Name</label>
                  <input required type="text" placeholder="e.g. Ghion Hotel" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Date</label>
                  <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Time</label>
                  <input required type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">End Time</label>
                  <input type="time" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              {/* ---------------- TICKET TYPES & PRICING ---------------- */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Ticket Types & Pricing
          </h3>

          {/* Regular Ticket Tier */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              🏷️ Regular Ticket
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Price (ETB)</label>
                <input 
                  type="number" 
                  value={newEvent.regularPrice} 
                  onChange={(e) => setNewEvent({ ...newEvent, regularPrice: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Total Quantity</label>
                <input 
                  type="number" 
                  value={newEvent.regularTickets} 
                  onChange={(e) => setNewEvent({ ...newEvent, regularTickets: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* VIP Ticket Tier */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-3">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-2">
              ⭐ VIP Ticket
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Price (ETB)</label>
                <input 
                  type="number" 
                  value={newEvent.vipPrice} 
                  onChange={(e) => setNewEvent({ ...newEvent, vipPrice: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Total Quantity</label>
                <input 
                  type="number" 
                  value={newEvent.vipTickets} 
                  onChange={(e) => setNewEvent({ ...newEvent, vipTickets: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
                Publish Event
              </button>
            </form>
          </div>
        )}

        {/* ---------------- STAFF MANAGEMENT TAB ---------------- */}
        {activeTab === 'Staff Management' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Assign Staff Member</h2>
              <form onSubmit={handleAddStaff} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input required type="text" placeholder="Staff Name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl text-xs" />
                <input required type="tel" placeholder="Phone (+251...)" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl text-xs" />
                <input required type="email" placeholder="Email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl text-xs" />
                <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} className="px-3 py-2 border border-slate-300 rounded-xl text-xs">
                  <option value="QR Scanner">QR Scanner</option>
                  <option value="Manual Ticket Check">Manual Ticket Check</option>
                  <option value="Check-in Only">Check-in Only</option>
                </select>
                <button type="submit" className="py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700">
                  + Add Staff
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">Assigned Staff List</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Permission Role</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-100">
                    {staffList.map(s => (
                      <tr key={s.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 text-slate-600">{s.phone} <br/><span className="text-[10px] text-slate-400">{s.email}</span></td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{s.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getBadgeStyle(s.status)}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ATTENDEES TAB ---------------- */}
        {activeTab === 'Attendees' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-base font-bold text-slate-900">Registered Attendees</h2>
              <input
                type="text"
                placeholder="Search by Ticket ID or Name..."
                value={searchAttendee}
                onChange={e => setSearchAttendee(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs w-full sm:w-64"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Buyer Name</th>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Check-in Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {attendees
                    .filter(a => a.name.toLowerCase().includes(searchAttendee.toLowerCase()) || a.ticketId.toLowerCase().includes(searchAttendee.toLowerCase()))
                    .map(att => (
                      <tr key={att.id}>
                        <td className="py-3 px-4 font-bold text-slate-900">{att.name}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{att.ticketId}</td>
                        <td className="py-3 px-4 text-slate-600">{att.type}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getBadgeStyle(att.payStatus)}`}>{att.payStatus}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getBadgeStyle(att.checkinStatus)}`}>{att.checkinStatus}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- PAYOUTS TAB ---------------- */}
        {activeTab === 'Payouts' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-6">Revenue & Payout History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400">
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">Platform Fee (5%)</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {payouts.map(po => (
                    <tr key={po.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{po.event}</td>
                      <td className="py-3 px-4 text-slate-600">ETB {po.gross.toLocaleString()}</td>
                      <td className="py-3 px-4 text-rose-600">- ETB {po.fee.toLocaleString()}</td>
                      <td className="py-3 px-4 font-black text-emerald-600">ETB {po.net.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${getBadgeStyle(po.status)}`}>{po.status}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{po.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

    {/* ---------------- SETTINGS TAB ---------------- */}
{activeTab === 'Settings' && (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
    <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
      Organizer Profile & Payment Details
    </h2>
    
    <div className="space-y-4">
      {/* Business & Profile Info */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Business Name</label>
        <input 
          type="text" 
          defaultValue="Yene Events PLC" 
          className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
          <input 
            type="email" 
            defaultValue="organizer@yeneticket.et" 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
          <input 
            type="tel" 
            defaultValue="+251 911 000 111" 
            className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>
      </div>

      <hr className="border-slate-100 my-4" />

      {/* NEW BANK PAYOUT SECTION (Replaces Telebirr) */}
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
        Bank Transfer Payout Details
      </h3>

      {/* 1. Holder Name */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">1. Holder Name</label>
        <input 
          type="text" 
          placeholder="Enter Account Holder Name" 
          value={bankDetails.holderName} 
          onChange={(e) => setBankDetails({ ...bankDetails, holderName: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 2. Bank Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">2. Bank Name</label>
          <select 
            value={bankDetails.bankName} 
            onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
            <option value="Bank of Abyssinia">Bank of Abyssinia</option>
            <option value="Awash Bank">Awash Bank</option>
            <option value="Dashen Bank">Dashen Bank</option>
            <option value="Cooperative Bank of Oromia">Cooperative Bank of Oromia</option>
            <option value="Hibret Bank">Hibret Bank</option>
            <option value="Zemen Bank">Zemen Bank</option>
          </select>
        </div>

        {/* 3. Bank Account Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">3. Bank Account Number</label>
          <input 
            type="text" 
            placeholder="1000XXXXXXXXX" 
            value={bankDetails.accountNumber} 
            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600" 
          />
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => alert('Bank Settings Saved Successfully!')} 
        className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-700 transition mt-4"
      >
        Save Settings
      </button>
    </div>
  </div>
)}</main>
    </div>
  );
}
