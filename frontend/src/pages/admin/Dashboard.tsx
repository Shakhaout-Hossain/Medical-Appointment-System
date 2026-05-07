import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { DoctorProfile, PatientProfile } from '../../types';
import { Users, UserCheck, UserX, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [unapproved, setUnapproved] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes, unapprovedRes] = await Promise.all([
          adminService.getApprovedDoctors(),
          adminService.getPatients(),
          adminService.getUnapprovedDoctors(),
        ]);
        setDoctors(doctorsRes || []);
        setPatients(patientsRes.patients || []);
        setUnapproved(unapprovedRes || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
          <p className="text-gray-500 text-sm">Total Patients</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{doctors.length}</h3>
          <p className="text-gray-500 text-sm">Approved Doctors</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{unapproved.length}</h3>
          <p className="text-gray-500 text-sm">Pending Approvals</p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pending Doctor Approvals</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : unapproved.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-3" />
              <p className="text-gray-500">All doctors are approved</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unapproved.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                      <UserX className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Dr. {doctor.user?.fullName}</p>
                      <p className="text-sm text-gray-500">{doctor.specialty} - {doctor.qualification}</p>
                    </div>
                  </div>
                  <a
                    href="/dashboard/approvals"
                    className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Review
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No patients registered yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{patient.user?.fullName}</p>
                    <p className="text-sm text-gray-500">{patient.user?.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-500">{patient.user?.userName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
