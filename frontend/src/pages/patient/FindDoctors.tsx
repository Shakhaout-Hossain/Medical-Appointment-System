import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientService } from '../../services/api';
import type { DoctorProfile } from '../../types';
import { Search, Calendar, Clock, User, Loader2, CheckCircle, X, Stethoscope } from 'lucide-react';
import Toast, { useToast } from '../../components/Toast';

const specialtyColors: Record<string, string> = {
  Cardiology:    'from-rose-400 to-red-500',
  Neurology:     'from-violet-400 to-purple-600',
  Orthopedics:   'from-blue-400 to-cyan-500',
  Pediatrics:    'from-green-400 to-emerald-500',
  Dermatology:   'from-amber-400 to-orange-500',
  Gynecology:    'from-pink-400 to-fuchsia-500',
  General:       'from-slate-400 to-slate-600',
};
const getSpecialtyGrad = (s?: string) => {
  if (!s) return 'from-primary-400 to-violet-500';
  const key = Object.keys(specialtyColors).find(k => s.toLowerCase().includes(k.toLowerCase()));
  return key ? specialtyColors[key] : 'from-primary-400 to-violet-500';
};

const formatDay = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

const FindDoctors = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await patientService.getDoctors();
        setDoctors(res.doctors || []);
      } catch (err) {
        addToast('Failed to load doctors. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) return;
    setBooking(true);
    try {
      const dateTime = `${appointmentDate}T${appointmentTime}:00`;
      await patientService.createAppointment({ doctorId: selectedDoctor.id, appointmentTime: dateTime, notes });
      addToast(`Appointment booked with Dr. ${selectedDoctor.user?.fullName}!`, 'success');
      setSelectedDoctor(null);
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to book appointment. Please try again.', 'error');
    } finally {
      setBooking(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      d.qualification?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout title="Find Doctors">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 sm:p-5 mb-6 sm:mb-7 animate-slide-up">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, specialty, or qualification…"
            className="input-field pl-11 sm:pl-12"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {search && (
          <p className="text-xs text-slate-400 mt-2">
            Showing {filteredDoctors.length} result{filteredDoctors.length !== 1 ? 's' : ''} for "{search}"
          </p>
        )}
      </div>

      {/* Doctors grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-14 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No doctors found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredDoctors.map((doctor, i) => {
            const grad = getSpecialtyGrad(doctor.specialty);
            return (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Top accent */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />

                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">Dr. {doctor.user?.fullName}</h3>
                      <span className={`badge mt-1 bg-gradient-to-r ${grad} text-white`}>{doctor.specialty}</span>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{doctor.qualification}</p>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{doctor.bio}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{doctor.availableFrom} – {doctor.availableTo}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{doctor.workingDays?.map(formatDay).join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:shadow-md"
                    style={{ background: `linear-gradient(135deg, #6366f1, #4f46e5)` }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal — scrollable on all screen sizes */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md animate-scale-in overflow-hidden max-h-[90dvh] flex flex-col">
            {/* Header */}
            <div className={`px-5 sm:px-6 py-5 bg-gradient-to-r ${getSpecialtyGrad(selectedDoctor.specialty)} flex-shrink-0`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white">Book Appointment</h3>
                  <p className="text-white/80 text-sm mt-0.5 truncate">with Dr. {selectedDoctor.user?.fullName}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0 ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Time</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Describe your symptoms or concerns…"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-5 sm:px-6 pb-6 pt-2 flex-shrink-0">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={booking || !appointmentDate || !appointmentTime}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
              >
                {booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</> : <><CheckCircle className="w-4 h-4" /> Confirm</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FindDoctors;
