'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Mail, Lock, User, Phone, Building } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('organizer-login'); // 'organizer-login', 'organizer-register', 'staff-login'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    phone: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Organizer Registration Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and privacy policy');
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          business_name: formData.businessName,
          phone: formData.phone,
          role: 'organizer'
        }
      }
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      router.push('/organizer/dashboard');
    }
  };

  // Login Handler (Organizer & Staff)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // Role Verification
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('uid', data.user.id)
      .single();

    setLoading(false);

    if (mode === 'organizer-login' && profile?.role === 'organizer') {
      router.push('/organizer/dashboard');
    } else if (mode === 'staff-login' && profile?.role === 'staff') {
      router.push('/staff/dashboard');
    } else {
      await supabase.auth.signOut();
      setError(`Unauthorized access. Invalid credentials for this portal.`);
    }
  };

  // Password Reset Handler
  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 shadow-xl rounded-3xl max-w-md w-full p-8 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yene Ticket</h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {mode === 'organizer-login' && 'Organizer Portal'}
            {mode === 'organizer-register' && 'Become an Organizer'}
            {mode === 'staff-login' && 'Staff Scanner Portal'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl font-semibold">
            Check your email for password reset instructions.
          </div>
        )}

        {/* ORGANIZER REGISTRATION FORM */}
{mode === 'organizer-register' ? (
  <form onSubmit={handleRegister} className="space-y-4">
    <div>
      <label className="text-xs font-bold text-slate-700">Full Name</label>
      <input 
        type="text" 
        name="fullName" 
        value={formData.fullName} 
        required 
        onChange={handleChange} 
        className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
      />
    </div>

    <div>
      <label className="text-xs font-bold text-slate-700">Business / Organization Name</label>
      <input 
        type="text" 
        name="businessName" 
        value={formData.businessName} 
        required 
        onChange={handleChange} 
        className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
      />
    </div>

    <div>
      <label className="text-xs font-bold text-slate-700">Email Address</label>
      <input 
        type="email" 
        name="email" 
        value={formData.email} 
        required 
        onChange={handleChange} 
        className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
      />
    </div>

    <div>
      <label className="text-xs font-bold text-slate-700">Phone Number</label>
      <input 
        type="tel" 
        name="phone" 
        value={formData.phone} 
        placeholder="+2519..." 
        required 
        onChange={handleChange} 
        className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
      />
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-bold text-slate-700">Password</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          required 
          onChange={handleChange} 
          className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
        />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-700">Confirm Password</label>
        <input 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          required 
          onChange={handleChange} 
          className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" 
        />
      </div>
    </div>

    <div className="space-y-2 pt-2">
      <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
        <input 
          type="checkbox" 
          name="agreeTerms" 
          checked={formData.agreeTerms} 
          onChange={handleChange} 
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
        />
        <span>I agree to the Terms & Conditions and Privacy Policy</span>
      </label>
    </div>

    <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
      {loading ? 'Creating Account...' : 'Create Organizer Account'}
    </button>
  </form>
) : (

          /* LOGIN FORM (ORGANIZER & STAFF) */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-[11px] font-bold text-blue-600 hover:underline">
                  Forgot Password?
                </button>
              </div>
              <input type="password" name="password" value={formData.password} required onChange={handleChange} className="w-full mt-1 px-4 py-3 bg-slate-100 text-slate-900 placeholder-slate-400 font-semibold text-sm rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all" />
        
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        )}

        {/* Dynamic Mode Switcher Links */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center text-xs font-semibold">
          {mode === 'organizer-login' && (
            <>
              <button onClick={() => setMode('organizer-register')} className="text-blue-600 hover:underline">
                Become an Organizer
              </button>
              <button onClick={() => setMode('staff-login')} className="text-slate-400 hover:text-slate-600 text-[11px]">
                Staff Login
              </button>
            </>
          )}

          {mode === 'organizer-register' && (
            <button onClick={() => setMode('organizer-login')} className="text-slate-600 hover:underline">
              Already have an organizer account? Login
            </button>
          )}

          {mode === 'staff-login' && (
            <button onClick={() => setMode('organizer-login')} className="text-slate-600 hover:underline">
              Switch to Organizer Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}