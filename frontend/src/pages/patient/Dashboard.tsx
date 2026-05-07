import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientService } from '../../services/api';
import type { Appointment } from '../../types';
import { Calendar, Clock, User, Stethoscope, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

const PatientDashboard = () => {
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [previous, setPrevious] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [upcomingRes, previousRes] = await Promise.all([
          patientService.getUpcomingAppointments(),
          patientService.getPreviousAppointments(),
        ]);
        setUpcoming(upcomingRes.appointments || []);
        setPrevious(previousRes.appointments || []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-warning-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-danger-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-primary-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{upcoming.length}</h3>
          <p className="text-gray-500 text-sm">Upcoming Appointments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{previous.length}</h3>
          <p className="text-gray-500 text-sm">Completed Visits</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">--</h3>
          <p className="text-gray-500 text-sm">Prescriptions</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
              <a href="/dashboard/doctors" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
                Book an appointment →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">Dr. {apt.doctor?.user?.fullName}</p>
                    <p className="text-sm text-gray-500">{apt.doctor?.specialty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{formatDate(apt.appointmentTime)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(apt.status)}
                      <span className="text-xs text-gray-500 capitalize">{apt.status.toLowerCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Previous Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Previous Appointments</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : previous.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No previous appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {previous.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">Dr. {apt.doctor?.user?.fullName}</p>
                    <p className="text-sm text-gray-500">{apt.doctor?.specialty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{formatDate(apt.appointmentTime)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getStatusIcon(apt.status)}
                      <span className="text-xs text-gray-500 capitalize">{apt.status.toLowerCase()}</span>
                    </div>
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

export default PatientDashboard;
