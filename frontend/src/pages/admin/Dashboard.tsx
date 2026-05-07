import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { DoctorProfile, PatientProfile } from '../../types';
import {
  Users,
  UserCheck,
  AlertCircle,
  Loader2,
  CheckCircle,
  UserX,
  ArrowRight,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [unapproved, setUnapproved] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [doctorsRes, patientsRes, unapprovedRes] = await Promise.all([
          adminService.getApprovedDoctors(),
          adminService.getPatients(0, 5), // Fetch first 5 for preview
          adminService.getUnapprovedDoctors(),
        ]);
        setDoctors(doctorsRes || []);
        setPatients(patientsRes.patients || []);
        setTotalPatients(patientsRes.totalItems || 0);
        setUnapproved(unapprovedRes || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const genderBadge = (gender?: string) => {
    const g = gender?.toUpperCase() || '';
    if (g === 'MALE') return <span className="badge badge-male">Male</span>;
    if (g === 'FEMALE') return <span className="badge badge-female">Female</span>;
    return <span className="badge badge-other">{gender || '—'}</span>;
  };

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* ── Welcome Header ────────────────────────────────── */}
      <div className="mb-8 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
              Good Morning, <span className="gradient-text">{user?.fullName?.split(' ')[0]}!</span>
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="w-4 h-4" />
              {currentDate}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 card-shadow text-sm font-medium text-slate-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Live & Stable
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {/* Total Patients */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 card-shadow card-shadow-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              +12%
            </div>
          </div>
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Patients</h3>
          <p className="text-3xl font-bold text-slate-900">{loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : totalPatients}</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Across all regions</span>
            <Link to="/dashboard/patients" className="text-primary-600 font-semibold hover:underline">View</Link>
          </div>
        </div>

        {/* Approved Doctors */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 card-shadow card-shadow-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">VERIFIED</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Active Doctors</h3>
          <p className="text-3xl font-bold text-slate-900">{loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : doctors.length}</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Fully onboarded</span>
            <Link to="/dashboard/doctors" className="text-primary-600 font-semibold hover:underline">Manage</Link>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 card-shadow card-shadow-hover group relative overflow-hidden">
          {unapproved.length > 0 && (
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center -rotate-12 opacity-50 group-hover:scale-125 transition-transform duration-500" />
          )}
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-6 h-6" />
            </div>
            {unapproved.length > 0 && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Pending Review</h3>
          <p className="text-3xl font-bold text-slate-900">{loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : unapproved.length}</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Requires action</span>
            <Link to="/dashboard/approvals" className="text-amber-600 font-semibold hover:underline">Review</Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 card-shadow card-shadow-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
          </div>
          <h3 className="text-sm font-semibold text-slate-500 mb-1">Total Network</h3>
          <p className="text-3xl font-bold text-slate-900">{loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : (totalPatients + doctors.length + unapproved.length)}</p>
          <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
            <span>Growth since inception</span>
            <span className="text-slate-500 font-medium">+1.2k today</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* ── Pending Approvals List ─────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white z-10">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Waitlist
            </h2>
            {unapproved.length > 0 && (
              <Link to="/dashboard/approvals" className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-xl transition-colors">
                All Items
              </Link>
            )}
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500/20" /></div>
            ) : unapproved.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-slate-900 font-bold mb-1">All Caught Up!</h3>
                <p className="text-slate-400 text-sm">No pending doctor registrations require your review right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unapproved.slice(0, 4).map((doctor) => (
                  <div key={doctor.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 group">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                      <UserX className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">Dr. {doctor.user?.fullName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{doctor.specialty} • {doctor.qualification}</p>
                    </div>
                    <Link
                      to="/dashboard/approvals"
                      state={{ selectedDoctorUserName: doctor.user?.userName || (doctor.user as any)?.username }}
                      className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                {unapproved.length > 4 && (
                  <div className="pt-2">
                    <Link to="/dashboard/approvals" className="block text-center p-3 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-bold text-slate-400 hover:border-primary-200 hover:text-primary-500 transition-all">
                      + {unapproved.length - 4} more registrations pending
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Patients ────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-white z-10">
            <div>
              <h2 className="font-bold text-slate-900">Recent Registrations</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Patient Onboarding</p>
            </div>
            <Link to="/dashboard/patients" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500/20" /></div>
            ) : patients.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-slate-400 text-sm font-medium">No patients registered yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group">
                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                      <Users className="w-5 h-5 text-slate-400 group-hover:text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{patient.user?.fullName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{patient.user?.email}</p>
                    </div>
                    <div className="hidden sm:block">
                      {genderBadge(patient.user?.gender)}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 mt-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Weekly Growth</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18%
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-200 h-1 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[18%]" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
