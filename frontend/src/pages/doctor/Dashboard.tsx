import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorService } from '../../services/api';
import type { Appointment } from '../../types';
import { Calendar, User, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  CONFIRMED: { label: 'Confirmed', badgeClass: 'badge badge-confirmed' },
  PENDING:   { label: 'Pending',   badgeClass: 'badge badge-pending' },
  CANCELLED: { label: 'Cancelled', badgeClass: 'badge badge-cancelled' },
  COMPLETED: { label: 'Completed', badgeClass: 'badge badge-completed' },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const DoctorDashboard = () => {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [previous, setPrevious] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, previousRes] = await Promise.all([
          doctorService.getUpcomingAppointments(),
          doctorService.getPreviousAppointments(),
        ]);
        setUpcoming(upcomingRes.appointments || []);
        setPrevious(previousRes.appointments || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats — 1 col mobile → 2 col sm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-7">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 card-shadow card-shadow-hover animate-slide-up delay-75">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-md mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{loading ? '—' : upcoming.length}</p>
          <p className="text-sm text-slate-500">Upcoming Appointments</p>
        </div>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 card-shadow card-shadow-hover animate-slide-up delay-150">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md mb-4">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{loading ? '—' : previous.length}</p>
          <p className="text-sm text-slate-500">Completed Appointments</p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow mb-5 sm:mb-6 animate-slide-up delay-150">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Upcoming Appointments</h2>
          <span className="badge badge-confirmed flex-shrink-0 ml-2">{upcoming.length}</span>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary-500" /></div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {upcoming.map((apt) => {
                const sc = statusConfig[apt.status] ?? { label: apt.status, badgeClass: 'badge' };
                return (
                  <div key={apt.id} className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-sky-50/40 hover:bg-sky-50/80 rounded-xl transition-colors">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{apt.patientUserUserName || 'Patient'}</p>
                      {apt.notes && <p className="text-xs text-slate-500 truncate">{apt.notes}</p>}
                      {/* Date below on mobile */}
                      <p className="text-xs font-medium text-slate-600 mt-1 sm:hidden">{formatDate(apt.appointmentTime)}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <p className="text-xs font-medium text-slate-700 hidden sm:block">{formatDate(apt.appointmentTime)}</p>
                      <span className={sc.badgeClass}>{sc.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Previous */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow animate-slide-up delay-225">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Previous Appointments</h2>
          <span className="badge badge-completed flex-shrink-0 ml-2">{previous.length}</span>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary-500" /></div>
          ) : previous.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No previous appointments</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {previous.map((apt) => {
                const sc = statusConfig[apt.status] ?? { label: apt.status, badgeClass: 'badge' };
                return (
                  <div key={apt.id} className="flex items-start sm:items-center gap-3 p-3 sm:p-4 bg-slate-50 hover:bg-slate-100/60 rounded-xl transition-colors">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{apt.patientUserUserName || 'Patient'}</p>
                      {apt.notes && <p className="text-xs text-slate-500 truncate">{apt.notes}</p>}
                      <p className="text-xs font-medium text-slate-600 mt-1 sm:hidden">{formatDate(apt.appointmentTime)}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <p className="text-xs font-medium text-slate-700 hidden sm:block">{formatDate(apt.appointmentTime)}</p>
                      <span className={sc.badgeClass}>{sc.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
