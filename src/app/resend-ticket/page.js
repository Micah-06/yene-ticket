'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ResendTicketPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setMessage('Sending code...');
    setTimeout(() => {
      setStep(2);
      setMessage('OTP code sent via SMS to ' + phone);
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setMessage('Verifying...');
    setTimeout(() => {
      setTickets([{ ticketId: 'TCK-882190', attendeeName: 'Guest Attendee' }]);
      setStep(3);
      setMessage('');
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Tickets</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your phone number to receive a one-time login code.</p>

        {message && <p className="mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input
              type="tel"
              placeholder="Mobile Phone (+251...)"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm"
            />
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm text-center text-xl tracking-widest font-mono"
            />
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-md font-bold text-gray-800">Your Active Tickets</h2>
            {tickets.map((t) => (
              <div key={t.ticketId} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                <div>
                  <p className="font-bold text-sm text-gray-800">{t.ticketId}</p>
                  <p className="text-xs text-gray-500">{t.attendeeName}</p>
                </div>
                <Link href={`/ticket/${t.ticketId}`} className="text-xs font-bold text-emerald-600 hover:underline">
                  View E-Ticket
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}