import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorService } from '../../services/api';
import type { Appointment, Prescription, PrescriptionRequest } from '../../types';
import { Calendar, User, Loader2, CheckCircle, AlertCircle, FileText, Plus, Eye, X, Send } from 'lucide-react';

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
  const location = useLocation();
  const isPrescriptionsPage = location.pathname.includes('prescriptions');
  
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [previous, setPrevious] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<PrescriptionRequest>({
    diagnosis: '',
    medications: '',
    advice: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isPrescriptionsPage) {
        const [upcomingRes, prescriptionsRes] = await Promise.all([
          doctorService.getUpcomingAppointments(),
          doctorService.getPrescriptions(),
        ]);
        setUpcoming(upcomingRes.appointments || []);
        setPrescriptions(prescriptionsRes.prescriptions || []);
      } else {
        const [upcomingRes, previousRes] = await Promise.all([
          doctorService.getUpcomingAppointments(),
          doctorService.getPreviousAppointments(),
        ]);
        setUpcoming(upcomingRes.appointments || []);
        setPrevious(previousRes.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isPrescriptionsPage]);

  const handleOpenPrescribeModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setFormData({ diagnosis: '', medications: '', advice: '' });
    setIsModalOpen(true);
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    setSubmitting(true);
    try {
      // Assuming patient.id is what we need
      await doctorService.createPrescription(selectedAppointment.patient.id, formData);
      setIsModalOpen(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Failed to create prescription:', err);
      alert('Failed to create prescription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDashboard = () => (
    <>
      {/* Stats */}
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
                      <p className="font-semibold text-slate-900 text-sm truncate">{apt.patient?.user?.fullName || 'Patient'}</p>
                      {apt.notes && <p className="text-xs text-slate-500 truncate">{apt.notes}</p>}
                      <p className="text-xs font-medium text-slate-600 mt-1 sm:hidden">{formatDate(apt.appointmentTime)}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <p className="text-xs font-medium text-slate-700 hidden sm:block">{formatDate(apt.appointmentTime)}</p>
                      <div className="flex items-center gap-2">
                        {apt.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => handleOpenPrescribeModal(apt)}
                            className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                          >
                            Prescribe
                          </button>
                        )}
                        <span className={sc.badgeClass}>{sc.label}</span>
                      </div>
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
                      <p className="font-semibold text-slate-900 text-sm truncate">{apt.patient?.user?.fullName || 'Patient'}</p>
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
    </>
  );

  const renderPrescriptions = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-7">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 card-shadow card-shadow-hover animate-slide-up delay-75">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{loading ? '—' : prescriptions.length}</p>
          <p className="text-sm text-slate-500">Total Prescriptions</p>
        </div>
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 card-shadow card-shadow-hover animate-slide-up delay-150">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-md mb-4">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-0.5">{loading ? '—' : upcoming.filter(a => a.status === 'CONFIRMED').length}</p>
          <p className="text-sm text-slate-500">Awaiting Prescription</p>
        </div>
      </div>

      {/* Awaiting Prescription */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow mb-6 animate-slide-up delay-150">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Awaiting Prescription</h2>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary-500" /></div>
          ) : upcoming.filter(a => a.status === 'CONFIRMED').length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No appointments awaiting prescription</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.filter(a => a.status === 'CONFIRMED').map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-primary-50/40 rounded-xl">
                  <div className="w-11 h-11 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{apt.patient?.user?.fullName || 'Patient'}</p>
                    <p className="text-xs text-slate-500">{formatDate(apt.appointmentTime)}</p>
                  </div>
                  <button 
                    onClick={() => handleOpenPrescribeModal(apt)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Write Prescription
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow animate-slide-up delay-225">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Prescription History</h2>
        </div>
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-7 h-7 animate-spin text-primary-500" /></div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No prescriptions found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((pr) => (
                <div key={pr.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{pr.appointment?.patient?.user?.fullName || 'Patient'}</p>
                    <p className="text-xs text-slate-500 mb-2">{formatDate(pr.appointment?.appointmentTime)}</p>
                    <p className="text-xs font-medium text-slate-700 line-clamp-1">Diagnosis: {pr.diagnosis}</p>
                  </div>
                  <button 
                    onClick={() => setViewingPrescription(pr)}
                    className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout title={isPrescriptionsPage ? "Prescriptions" : "Doctor Dashboard"}>
      {isPrescriptionsPage ? renderPrescriptions() : renderDashboard()}

      {/* Prescription Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Prescription</h3>
                <p className="text-xs text-slate-500">Patient: {selectedAppointment?.patient?.user?.fullName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPrescription} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Diagnosis</label>
                <input
                  required
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm outline-none"
                  placeholder="e.g. Seasonal Flu, Hypertension"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Medications</label>
                <textarea
                  required
                  rows={3}
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm outline-none resize-none"
                  placeholder="Enter medications and dosage..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Advice / Instructions</label>
                <textarea
                  required
                  rows={2}
                  value={formData.advice}
                  onChange={(e) => setFormData({ ...formData, advice: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm outline-none resize-none"
                  placeholder="Rest, drink plenty of water, etc."
                />
              </div>
              
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-md text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Prescription Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-primary-600">
              <h3 className="text-lg font-bold text-white">Prescription Details</h3>
              <button onClick={() => setViewingPrescription(null)} className="p-2 text-white/80 hover:text-white rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Patient</p>
                  <p className="text-lg font-bold text-slate-900">{viewingPrescription.appointment?.patient?.user?.fullName || 'Patient'}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                  <p className="text-sm font-semibold text-slate-700">{formatDate(viewingPrescription.appointment?.appointmentTime)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Diagnosis</p>
                  <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">{viewingPrescription.diagnosis}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Medications</p>
                  <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{viewingPrescription.medications}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Doctor's Advice</p>
                  <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">{viewingPrescription.advice}</p>
                </div>
              </div>
              
              <button
                onClick={() => setViewingPrescription(null)}
                className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors mt-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
