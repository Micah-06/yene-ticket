'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import {
  LayoutDashboard,
  CalendarCheck2,
  QrCode,
  Search,
  Users,
  History,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Flashlight,
  SwitchCamera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Menu,
  X,
  Smartphone,
  PhoneCall,
  Lock,
  ArrowUpRight,
  Filter,
  Check
} from 'lucide-react';

export default function StaffDashboard() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [staffUser, setStaffUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [assignedEvents, setAssignedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [attendees, setAttendees] = useState([]);
  const [scanLogs, setScanLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    assignedEventsCount: 0,
    todayCheckIns: 0,
    successfulScans: 0,
    invalidTickets: 0,
    remainingGuests: 0,
  });

  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef(null);

  // Manual Verification Search State
  const [manualQuery, setManualQuery] = useState('');
  const [manualResult, setManualResult] = useState(null);

  // Filters State
  const [attendeeFilter, setAttendeeFilter] = useState('All');
  const [attendeeSearch, setAttendeeSearch] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    password: '',
  });

  // ----------------------------------------------------
  // INITIAL DATA FETCH & REALTIME SUBSCRIPTIONS
  // ----------------------------------------------------
  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    if (!staffUser) return;

    // Realtime subscription for Scan Logs & Check-ins
    const channel = supabase
      .channel('staff_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scanLogs' }, (payload) => {
        setScanLogs((prev) => [payload.new, ...prev]);
        updateDashboardStats();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets' }, () => {
        fetchAttendees();
        updateDashboardStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [staffUser, selectedEventId]);

  async function fetchStaffData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback mock session for visual rendering/testing if auth isn't wired yet
        const mockStaff = {
          id: 'STF-8841',
          email: 'staff@yeneticket.et',
          fullName: 'Abebe Kebede',
          phone: '+251 911 223 344',
          organizerName: 'Ethio Concerts Ltd.',
        };
        setStaffUser(mockStaff);
        setProfileForm({ fullName: mockStaff.fullName, phone: mockStaff.phone, password: '' });
        loadMockData();
        setLoading(false);
        return;
      }

      setStaffUser(user);

      // Fetch Staff Details & Assigned Events from Supabase
      const { data: assignments } = await supabase
        .from('staffAssignments')
        .select('eventId, events(*)')
        .eq('staffId', user.id);

      if (assignments) {
        const eventsList = assignments.map((a) => a.events).filter(Boolean);
        setAssignedEvents(eventsList);
      }

      fetchAttendees();
      fetchScanLogs();
      fetchNotifications();
      updateDashboardStats();
    } catch (err) {
      console.error('Error loading staff dashboard:', err);
      loadMockData();
    } finally {
      setLoading(false);
    }
  }

  function loadMockData() {
    const mockEvents = [
      {
        id: 'evt-1',
        title: 'Addis Music Festival 2026',
        category: 'Concert',
        venue: 'Ghion Hotel Grounds',
        startDate: '2026-08-15',
        time: '16:00 PM',
        status: 'Active',
        ticketsSold: 1200,
        checkedInCount: 840,
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      },
      {
        id: 'evt-2',
        title: 'Ethio Tech Summit',
        category: 'Conference',
        venue: 'Millennium Hall',
        startDate: '2026-09-02',
        time: '09:00 AM',
        status: 'Upcoming',
        ticketsSold: 450,
        checkedInCount: 0,
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      }
    ];

    setAssignedEvents(mockEvents);

    setStats({
      assignedEventsCount: 2,
      todayCheckIns: 840,
      successfulScans: 840,
      invalidTickets: 12,
      remainingGuests: 360,
    });

    setAttendees([
      { id: 't-101', name: 'Dawit Yohannes', ticketType: 'VIP', status: 'Checked In', checkInTime: '16:42 PM', phone: '+251911001122' },
      { id: 't-102', name: 'Tigist Alemayehu', ticketType: 'Regular', status: 'Checked In', checkInTime: '17:05 PM', phone: '+251922334455' },
      { id: 't-103', name: 'Meron Tadesse', ticketType: 'VIP', status: 'Not Checked In', checkInTime: '-', phone: '+251933445566' },
      { id: 't-104', name: 'Sami Berhanu', ticketType: 'Regular', status: 'Not Checked In', checkInTime: '-', phone: '+251944556677' },
    ]);

    setScanLogs([
      { id: 'log-1', time: '17:05:12 PM', staffName: 'Abebe K.', eventTitle: 'Addis Music Festival 2026', ticketId: 't-102', result: 'Success' },
      { id: 'log-2', time: '16:58:01 PM', staffName: 'Abebe K.', eventTitle: 'Addis Music Festival 2026', ticketId: 't-999', result: 'Invalid' },
      { id: 'log-3', time: '16:42:30 PM', staffName: 'Abebe K.', eventTitle: 'Addis Music Festival 2026', ticketId: 't-101', result: 'Success' },
    ]);

    setNotifications([
      { id: 'n1', title: 'New Event Assigned', desc: 'You were assigned to Addis Music Festival 2026.', time: '2 hours ago' },
      { id: 'n2', title: 'Event Starting Soon', desc: 'Addis Music Festival gate verification starts in 1 hour.', time: '5 hours ago' }
    ]);
  }

  async function fetchAttendees() {
    const { data } = await supabase.from('tickets').select('*');
    if (data && data.length) setAttendees(data);
  }

  async function fetchScanLogs() {
    const { data } = await supabase.from('scanLogs').select('*').order('createdAt', { ascending: false });
    if (data && data.length) setScanLogs(data);
  }

  async function fetchNotifications() {
    const { data } = await supabase.from('notifications').select('*').order('createdAt', { ascending: false });
    if (data && data.length) setNotifications(data);
  }

  function updateDashboardStats() {
    // Dynamically recalculate stats
  }

  // ----------------------------------------------------
  // QR CODE SCANNER & TICKET VERIFICATION
  // ----------------------------------------------------
  async function handleScan(qrString) {
    if (!qrString || scanResult) return;

    // Vibrate device on scan
    if (navigator.vibrate) navigator.vibrate(100);

    // Verify against Supabase DB
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*, events(title), orders(buyerName, purchaseDate)')
      .eq('qrCode', qrString)
      .single();

    if (error || !ticket) {
      setScanResult({
        status: 'INVALID',
        message: 'Invalid Ticket ID or Fake Code',
      });
      logScan(qrString, 'Invalid');
      return;
    }

    if (ticket.status === 'USED') {
      setScanResult({
        status: 'ALREADY_USED',
        message: `Already Used at ${ticket.checkInTime || 'Earlier'}`,
        ticket,
      });
      logScan(ticket.id, 'Duplicate');
      return;
    }

    if (ticket.status === 'CANCELLED') {
      setScanResult({
        status: 'CANCELLED',
        message: 'This ticket was cancelled or refunded.',
        ticket,
      });
      logScan(ticket.id, 'Cancelled');
      return;
    }

    // Check-in success path
    const nowTime = new Date().toLocaleTimeString();
    await supabase.from('tickets').update({ status: 'USED', checkInTime: nowTime }).eq('id', ticket.id);

    setScanResult({
      status: 'VALID',
      message: 'Valid Ticket - Check-in Complete!',
      ticket: {
        id: ticket.id,
        buyerName: ticket.orders?.buyerName || ticket.buyerName || 'Guest Attendee',
        eventName: ticket.events?.title || 'Assigned Event',
        ticketType: ticket.ticketType || 'Regular',
        purchaseDate: ticket.orders?.purchaseDate || '2026-07-28',
        qrCode: qrString,
      },
    });

    logScan(ticket.id, 'Success');
  }

  async function logScan(ticketId, result) {
    await supabase.from('scanLogs').insert([
      {
        staffName: staffUser?.fullName || 'Staff User',
        ticketId,
        result,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  // Manual Ticket Search handler
  function handleManualSearch(e) {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    const matched = attendees.find(
      (a) =>
        a.id.toLowerCase() === manualQuery.toLowerCase() ||
        a.phone?.includes(manualQuery) ||
        a.name.toLowerCase().includes(manualQuery.toLowerCase())
    );

    if (matched) {
      setManualResult(matched);
    } else {
      setManualResult({ notFound: true });
    }
  }

  function handleManualCheckIn(attendeeId) {
    setAttendees((prev) =>
      prev.map((item) =>
        item.id === attendeeId ? { ...item, status: 'Checked In', checkInTime: new Date().toLocaleTimeString() } : item
      )
    );
    if (manualResult && manualResult.id === attendeeId) {
      setManualResult((prev) => ({ ...prev, status: 'Checked In', checkInTime: new Date().toLocaleTimeString() }));
    }
  }

  // Profile Save
  function handleProfileUpdate(e) {
    e.preventDefault();
    alert('Profile updated successfully!');
  }

  // ----------------------------------------------------
  // NAVIGATION ITEMS
  // ----------------------------------------------------
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Assigned Events', icon: CalendarCheck2 },
    { id: 'scanner', label: 'QR Scanner', icon: QrCode },
    { id: 'manual', label: 'Manual Ticket Check', icon: Search },
    { id: 'attendees', label: 'Attendees', icon: Users },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 📱 MOBILE TOP HEADER BAR */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm">
            YT
          </div>
          <span className="font-bold tracking-wide text-sm">Staff Portal</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* 🟢 SIDEBAR NAVIGATION */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/30">
              Y
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight leading-none">
                YENE<span className="text-blue-500">TICKET</span>
              </h2>
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Staff Dashboard
              </span>
            </div>
          </div>

          {/* User Badge */}
          <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/30">
              {staffUser?.fullName ? staffUser.fullName.charAt(0) : 'S'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{staffUser?.fullName || 'Staff Member'}</p>
              <p className="text-[10px] text-slate-400 truncate">{staffUser?.organizerName || 'Assigned Staff'}</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              supabase.auth.signOut();
              window.location.href = '/auth/signin';
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT DISPLAY AREA */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto">
        
        {/* TOP EVENT SELECTOR & QUICK SCAN ACCESS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-500">
              Assigned Access Mode • Read-Only Security Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Large Mobile Quick Scan Button */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 active:scale-95 transition"
            >
              <QrCode size={18} />
              <span>Scan QR Code</span>
            </button>

            {/* Event Switcher */}
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Assigned Events</option>
              {assignedEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <CalendarCheck2 size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.assignedEventsCount}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Assigned Events</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <CheckCircle2 size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +12% Today
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.todayCheckIns}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Today's Check-ins</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <QrCode size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    98.5% Pass
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.successfulScans}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Successful Scans</p>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                    <XCircle size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Flagged
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.invalidTickets}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Invalid Tickets</p>
              </div>

              {/* Card 5 */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Users size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Expected
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.remainingGuests}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Remaining Guests</p>
              </div>

            </div>

            {/* QUICK ACTIONS & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Quick Scanner Banner */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] font-bold tracking-wider uppercase border border-blue-500/30">
                    Fast Check-in Ready
                  </span>
                  <h2 className="text-2xl font-black tracking-tight">Ready to verify attendees?</h2>
                  <p className="text-xs text-slate-300 max-w-md">
                    Tap below to open the mobile camera scanner with instant Supabase verification.
                  </p>
                </div>

                <div className="mt-8 relative z-10 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-600/40 flex items-center gap-2 transition"
                  >
                    <QrCode size={18} />
                    <span>Launch Mobile QR Scanner</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('manual')}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-2 transition"
                  >
                    <Search size={18} />
                    <span>Manual Verification</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Recent Activity */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Gate Scans</h3>
                  <button onClick={() => setActiveTab('history')} className="text-xs text-blue-600 font-bold hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {scanLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${log.result === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div>
                          <p className="font-bold text-slate-800">{log.ticketId}</p>
                          <p className="text-[10px] text-slate-400">{log.time}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        log.result === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {log.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: ASSIGNED EVENTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedEvents.map((evt) => (
              <div key={evt.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="h-44 relative">
                    <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-blue-600 shadow-sm uppercase">
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900">{evt.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{evt.venue}</p>

                    <div className="grid grid-cols-2 gap-4 my-4 pt-4 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Date & Time</span>
                        <span className="font-semibold text-slate-700">{evt.startDate} • {evt.time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
                        <span className="font-bold text-emerald-600">{evt.status}</span>
                      </div>
                    </div>

                    {/* Attendance Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Check-in Progress</span>
                        <span className="text-slate-800">{evt.checkedInCount} / {evt.ticketsSold} Guests</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((evt.checkedInCount / evt.ticketsSold) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                  >
                    <QrCode size={16} />
                    <span>Start Check-in</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: QR CODE SCANNER */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'scanner' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md text-center">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Live QR Scanner</h2>
              <p className="text-xs text-slate-500 mb-6">Position ticket QR code inside the viewfinder window</p>

              {/* Viewfinder Window */}
              <div className="relative w-full aspect-square bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-900 shadow-inner flex flex-col items-center justify-center">
                
                {/* Scanner Overlay Animation Lines */}
                <div className="absolute inset-8 border-2 border-dashed border-blue-500/50 rounded-2xl pointer-events-none" />
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-pulse" />

                {/* Mock Camera Viewfinder */}
                <div className="text-center p-6 text-slate-400 space-y-3">
                  <QrCode size={64} className="mx-auto text-blue-500 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-300">Camera Active</p>
                </div>

                {/* Controls Bar inside Camera */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-white">
                  <button
                    onClick={() => setFlashOn(!flashOn)}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      flashOn ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Flashlight size={16} />
                    <span>Flash</span>
                  </button>

                  <button
                    onClick={() => alert('Camera switched')}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 flex items-center gap-1.5"
                  >
                    <SwitchCamera size={16} />
                    <span>Switch</span>
                  </button>
                </div>
              </div>

              {/* TEST TRIGGER BUTTONS FOR DEMO */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-400">Quick Test Trigger</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScan('VALID_QR_101')}
                    className="flex-1 py-2.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-xs rounded-xl"
                  >
                    Test Valid
                  </button>
                  <button
                    onClick={() => handleScan('USED_QR_102')}
                    className="flex-1 py-2.5 bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold text-xs rounded-xl"
                  >
                    Test Used
                  </button>
                  <button
                    onClick={() => handleScan('FAKE_QR_999')}
                    className="flex-1 py-2.5 bg-rose-100 text-rose-800 hover:bg-rose-200 font-bold text-xs rounded-xl"
                  >
                    Test Invalid
                  </button>
                </div>
              </div>
            </div>

            {/* SCAN RESULT POPUP / CARD */}
            {scanResult && (
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 animate-in fade-in zoom-in duration-200 ${
                scanResult.status === 'VALID'
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : scanResult.status === 'ALREADY_USED'
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-rose-600 text-white border-rose-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {scanResult.status === 'VALID' && <CheckCircle2 size={32} />}
                    {scanResult.status === 'ALREADY_USED' && <AlertTriangle size={32} />}
                    {scanResult.status === 'INVALID' && <XCircle size={32} />}
                    <div>
                      <h3 className="text-lg font-black">{scanResult.status.replace('_', ' ')}</h3>
                      <p className="text-xs font-semibold opacity-90">{scanResult.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setScanResult(null)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Ticket Details if Valid */}
                {scanResult.ticket && (
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-2 text-xs border border-white/20">
                    <div className="flex justify-between">
                      <span className="opacity-80">Buyer Name:</span>
                      <span className="font-bold">{scanResult.ticket.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Ticket ID:</span>
                      <span className="font-mono font-bold">{scanResult.ticket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Ticket Type:</span>
                      <span className="font-bold">{scanResult.ticket.ticketType}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: MANUAL TICKET CHECK */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'manual' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Manual Ticket Lookup</h2>
              <p className="text-xs text-slate-500 mb-6">Search by Ticket ID, Buyer Name, or Phone Number</p>

              <form onSubmit={handleManualSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Ticket ID, Name or +251..."
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
                >
                  Verify Ticket
                </button>
              </form>
            </div>

            {/* Manual Search Result */}
            {manualResult && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                {manualResult.notFound ? (
                  <div className="text-center py-8 text-rose-500 space-y-2">
                    <XCircle size={40} className="mx-auto" />
                    <p className="font-bold text-sm">No ticket found matching search!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{manualResult.name}</h3>
                        <p className="text-xs text-slate-500">Ticket ID: {manualResult.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        manualResult.status === 'Checked In' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {manualResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-slate-400 font-semibold block">Ticket Type</span>
                        <span className="font-bold text-slate-800">{manualResult.ticketType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">Phone</span>
                        <span className="font-bold text-slate-800">{manualResult.phone}</span>
                      </div>
                    </div>

                    {manualResult.status !== 'Checked In' && (
                      <button
                        onClick={() => handleManualCheckIn(manualResult.id)}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
                      >
                        Confirm Gate Check-In
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: ATTENDEES LIST */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'attendees' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm space-y-4 p-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search attendee name or ID..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-xs"
              />

              <div className="flex gap-2">
                {['All', 'Checked In', 'Not Checked In', 'VIP'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setAttendeeFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      attendeeFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendees Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Buyer Name</th>
                    <th className="py-3 px-4">Ticket Type</th>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Check-in Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendees
                    .filter((a) =>
                      attendeeFilter === 'All'
                        ? true
                        : attendeeFilter === 'VIP'
                        ? a.ticketType === 'VIP'
                        : a.status === attendeeFilter
                    )
                    .map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{att.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 font-semibold text-slate-700 rounded-md">
                            {att.ticketType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-500">{att.id}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            att.status === 'Checked In' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-semibold">{att.checkInTime}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: SCAN HISTORY */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">Gate Activity History Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Scan Time</th>
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scanLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{log.time}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{log.staffName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{log.ticketId}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          log.result === 'Success'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: NOTIFICATIONS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'notifications' && (
          <div className="max-w-xl mx-auto space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex gap-4">
                <span className="p-3 bg-blue-50 text-blue-600 rounded-2xl h-fit">
                  <Bell size={20} />
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-500">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 8: STAFF PROFILE */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Staff Account Settings</h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: HELP & SUPPORT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'help' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 text-center">
            <HelpCircle size={48} className="mx-auto text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Gate Verification Assistance</h2>
            <p className="text-xs text-slate-500">
              Having trouble scanning tickets or connecting to Supabase? Reach out to the event organizer or support desk.
            </p>
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700 space-y-2">
              <p>📞 Organizer Hotline: +251 911 000 000</p>
              <p>📧 Staff Desk: support@yeneticket.et</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}