import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function PaymentResultPage() {
  const query = useQuery();
  const success = query.get('success') === 'true';
  const bookingId = query.get('bookingId');
  const message = query.get('message');

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-10 max-w-lg w-full text-center">
        <div className="flex justify-center mb-4">
          {success ? (
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {success ? 'Thanh toán thành công' : 'Thanh toán không thành công'}
        </h1>
        {message && (
          <p className="text-sm text-slate-600 mb-4">
            {decodeURIComponent(message)}
          </p>
        )}
        {bookingId && (
          <p className="text-sm text-slate-500 mb-6">
            Mã lịch học của bạn: <span className="font-semibold">#{bookingId}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/my-bookings"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#372660] text-white hover:bg-[#2b1d4c] transition-colors"
          >
            Xem lịch học của tôi
          </Link>
          <Link
            to="/search"
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tiếp tục tìm Mentor
          </Link>
        </div>
      </div>
    </div>
  );
}

