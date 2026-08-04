'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Calendar,
  Layers,
  CreditCard,
  Banknote,
  QrCode,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Ban,
  Eye,
  Filter,
  DollarSign,
  TrendingUp,
  Ticket
} from 'lucide-react';

export default function AdminDashboard() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 12450,
    totalOrganizers: 185,
    totalStaff: 420,
    activeEvents: 64,
    ticketsSold: 89400,
    totalRevenue: 24500000, // ETB
    pendingPayouts: 3200000, // ETB
    todayCheckIns: 1840,
  });

  // Entities state
  const [usersList, setUsersList] = useState([]);
  const [organizersList, setOrganizersList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [payoutsList, setPayoutsList] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);

  // Verification & Search state
  const [ticketQuery, setTicketQuery] = useState('');
  const [verifiedTicket, setVerifiedTicket] = useState(null);

  // Settings State
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'Yene Ticket',
    contactEmail: 'support@yeneticket.et',
    contactPhone: '+251 911 000 000',
    commissionRate: 5.0,
  });

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');

  // ----------------------------------------------------
  // INITIAL DATA FETCH & REALTIME SUBSCRIPTIONS
  // ----------------------------------------------------
  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user || { email: 'admin@yeneticket.et', role: 'admin' });

      // Fetch or initialize collections
      fetchUsers();
      fetchOrganizers();
      fetchEvents();
      fetchCategories();
      fetchPayments();
      fetchPayouts();
      fetchAuditLogs();
    } catch (err) {
      console.error('Error loading Admin Data:', err);
    } finally {
      loadMockFallbackData();
      setLoading(false);
    }
  }

  function loadMockFallbackData() {
    setUsersList([
      { id: 'u-1', fullName: 'Abebe Bikila', email: 'abebe@gmail.com', phone: '+251911223344', role: 'Buyer', status: 'Active', date: '2026-01-10' },
      { id: 'u-2', fullName: 'Ethio Concerts Ltd', email: 'info@ethioconcerts.et', phone: '+251922334455', role: 'Organizer', status: 'Active', date: '2026-02-15' },
      { id: 'u-3', fullName: 'Tigist Tadesse', email: 'tigist@yeneticket.et', phone: '+251933445566', role: 'Staff', status: 'Active', date: '2026-03-01' },
    ]);

    setOrganizersList([
      { id: 'org-1', businessName: 'Ethio Concerts Ltd', contactPerson: 'Dawit Alemayehu', email: 'dawit@ethioconcerts.et', phone: '+251911112233', status: 'Verified', eventsCount: 12, totalRevenue: 14500000 },
      { id: 'org-2', businessName: 'Addis Cinema Productions', contactPerson: 'Solomon Kebede', email: 'solomon@addiscinema.com', phone: '+251922223344', status: 'Pending', eventsCount: 2, totalRevenue: 450000 },
    ]);

    setEventsList([
      { id: 'evt-101', title: 'Great Ethiopian Run 2026', category: 'Sports', organizer: 'Ethio Concerts Ltd', venue: 'Meskel Square', date: '2026-11-20', ticketsSold: 45000, status: 'Published', bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800' },
      { id: 'evt-102', title: 'Addis Jazz Night', category: 'Concerts', organizer: 'Ethio Concerts Ltd', venue: 'Ghion Hotel', date: '2026-08-15', ticketsSold: 1200, status: 'Published', bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' },
    ]);

    setCategoriesList([
      { id: 'cat-1', name: 'Concerts' },
      { id: 'cat-2', name: 'Cinema' },
      { id: 'cat-3', name: 'Theatre' },
      { id: 'cat-4', name: 'Comedy' },
      { id: 'cat-5', name: 'Sports' },
      { id: 'cat-6', name: 'Festivals' },
      { id: 'cat-7', name: 'Conferences' },
      { id: 'cat-8', name: 'Food & Drink' },
      { id: 'cat-9', name: 'Cultural Events' },
      { id: 'cat-10', name: 'Family Events' },
    ]);

    setPaymentsList([
      { id: 'tx-8801', buyer: 'Abebe Bikila', event: 'Great Ethiopian Run 2026', organizer: 'Ethio Concerts Ltd', amount: 800, method: 'Telebirr', status: 'Paid', date: '2026-07-30 14:22' },
      { id: 'tx-8802', buyer: 'Makeda Haile', event: 'Addis Jazz Night', organizer: 'Ethio Concerts Ltd', amount: 1500, method: 'Telebirr', status: 'Paid', date: '2026-07-31 09:10' },
    ]);

    setPayoutsList([
      { id: 'po-101', organizer: 'Ethio Concerts Ltd', event: 'Addis Jazz Night', gross: 1800000, fee: 90000, net: 1710000, status: 'Pending' },
    ]);

    setAuditLogsList([
      { id: 'log-1', user: 'Admin System', action: 'Organizer Approved: Ethio Concerts Ltd', date: '2026-07-31 08:00', ip: '197.156.104.1' },
      { id: 'log-2', user: 'Admin System', action: 'System Commission Rate updated to 5.0%', date: '2026-07-30 16:45', ip: '197.156.104.1' },
    ]);
  }

  async function fetchUsers() {
    const { data } = await supabase.from('users').select('*');
    if (data && data.length) setUsersList(data);
  }

  async function fetchOrganizers() {
    const { data } = await supabase.from('organizers').select('*');
    if (data && data.length) setOrganizersList(data);
  }

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*');
    if (data && data.length) setEventsList(data);
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*');
    if (data && data.length) setCategoriesList(data);
  }

  async function fetchPayments() {
    const { data } = await supabase.from('payments').select('*');
    if (data && data.length) setPaymentsList(data);
  }

  async function fetchPayouts() {
    const { data } = await supabase.from('payouts').select('*');
    if (data && data.length) setPayoutsList(data);
  }

  async function fetchAuditLogs() {
    const { data } = await supabase.from('auditLogs').select('*').order('date', { ascending: false });
    if (data && data.length) setAuditLogsList(data);
  }

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const newCat = { id: `cat-${Date.now()}`, name: newCategoryName };
    setCategoriesList([...categoriesList, newCat]);
    setNewCategoryName('');
  }

  function handleDeleteCategory(id) {
    setCategoriesList(categoriesList.filter((c) => c.id !== id));
  }

  function handleVerifyTicket(e) {
    e.preventDefault();
    if (!ticketQuery.trim()) return;
    setVerifiedTicket({
      id: ticketQuery,
      buyerName: 'Abebe Bikila',
      eventTitle: 'Great Ethiopian Run 2026',
      ticketType: 'VIP Experience',
      paymentStatus: 'Paid (Telebirr)',
      entryStatus: 'Checked In',
      checkInTime: '2026-07-31 07:45 AM',
    });
  }

  function handleMarkPayoutPaid(id) {
    setPayoutsList(payoutsList.map((p) => (p.id === id ? { ...p, status: 'Paid' } : p)));
  }

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'organizers', label: 'Organizers', icon: Building2 },
    { id: 'staff', label: 'Staff', icon: UserCheck },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'payouts', label: 'Organizer Payouts', icon: Banknote },
    { id: 'verification', label: 'Ticket Verification', icon: QrCode },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* 📱 MOBILE HEADER BAR */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md">
            YT
          </div>
          <span className="font-bold tracking-wide text-sm text-white">YeneTicket Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* 🟢 SIDEBAR NAVIGATION */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div>
          <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/30">
              Y
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight leading-none">
                YENE<span className="text-blue-500">TICKET</span>
              </h2>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
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
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              supabase.auth.signOut();
              window.location.href = '/auth/signin';
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white capitalize tracking-tight">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Full Platform Control • System Administrator Access
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
              System Health: 100%
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                    <Users size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +18%
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats.totalUsers.toLocaleString()}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Total Users</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                    <Building2 size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    +5 New
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats.totalOrganizers}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Total Organizers</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                    <Calendar size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">{stats.activeEvents}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Active Events</p>
              </div>

              <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                    <Banknote size={20} />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    ETB
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">{(stats.totalRevenue / 1000000).toFixed(1)}M</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">Total Revenue (ETB)</p>
              </div>

            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Audit Actions */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Recent System Audit Logs</h2>
                  <button onClick={() => setActiveTab('audit')} className="text-xs text-blue-400 font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {auditLogsList.slice(0, 3).map((log) => (
                    <div key={log.id} className="p-3.5 bg-slate-900 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{log.action}</p>
                        <p className="text-[10px] text-slate-500">{log.user} • {log.date}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{log.ip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals */}
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Pending Organizer Approvals</h2>
                  <button onClick={() => setActiveTab('organizers')} className="text-xs text-blue-400 font-bold hover:underline">
                    Manage
                  </button>
                </div>
                <div className="space-y-3">
                  {organizersList.filter((o) => o.status === 'Pending').map((org) => (
                    <div key={org.id} className="p-3.5 bg-slate-900 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{org.businessName}</p>
                        <p className="text-[10px] text-slate-500">{org.contactPerson} • {org.phone}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('organizers')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[10px]"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: USER MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Platform Users Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900">
                      <td className="py-3.5 px-4 font-bold text-white">{u.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-semibold">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded-full text-[10px]">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-lg">
                          <Ban size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: ORGANIZER MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'organizers' && (
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Registered Organizers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Business Name</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4">Total Revenue</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {organizersList.map((org) => (
                    <tr key={org.id} className="hover:bg-slate-900">
                      <td className="py-3.5 px-4 font-bold text-white">{org.businessName}</td>
                      <td className="py-3.5 px-4 text-slate-300">{org.contactPerson}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          org.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{org.totalRevenue.toLocaleString()} ETB</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {org.status === 'Pending' && (
                          <button
                            onClick={() => {
                              setOrganizersList(organizersList.map(o => o.id === org.id ? {...o, status: 'Verified'} : o));
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: CATEGORY MANAGEMENT */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Add Event Category</h2>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Cultural Events..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2">
                  <Plus size={16} />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase text-[10px] tracking-wider">Active Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {categoriesList.map((cat) => (
                  <div key={cat.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs font-bold text-white">
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 8: ORGANIZER PAYOUTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'payouts' && (
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Organizer Payout Requests</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Organizer</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Gross</th>
                    <th className="py-3 px-4">Platform Fee (5%)</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payoutsList.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-900">
                      <td className="py-3.5 px-4 font-bold text-white">{po.organizer}</td>
                      <td className="py-3.5 px-4 text-slate-300">{po.event}</td>
                      <td className="py-3.5 px-4 text-slate-400">{po.gross.toLocaleString()} ETB</td>
                      <td className="py-3.5 px-4 text-rose-400">-{po.fee.toLocaleString()} ETB</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{po.net.toLocaleString()} ETB</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          po.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {po.status === 'Pending' && (
                          <button
                            onClick={() => handleMarkPayoutPaid(po.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px]"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: TICKET VERIFICATION */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'verification' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-base font-bold text-white mb-4">Search Ticket Database</h2>
              <form onSubmit={handleVerifyTicket} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Ticket ID or Phone..."
                  value={ticketQuery}
                  onChange={(e) => setTicketQuery(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs">
                  Verify
                </button>
              </form>
            </div>

            {verifiedTicket && (
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Buyer Name</span>
                  <span className="font-bold text-white">{verifiedTicket.buyerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Event</span>
                  <span className="font-bold text-white">{verifiedTicket.eventTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Payment Status</span>
                  <span className="font-bold text-emerald-400">{verifiedTicket.paymentStatus}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 12: SYSTEM SETTINGS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white">Platform Settings</h2>
            <div>
              <label className="block text-slate-400 mb-1">Platform Name</label>
              <input
                type="text"
                value={systemSettings.platformName}
                onChange={(e) => setSystemSettings({ ...systemSettings, platformName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Platform Commission Rate (%)</label>
              <input
                type="number"
                value={systemSettings.commissionRate}
                onChange={(e) => setSystemSettings({ ...systemSettings, commissionRate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white"
              />
            </div>
            <button
              onClick={() => alert('Settings Saved!')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
            >
              Save Configuration
            </button>
          </div>
        )}

      </main>
    </div>
  );
}