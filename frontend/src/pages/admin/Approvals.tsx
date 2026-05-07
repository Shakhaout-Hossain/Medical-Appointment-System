import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { DoctorProfile } from '../../types';
import { UserX, CheckCircle, Trash2, Loader2, Clock, Calendar, Stethoscope } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast, { useToast } from '../../components/Toast';

const Approvals = () => {
  const [unapproved, setUnapproved] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ open: boolean; userName: string; type: 'remove' | 'approveAll' }>({
    open: false, userName: '', type: 'remove',
  });
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => { fetchUnapproved(); }, []);

  const fetchUnapproved = async () => {
    try {
      const data = await adminService.getUnapprovedDoctors();
      setUnapproved(data || []);
    } catch {
      addToast('Failed to load pending approvals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userName: string) => {
    setProcessing(userName);
    try {
      await adminService.approveDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => d.user.userName !== userName));
      addToast(`Dr. ${userName} has been approved.`, 'success');
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
    setProcessing(userName);
    try {
      await adminService.removeDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => d.user.userName !== userName));
      addToast(`Dr. ${userName} has been removed.`, 'info');
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

      {unapproved.length > 0 && (
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{unapproved.length}</span> doctor{unapproved.length > 1 ? 's' : ''} pending review
          </p>
          <button
            onClick={() => setConfirmState({ open: true, userName: '', type: 'approveAll' })}
            disabled={processing === 'all'}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 3px 10px rgba(22,163,74,0.3)' }}
          >
            {processing === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Approve All
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-14 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : unapproved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-14 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No pending approvals</p>
          <p className="text-slate-400 text-sm mt-1">All doctors have been reviewed</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {unapproved.map((doctor, i) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">Dr. {doctor.user?.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Stethoscope className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-primary-600 font-medium truncate">{doctor.specialty}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{doctor.qualification}</p>
                  </div>
                  <span className="badge badge-pending flex-shrink-0">Pending</span>
                </div>

                {doctor.bio && (
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{doctor.bio}</p>
                )}

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{doctor.availableFrom} – {doctor.availableTo}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{doctor.workingDays?.map(formatDay).join(', ')}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg px-3 py-2 mb-4 text-xs text-slate-500 space-y-1">
                  <div><span className="font-medium text-slate-700">Username:</span> {doctor.user?.userName}</div>
                  <div className="truncate"><span className="font-medium text-slate-700">Email:</span> {doctor.user?.email}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(doctor.user.userName)}
                    disabled={processing === doctor.user.userName}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 2px 8px rgba(22,163,74,0.25)' }}
                  >
                    {processing === doctor.user.userName ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    onClick={() => setConfirmState({ open: true, userName: doctor.user.userName, type: 'remove' })}
                    disabled={processing === doctor.user.userName}
                    className="px-3 sm:px-3.5 py-2.5 border border-danger-200 text-danger-600 rounded-xl hover:bg-danger-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
