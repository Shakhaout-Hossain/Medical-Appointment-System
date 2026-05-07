import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff, Activity, UserRound, Stethoscope, ShieldCheck } from 'lucide-react';
import type { Role, Gender } from '../types';

type Day = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
const ALL_DAYS: Day[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const roleOptions: { value: Role; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  {
    value: 'PATIENT',
    label: 'Patient',
    icon: <UserRound className="w-5 h-5" />,
    desc: 'Book appointments & manage your health',
    color: 'from-violet-500 to-purple-600',
  },
  {
    value: 'DOCTOR',
    label: 'Doctor',
    icon: <Stethoscope className="w-5 h-5" />,
    desc: 'Manage appointments & patient care',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    icon: <ShieldCheck className="w-5 h-5" />,
    desc: 'Full system administration access',
    color: 'from-rose-500 to-pink-600',
  },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    fullName: '',
    email: '',
    role: 'PATIENT' as Role,
    gender: 'MALE' as Gender,
    dateOfBirth: '',
    address: '',
    description: '',
    specialty: '',
    qualification: '',
    bio: '',
    availableFrom: '09:00',
    availableTo: '17:00',
    workingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as Day[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day: Day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data: any = {
        userName: formData.userName,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        gender: formData.gender,
      };

      if (formData.role === 'PATIENT') {
        data.dateOfBirth = formData.dateOfBirth;
        data.address = formData.address;
        data.description = formData.description;
      } else if (formData.role === 'DOCTOR') {
        data.specialty = formData.specialty;
        data.qualification = formData.qualification;
        data.bio = formData.bio;
        data.availableFrom = formData.availableFrom;
        data.availableTo = formData.availableTo;
        data.workingDays = formData.workingDays;
      }

      await register(data);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roleOptions.find((r) => r.value === formData.role)!;

  return (
    <div className="min-h-screen bg-slate-50 flex items-start sm:items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl animate-slide-up">

        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">MediConnect</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join thousands of patients and doctors</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-7">

          {/* Role selector */}
          <div className="mb-5 sm:mb-6">
            <p className="text-sm font-medium text-slate-700 mb-3">I am a…</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {roleOptions.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r.value })}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-3.5 rounded-xl border-2 transition-all text-center ${
                    formData.role === r.value
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center ${
                      formData.role === r.value
                        ? `bg-gradient-to-br ${r.color} text-white shadow`
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {r.icon}
                  </div>
                  <span className={`text-xs font-semibold ${formData.role === r.value ? 'text-primary-700' : 'text-slate-600'}`}>
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">{selectedRole.desc}</p>
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl mb-5 text-sm animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Base fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
                <input type="text" name="userName" value={formData.userName} onChange={handleChange} className="input-field" placeholder="johndoe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="John Doe" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-11"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Patient fields */}
            {formData.role === 'PATIENT' && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-slide-up">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider pt-2">Patient Details</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="Your home address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Medical Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input-field resize-none" rows={2} placeholder="Any pre-existing conditions…" />
                </div>
              </div>
            )}

            {/* Doctor fields */}
            {formData.role === 'DOCTOR' && (
              <div className="space-y-4 pt-2 border-t border-slate-100 animate-slide-up">
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider pt-2">Doctor Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Specialty</label>
                    <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="input-field" placeholder="e.g. Cardiology" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Qualification</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="input-field" placeholder="e.g. MBBS, MD" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="input-field resize-none" rows={2} placeholder="Brief professional summary…" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Available From</label>
                    <input type="time" name="availableFrom" value={formData.availableFrom} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Available To</label>
                    <input type="time" name="availableTo" value={formData.availableTo} onChange={handleChange} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formData.workingDays.includes(day)
                            ? 'bg-sky-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#818cf8'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
              }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
