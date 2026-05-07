import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientService } from '../../services/api';
import type { Appointment } from '../../types';
import { Calendar, Clock, User, Stethoscope, FileText, CheckCircle, XCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  CONFIRMED: { label: 'Confirmed', badgeClass: 'badge badge-confirmed', icon: <CheckCircle className="w-3 h-3" /> },
  PENDING:   { label: 'Pending',   badgeClass: 'badge badge-pending',   icon: <Clock className="w-3 h-3" /> },
  CANCELLED: { label: 'Cancelled', badgeClass: 'badge badge-cancelled', icon: <XCircle className="w-3 h-3" /> },
  COMPLETED: { label: 'Completed', badgeClass: 'badge badge-completed', icon: <CheckCircle className="w-3 h-3" /> },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const StatCard = ({ icon, value, label, gradient, delay }: {
  icon: React.ReactNode; value: string | number; label: string; gradient: string; delay: string;
}) => (
  <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 card-shadow card-shadow-hover animate-slide-up ${delay}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </div>
);

const AppointmentRow = ({ apt, dim }: { apt: Appointment; dim?: boolean }) => {
  const sc = statusConfig[apt.status] ?? { label: apt.status, badgeClass: 'badge', icon: <AlertCircle className="w-3 h-3" /> };
  return (
    <div className={`flex items-start sm:items-center gap-3 p-3 sm:p-4 rounded-xl transition-colors ${dim ? 'bg-slate-50 hover:bg-slate-100/60' : 'bg-primary-50/30 hover:bg-primary-50/60'}`}>
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 ${dim ? 'bg-slate-200' : 'bg-primary-100'}`}>
        <User className={`w-4 h-4 sm:w-5 sm:h-5 ${dim ? 'text-slate-500' : 'text-primary-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">Dr. {apt.doctor?.user?.fullName}</p>
        <p className="text-xs text-slate-500 truncate">{apt.doctor?.specialty}</p>
        {/* Date shown below on mobile */}
        <p className="text-xs font-medium text-slate-600 mt-1 sm:hidden">{formatDate(apt.appointmentTime)}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <p className="text-xs font-medium text-slate-700 hidden sm:block">{formatDate(apt.appointmentTime)}</p>
        <span className={`${sc.badgeClass} flex items-center gap-1`}>
          {sc.icon}
          {sc.label}
        </span>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [previous, setPrevious] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, previousRes] = await Promise.all([
          patientService.getUpcomingAppointments(),
          patientService.getPreviousAppointments(),
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
      {/* Stats — 1 col mobile → 3 col sm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-7">
        <StatCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
          value={loading ? '—' : upcoming.length}
          label="Upcoming Appointments"
          gradient="from-violet-500 to-purple-600"
          delay="delay-75"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
          value={loading ? '—' : previous.length}
          label="Completed Visits"
          gradient="from-emerald-400 to-teal-500"
          delay="delay-150"
        />
        <StatCard
          icon={<Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
          value="—"
          label="Prescriptions"
          gradient="from-amber-400 to-orange-500"
          delay="delay-225"
        />
      </div>

      {/* Quick action */}
      <div className="mb-6 sm:mb-7">
        <Link
          to="/dashboard/doctors"
          className="flex items-center justify-between px-4 sm:px-5 py-4 rounded-2xl text-white font-medium text-sm transition-all hover:shadow-lg hover:scale-[1.01]"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)' }}
        >
          <div className="flex items-center gap-3">
            <Stethoscope className="w-5 h-5 opacity-90 flex-shrink-0" />
            <span>Find a doctor and book an appointment</span>
          </div>
          <ArrowRight className="w-4 h-4 opacity-80 flex-shrink-0" />
        </Link>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow mb-5 sm:mb-6 animate-slide-up delay-150">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Upcoming Appointments</h2>
          <span className="badge badge-confirmed flex-shrink-0 ml-2">{upcoming.length} upcoming</span>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No upcoming appointments</p>
              <Link to="/dashboard/doctors" className="text-primary-600 hover:text-primary-700 text-sm font-semibold mt-2 inline-block">
                Book now →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {upcoming.map((apt) => <AppointmentRow key={apt.id} apt={apt} />)}
            </div>
          )}
        </div>
      </div>

      {/* Previous */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow animate-slide-up delay-225">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Previous Appointments</h2>
          <span className="badge badge-completed flex-shrink-0 ml-2">{previous.length} completed</span>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
            </div>
          ) : previous.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No previous appointments</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {previous.map((apt) => <AppointmentRow key={apt.id} apt={apt} dim />)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
