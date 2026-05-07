import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminService } from '../../services/api';
import type { DoctorProfile } from '../../types';
import { UserX, CheckCircle, Trash2, Loader2 } from 'lucide-react';

const Approvals = () => {
  const [unapproved, setUnapproved] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchUnapproved();
  }, []);

  const fetchUnapproved = async () => {
    try {
      const data = await adminService.getUnapprovedDoctors();
      setUnapproved(data || []);
    } catch (err) {
      console.error('Failed to fetch unapproved doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userName: string) => {
    setProcessing(userName);
    try {
      await adminService.approveDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => d.user.userName !== userName));
    } catch (err) {
      console.error('Failed to approve doctor:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveAll = async () => {
    setProcessing('all');
    try {
      await adminService.approveAllDoctors();
      setUnapproved([]);
    } catch (err) {
      console.error('Failed to approve all doctors:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemove = async (userName: string) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${userName}?`)) return;
    setProcessing(userName);
    try {
      await adminService.removeDoctor(userName);
      setUnapproved((prev) => prev.filter((d) => d.user.userName !== userName));
    } catch (err) {
      console.error('Failed to remove doctor:', err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <DashboardLayout title="Doctor Approvals">
      {unapproved.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleApproveAll}
            disabled={processing === 'all'}
            className="px-4 py-2.5 bg-success-600 text-white rounded-xl hover:bg-success-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {processing === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve All
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : unapproved.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircle className="w-12 h-12 text-success-400 mx-auto mb-3" />
          <p className="text-gray-500">No pending approvals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unapproved.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-warning-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserX className="w-7 h-7 text-warning-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Dr. {doctor.user?.fullName}</h3>
                  <p className="text-sm text-primary-600 font-medium">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500">{doctor.qualification}</p>
                </div>
              </div>

              {doctor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
              )}

              <div className="text-sm text-gray-500 mb-4">
                <p>
                  <span className="font-medium">Username:</span> {doctor.user?.userName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {doctor.user?.email}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(doctor.user.userName)}
                  disabled={processing === doctor.user.userName}
                  className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-xl hover:bg-success-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing === doctor.user.userName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleRemove(doctor.user.userName)}
                  disabled={processing === doctor.user.userName}
                  className="px-4 py-2.5 border border-danger-200 text-danger-600 rounded-xl hover:bg-danger-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Approvals;
