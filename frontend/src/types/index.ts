export type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface User {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  role: Role;
  gender: Gender;
  enabled: boolean;
}

export interface DoctorProfile {
  id: number;
  user: User;
  specialty: string;
  qualification: string;
  bio: string;
  approved: boolean;
  availableFrom: string;
  availableTo: string;
  workingDays: string[];
}

export interface PatientProfile {
  id: number;
  user: User;
  dateOfBirth: string;
  address: string;
  description: string;
}

export interface Appointment {
  id: number;
  patientUserUserName: string;
  doctor: DoctorProfile;
  appointmentTime: string;
  notes: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Prescription {
  id: number;
  patient: PatientProfile;
  doctor: DoctorProfile;
  medications: string;
  notes: string;
  createdAt: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
  gender: Gender;
  dateOfBirth?: string;
  address?: string;
  description?: string;
  specialty?: string;
  qualification?: string;
  bio?: string;
  availableFrom?: string;
  availableTo?: string;
  workingDays?: string[];
}

export interface AppointmentRequest {
  doctorId: number;
  appointmentTime: string;
  notes: string;
}

export interface PrescriptionRequest {
  medications: string;
  notes: string;
}

export interface PaginatedResponse<T> {
  appointments?: T[];
  doctors?: T[];
  patients?: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
