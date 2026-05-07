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
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pending Reviews</h2>
            <p className="text-sm text-slate-500">
              There are <span className="font-semibold text-primary-600">{unapproved.length}</span> doctor registration requests awaiting your approval.
            </p>
          </div>
          <button
            onClick={() => setConfirmState({ open: true, userName: '', type: 'approveAll' })}
            disabled={processing === 'all'}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto shadow-lg shadow-emerald-200"
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}
          >
            {processing === 'all' ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            Approve All Doctors
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-20 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary-100 animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-primary-500 absolute inset-0" />
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Fetching pending requests...</p>
        </div>
      ) : unapproved.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-20 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">You're All Caught Up!</h3>
          <p className="text-slate-500">There are no pending doctor registration requests at the moment. All applications have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {unapproved.map((doctor, i) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-2 w-full bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-500" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                      <UserX className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm border-2 border-white">
                      NEW
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 truncate">Dr. {doctor.user?.fullName}</h3>
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                        Pending Approval
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-primary-50 rounded-md text-primary-600">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <span className="text-base text-slate-700 font-semibold truncate">{doctor.specialty}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {doctor.qualification}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {doctor.bio && (
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                      <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-3">
                        "{doctor.bio}"
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Hours</p>
                        <p className="font-semibold truncate">{doctor.availableFrom} – {doctor.availableTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Schedule</p>
                        <p className="font-semibold truncate">{doctor.workingDays?.map(formatDay).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 mb-8 text-sm relative overflow-hidden group/info">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover/info:bg-primary-500/20 transition-colors"></div>
                  <div className="relative z-10 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Username</span>
                      <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">{doctor.user?.userName || (doctor.user as any)?.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Email Address</span>
                      <span className="text-white font-medium truncate ml-4">{doctor.user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApprove(doctor.user?.userName || (doctor.user as any)?.username)}
                    disabled={processing === (doctor.user?.userName || (doctor.user as any)?.username)}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-100 hover:shadow-emerald-200"
                    style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}
                  >
                    {processing === (doctor.user?.userName || (doctor.user as any)?.username) ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                    Confirm Approval
                  </button>
                  <button
                    onClick={() => setConfirmState({ open: true, userName: doctor.user?.userName || (doctor.user as any)?.username, type: 'remove' })}
                    disabled={processing === (doctor.user?.userName || (doctor.user as any)?.username)}
                    className="px-6 py-3.5 border-2 border-rose-100 text-rose-600 rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Trash2 className="w-5 h-5" />
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
