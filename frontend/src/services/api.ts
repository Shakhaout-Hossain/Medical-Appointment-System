import axios from 'axios';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AppointmentRequest,
  PrescriptionRequest,
  PaginatedResponse,
  DoctorProfile,
  PatientProfile,
  Appointment,
  Prescription
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set Basic Auth header for all subsequent requests
export const setAuthHeader = (userName: string, password: string) => {
  if (userName && password) {
    const credentials = btoa(`${userName}:${password}`);
    api.defaults.headers.common['Authorization'] = `Basic ${credentials}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth Service
export const authService = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await api.post<User>('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },
};

// Patient Service
export const patientService = {
  getDoctors: async (page = 0, size = 100, sortBy = 'specialty', sortDir = 'asc'): Promise<PaginatedResponse<DoctorProfile>> => {
    const response = await api.get<PaginatedResponse<DoctorProfile>>('/patient/doctors', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  },
  createAppointment: async (data: AppointmentRequest): Promise<any> => {
    const response = await api.post('/patient/appointment', data);
    return response.data;
  },
  getAppointments: async (page = 0, size = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/patient/appointments', {
      params: { page, size },
    });
    return response.data;
  },
  getUpcomingAppointments: async (page = 0, size = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/patient/appointments/upcoming', {
      params: { page, size },
    });
    return response.data;
  },
  getPreviousAppointments: async (page = 0, size = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/patient/appointments/previous', {
      params: { page, size },
    });
    return response.data;
  },
};

// Doctor Service
export const doctorService = {
  getUpcomingAppointments: async (page = 0, size = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/doctor/appointments/upcoming', {
      params: { page, size },
    });
    return response.data;
  },
  getPreviousAppointments: async (page = 0, size = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>('/doctor/appointments/previous', {
      params: { page, size },
    });
    return response.data;
  },
  getPrescriptions: async (page = 0, size = 10): Promise<PaginatedResponse<Prescription>> => {
    const response = await api.get<PaginatedResponse<Prescription>>('/doctor/prescriptions', {
      params: { page, size },
    });
    return response.data;
  },
  createPrescription: async (patientId: number, data: PrescriptionRequest): Promise<Prescription> => {
    const response = await api.post<Prescription>(`/doctor/patients/${patientId}/prescription`, data);
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getDoctors: async (page = 0, size = 10): Promise<PaginatedResponse<DoctorProfile>> => {
    const response = await api.get<PaginatedResponse<DoctorProfile>>('/admin/doctors', {
      params: { page, size },
    });
    return response.data;
  },
  getPatients: async (page = 0, size = 100): Promise<PaginatedResponse<PatientProfile>> => {
    const response = await api.get<PaginatedResponse<PatientProfile>>('/admin/patients', {
      params: { page, size },
    });
    return response.data;
  },
  approveDoctor: async (userName: string): Promise<string> => {
    const response = await api.put<string>(`/admin/approve-doctor/${userName}`);
    return response.data;
  },
  approveAllDoctors: async (): Promise<string> => {
    const response = await api.put<string>('/admin/approve-all-doctors');
    return response.data;
  },
  removeDoctor: async (userName: string): Promise<string> => {
    const response = await api.delete<string>(`/admin/remove-doctor/${userName}`);
    return response.data;
  },
  removePatient: async (userName: string): Promise<string> => {
    const response = await api.delete<string>(`/admin/remove-patient/${userName}`);
    return response.data;
  },
  getApprovedDoctors: async (): Promise<DoctorProfile[]> => {
    const response = await api.get<DoctorProfile[]>('/admin/doctors/approved');
    return response.data;
  },
  getUnapprovedDoctors: async (): Promise<DoctorProfile[]> => {
    const response = await api.get<DoctorProfile[]>('/admin/doctors/unapproved');
    return response.data;
  },
};

export default api;
