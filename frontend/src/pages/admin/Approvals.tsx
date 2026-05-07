import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { DoctorProfile } from '../../types';
import { UserX, CheckCircle, Trash2, Loader2, Clock, Calendar, Stethoscope, ArrowLeft, Mail, User } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast, { useToast } from '../../components/Toast';
import { useLocation } from 'react-router-dom';

const Approvals = () => {
  const [unapproved, setUnapproved] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ open: boolean; userName: string; type: 'remove' | 'approveAll' }>({
    open: false, userName: '', type: 'remove',
  });
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const location = useLocation();

  useEffect(() => { fetchUnapproved(); }, []);

  const fetchUnapproved = async () => {
    try {
      const data = await adminService.getUnapprovedDoctors();
      setUnapproved(data || []);
      
      if (location.state?.selectedDoctorUserName && data) {
        const found = data.find((d: any) => (d.user?.userName || d.user?.username) === location.state.selectedDoctorUserName);
        if (found) setSelectedDoctor(found);
      }
    } catch {
      addToast('Failed to load pending approvals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userName: string | undefined) => {
    if (!userName) {
      addToast('Cannot approve: Username is missing.', 'error');
      return;
    }
    setProcessing(userName);
    try {
      await adminService.approveDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => (d.user?.userName || (d.user as any)?.username) !== userName));
      addToast(`Dr. ${userName} has been approved.`, 'success');
      if (selectedDoctor && (selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username) === userName) {
        setSelectedDoctor(null);
      }
    } catch {
      addToast('Failed to approve doctor.', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveAll = async () => {
    setProcessing('all');
    try {
      await adminService.approveAllDoctors();
      setUnapproved([]);
      addToast('All doctors have been approved.', 'success');
    } catch {
      addToast('Failed to approve all doctors.', 'error');
    } finally {
      setProcessing(null);
      setConfirmState({ open: false, userName: '', type: 'approveAll' });
    }
  };

  const handleRemove = async () => {
    const { userName } = confirmState;
    if (!userName) return;
    setProcessing(userName);
    try {
      await adminService.removeDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => (d.user?.userName || (d.user as any)?.username) !== userName));
      addToast(`Dr. ${userName} has been removed.`, 'info');
      if (selectedDoctor && (selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username) === userName) {
        setSelectedDoctor(null);
      }
    } catch {
      addToast('Failed to remove doctor.', 'error');
    } finally {
      setProcessing(null);
      setConfirmState({ open: false, userName: '', type: 'remove' });
    }
  };

  const formatDay = (day: string) => day.charAt(0) + day.slice(1).toLowerCase();

  return (
    <DashboardLayout title="Doctor Approvals">
      <Toast toasts={toasts} onRemove={removeToast} />

      <ConfirmModal
        isOpen={confirmState.open && confirmState.type === 'remove'}
        title="Remove Doctor"
        message={`Are you sure you want to permanently remove Dr. ${confirmState.userName}? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="danger"
        loading={processing === confirmState.userName}
        onConfirm={handleRemove}
        onCancel={() => setConfirmState({ open: false, userName: '', type: 'remove' })}
      />

      <ConfirmModal
        isOpen={confirmState.open && confirmState.type === 'approveAll'}
        title="Approve All Doctors"
        message={`This will approve all ${unapproved.length} pending doctor(s). Are you sure?`}
        confirmLabel="Approve All"
        variant="warning"
        loading={processing === 'all'}
        onConfirm={handleApproveAll}
        onCancel={() => setConfirmState({ open: false, userName: '', type: 'approveAll' })}
      />

      {unapproved.length > 0 && !selectedDoctor && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Pending Reviews ({unapproved.length})</h2>
            <p className="text-sm text-slate-500">
              Review and approve doctor registrations.
            </p>
          </div>
          <button
            onClick={() => setConfirmState({ open: true, userName: '', type: 'approveAll' })}
            disabled={processing === 'all'}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            {processing === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Approve All
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="text-slate-500">Fetching pending requests...</p>
        </div>
      ) : unapproved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">You're All Caught Up!</h3>
          <p className="text-slate-500">There are no pending doctor registration requests at the moment.</p>
        </div>
      ) : selectedDoctor ? (
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedDoctor(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </button>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserX className="w-10 h-10 text-slate-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Dr. {selectedDoctor.user?.fullName}</h2>
                <p className="text-lg text-primary-600 mb-2">{selectedDoctor.specialty}</p>
                <p className="text-slate-500">{selectedDoctor.qualification}</p>
              </div>
            </div>

            {selectedDoctor.bio && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Biography</h3>
                <p className="text-slate-600">{selectedDoctor.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Availability</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Hours</span>
                    <span className="font-medium text-slate-900">{selectedDoctor.availableFrom} – {selectedDoctor.availableTo}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Schedule</span>
                    <span className="font-medium text-slate-900">{selectedDoctor.workingDays?.map(formatDay).join(', ')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Username</span>
                    <span className="font-medium text-slate-900">{selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900">{selectedDoctor.user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={() => handleApprove(selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username)}
                disabled={!!processing}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing === (selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username) ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Approve Registration
              </button>
              <button
                onClick={() => setConfirmState({ open: true, userName: selectedDoctor.user?.userName || (selectedDoctor.user as any)?.username, type: 'remove' })}
                disabled={!!processing}
                className="px-8 py-3 bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Reject Application
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {unapproved.map((doctor) => (
            <div
              key={doctor.id}
              className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserX className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 truncate">Dr. {doctor.user?.fullName}</h3>
                    <p className="text-sm text-slate-500 truncate">{doctor.specialty} • {doctor.qualification}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{doctor.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{doctor.user?.userName || (doctor.user as any)?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                     <Clock className="w-4 h-4 text-slate-400" />
                     <span className="truncate">{doctor.availableFrom} – {doctor.availableTo}</span>
                  </div>
                   <div className="flex items-center gap-2 text-slate-600">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     <span className="truncate">{doctor.workingDays?.map(formatDay).join(', ')}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Review
                  </button>
                  <button
                    onClick={() => setConfirmState({ open: true, userName: doctor.user?.userName || (doctor.user as any)?.username, type: 'remove' })}
                    className="px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Approvals;
