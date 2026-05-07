import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { PatientProfile } from '../../types';
import { Users, Trash2, Loader2, User, Search, X } from 'lucide-react';
import ConfirmModal from '../../components/ConfirmModal';
import Toast, { useToast } from '../../components/Toast';

const Patients = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await adminService.getPatients();
        setPatients(res.patients || []);
      } catch {
        addToast('Failed to load patients.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleRemove = async () => {
    if (!confirmTarget) return;
    setProcessing(confirmTarget);
    try {
      await adminService.removePatient(confirmTarget);
      setPatients((prev) => prev.filter((p) => p.user.userName !== confirmTarget));
      addToast('Patient removed successfully.', 'info');
    } catch {
      addToast('Failed to remove patient.', 'error');
    } finally {
      setProcessing(null);
      setConfirmTarget(null);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.userName?.toLowerCase().includes(search.toLowerCase()),
  );

  const genderBadge = (gender?: string) => {
    const g = gender?.toUpperCase() || '';
    if (g === 'MALE') return <span className="badge badge-male">Male</span>;
    if (g === 'FEMALE') return <span className="badge badge-female">Female</span>;
    return <span className="badge badge-other">{gender || '—'}</span>;
  };

  return (
    <DashboardLayout title="Patients">
      <Toast toasts={toasts} onRemove={removeToast} />

      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Remove Patient"
        message={`Are you sure you want to remove patient "${confirmTarget}"? This action cannot be undone.`}
        confirmLabel="Remove"
        variant="danger"
        loading={processing === confirmTarget}
        onConfirm={handleRemove}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* Search + count bar */}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 sm:p-5 mb-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or username…"
              className="input-field pl-11"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-sm text-slate-500 flex-shrink-0 sm:text-right">
            <span className="font-semibold text-slate-900">{filtered.length}</span> patient{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-14 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-14 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">{search ? 'No patients match your search' : 'No patients registered yet'}</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table (md+) ─────────────── */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden animate-slide-up delay-75">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Username</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender</th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((patient, i) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/60 transition-colors animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-violet-600" />
                          </div>
                          <span className="font-semibold text-slate-900 text-sm">{patient.user?.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono hidden lg:table-cell">{patient.user?.userName}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">{patient.user?.email}</td>
                      <td className="px-6 py-4">{genderBadge(patient.user?.gender)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setConfirmTarget(patient.user.userName)}
                          disabled={processing === patient.user.userName}
                          className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-40"
                          title="Remove patient"
                        >
                          {processing === patient.user.userName
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Mobile card list (< md) ─────────── */}
          <div className="md:hidden space-y-3 animate-slide-up delay-75">
            {filtered.map((patient, i) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl border border-slate-100 card-shadow p-4 animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{patient.user?.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{patient.user?.email}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">@{patient.user?.userName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {genderBadge(patient.user?.gender)}
                    <button
                      onClick={() => setConfirmTarget(patient.user.userName)}
                      disabled={processing === patient.user.userName}
                      className="p-1.5 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Remove patient"
                    >
                      {processing === patient.user.userName
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Patients;
