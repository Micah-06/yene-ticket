'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. Authenticate with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      setError('Invalid admin credentials.');
      return;
    }

    // 2. Verify admin role from public users table
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('uid', data.user.id)
      .single();

    setLoading(false);

    if (profile?.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      await supabase.auth.signOut();
      setError('Access Denied: Not an administrator account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl max-w-sm w-full p-8 space-y-6 text-white">
        <div className="flex flex-col items-center text-center space-y-2">
          <ShieldAlert className="text-rose-500" size={36} />
          <h1 className="text-xl font-black">Admin Authentication</h1>
          <p className="text-[11px] text-slate-400 font-medium">Restricted Internal Control Panel</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-300">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            {loading ? 'Verifying...' : 'Authorize Admin Access'}
          </button>
        </form>
      </div>
    </div>
  );
}