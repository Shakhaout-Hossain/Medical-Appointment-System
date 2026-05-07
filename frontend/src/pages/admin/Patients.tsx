import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { PatientProfile } from '../../types';
import { Users, Trash2, Loader2, User } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await adminService.getPatients();
        setPatients(res.patients || []);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleRemove = async (userName: string) => {
    if (!window.confirm(`Are you sure you want to remove patient ${userName}?`)) return;
    setProcessing(userName);
    try {
      await adminService.removePatient(userName);
      setPatients((prev) => prev.filter((p) => p.user.userName !== userName));
    } catch (err) {
      console.error('Failed to remove patient:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <DashboardLayout title="Patients">
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No patients registered yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Patient</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Username</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Gender</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{patient.user?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.user?.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.user?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.user?.gender}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(patient.user.userName)}
                        disabled={processing === patient.user.userName}
                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {processing === patient.user.userName ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Patients;
