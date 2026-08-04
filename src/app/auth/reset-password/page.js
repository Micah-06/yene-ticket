'use client';

import { useState } from 'react';
import { supabase } from '@/supabase/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Set New Password</h2>
        <p style={subtitleStyle}>Enter your new password below</p>

        {errorMsg && <div style={errorStyle}>{errorMsg}</div>}
        {successMsg && <div style={successStyle}>{successMsg}</div>}

        <form onSubmit={handlePasswordUpdate}>
          <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const containerStyle = { display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f8', padding: '1rem' };
const cardStyle = { backgroundColor: '#ffffff', border: '1px solid #e1e4e8', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const titleStyle = { color: '#111111', fontSize: '24px', fontWeight: '700', marginBottom: '6px' };
const subtitleStyle = { color: '#555555', fontSize: '14px', marginBottom: '1.5rem' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#222222' };
const inputStyle = { width: '100%', padding: '11px', fontSize: '14px', borderRadius: '6px', border: '1px solid #cccccc', color: '#111111', backgroundColor: '#ffffff', boxSizing: 'border-box' };
const submitBtnStyle = { width: '100%', padding: '12px', fontSize: '15px', backgroundColor: '#0066ff', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px' };
const successStyle = { backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px' };