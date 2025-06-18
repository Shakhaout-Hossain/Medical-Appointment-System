package com.medisoft.medicalapp.service;

import com.medisoft.medicalapp.dto.AppointmentRequestDto;
import com.medisoft.medicalapp.entity.Appointment;
import com.medisoft.medicalapp.entity.DoctorProfile;
import com.medisoft.medicalapp.entity.PatientProfile;
import com.medisoft.medicalapp.entity.User;
import com.medisoft.medicalapp.enums.AppointmentStatus;
import com.medisoft.medicalapp.enums.PaymentStatus;
import com.medisoft.medicalapp.enums.Role;
import com.medisoft.medicalapp.exception.InvalidCredentialsException;
import com.medisoft.medicalapp.exception.UserNotFoundException;
import com.medisoft.medicalapp.repository.AppointmentRepository;
import com.medisoft.medicalapp.repository.DoctorProfileRepository;
import com.medisoft.medicalapp.repository.PatientProfileRepository;
import com.medisoft.medicalapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientProfileRepository patientProfileRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;


    @Override
    @Transactional
    public Appointment createAppointment(String username, AppointmentRequestDto dto) throws AccessDeniedException {

        User user = userRepository.findByUserName(username)
                .orElseThrow(()->new UserNotFoundException("User not found"));
        checkPatientRole(user);

        PatientProfile patientProfile = patientProfileRepository.findByUser_UserName(username)
                .orElseThrow(()-> new UserNotFoundException("Patient profile not found"));
//        DoctorProfile doctorProfile = doctorProfileRepository.findById(dto.getDoctorId())
//                .orElseThrow(()->new UserNotFoundException("Doctor not found"));

        DoctorProfile doctorProfile = doctorProfileRepository.findByIdAndApprovedTrue(dto.getDoctorId())
                .orElseThrow(() -> new UserNotFoundException("Doctor not found or not approved"));


        // Validate appointment time (must be in the future and start at a 15-minute interval)
        validateAppointmentTime(dto.getAppointmentTime());

        // Validate doctor's working schedule (day and time window)
        validateDoctorAvailability(doctorProfile, dto.getAppointmentTime());

        // Check if the doctor already has an appointment in the requested time slot.
        // Assume appointment duration is fixed to 15 minutes.
        LocalDateTime appointmentStart = dto.getAppointmentTime();
        LocalDateTime appointmentEnd = appointmentStart.plusMinutes(15);
        List<Appointment> overlappingAppointments =
                appointmentRepository.findOverlappingAppointments(doctorProfile, appointmentStart, appointmentEnd);

        if (!overlappingAppointments.isEmpty()) {
            throw new InvalidCredentialsException("The doctor is already booked for this time slot.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patientProfile)
                .doctor(doctorProfile)
                .appointmentTime(dto.getAppointmentTime())
                .status(AppointmentStatus.PENDING)
                .notes(dto.getNotes())
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        return appointmentRepository.save(appointment);
    }

    // Validate that the appointment is in the future and starts on a 30-minute interval.
    private void validateAppointmentTime(LocalDateTime appointmentTime){
        if (appointmentTime.isBefore(LocalDateTime.now())){
            throw new InvalidCredentialsException("Appointment time must be in the future.");
        }
        if (appointmentTime.getMinute() % 15 !=0){
            throw new InvalidCredentialsException("Appointments must start at 15-minute intervals.");
        }
    }

    // Validate the doctor's availability: working day and within working hours.
    private void validateDoctorAvailability(DoctorProfile doctorProfile, LocalDateTime time){
        DayOfWeek day = time.getDayOfWeek();
        LocalTime localTime = time.toLocalTime();

        if (!doctorProfile.getWorkingDays().contains(day)) {
            throw new InvalidCredentialsException("Doctor is not available on " + day );
        }
        if (doctorProfile.getAvailableFrom() == null || doctorProfile.getAvailableTo() == null) {
            throw new IllegalArgumentException("Doctor's working hours are not defined.");
        }
        if (localTime.isBefore(doctorProfile.getAvailableFrom())||localTime.isAfter(doctorProfile.getAvailableTo())){
            throw new InvalidCredentialsException("Doctor is not available at this time.\n"+ "Try " + doctorProfile.getAvailableFrom() + " To "+ doctorProfile.getAvailableTo() + " time Interval.");
        }
    }

    //Validate Role
    private void checkPatientRole(User user) throws AccessDeniedException {
        if (user.getRole() != Role.PATIENT) {
            throw new AccessDeniedException("Only patients can create appointments.");
        }
    }

//    public void confirmAppointmentIfPaid(Long appointmentId) {
//        Appointment appointment = appointmentRepository.findById(appointmentId)
//                .orElseThrow(() -> new RuntimeException("Appointment not found"));
//
//        if (appointment.getStatus() == AppointmentStatus.PENDING) {
//            appointment.setStatus(AppointmentStatus.CONFIRMED);
//            appointment.setPaymentStatus(PaymentStatus.SUCCESS);
//            appointmentRepository.save(appointment);
//        }
//    }
}
