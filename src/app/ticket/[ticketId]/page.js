'use client';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function TicketPage() {
  const params = useParams();
  const ticketId = params.ticketId || 'TCK-123456';

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border overflow-hidden max-w-sm w-full">
        <div className="bg-emerald-600 text-white p-6 text-center">
          <span className="text-xs font-bold tracking-widest uppercase opacity-80">E-Ticket</span>
          <h1 className="text-xl font-extrabold mt-1">Addis Music Festival</h1>
        </div>

        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
            <QRCodeSVG value={`http://localhost:3000/ticket/${ticketId}`} size={180} />
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Ticket ID</p>
            <p className="text-lg font-mono font-bold text-gray-800">{ticketId}</p>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 text-left bg-gray-50 p-4 rounded-xl text-xs">
            <div>
              <p className="text-gray-400">Date & Time</p>
              <p className="font-semibold text-gray-700">Sep 15, 2026 - 6:00 PM</p>
            </div>
            <div>
              <p className="text-gray-400">Venue</p>
              <p className="font-semibold text-gray-700">Ghion Hotel</p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition"
          >
            Download / Print PDF
          </button>
        </div>
      </div>
    </main>
  );
}