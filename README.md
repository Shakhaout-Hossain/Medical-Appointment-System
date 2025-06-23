# MediConnect – Medical Appointment System

In line with best practices for healthcare branding, **MediConnect** is proposed as the project name. MediConnect emphasizes the system’s purpose: seamlessly connecting patients with medical providers for appointment scheduling.

## Overview

MediConnect is a **Spring Boot (v3.4.5)** web application built with **Java 21** and a **MySQL** database. It provides a centralized RESTful API for booking and managing medical appointments, supporting three distinct user roles: Patients, Doctors, and Admins. The application uses Spring Data JPA for ORM, Spring Security for authentication/authorization, and Springdoc OpenAPI (Swagger UI) for interactive API documentation.

Key operations include:

* Patient registration & login
* Appointment requests & status tracking
* Doctor approval workflows by Admin
* Prescription creation by Doctors
* Role-based access control via HTTP Basic auth

## Key Features

* **User Accounts** – Secure registration and login for Patients and Doctors; Admin manages user approval and removal.
* **Appointment Booking** – Patients create appointment requests with date, time, and notes; receive status updates.
* **Doctor Management (Admin)** – Approve/reject individual or bulk doctor registrations; list or remove users.
* **Appointment Management** – Retrieve upcoming, past, or doctor-specific appointments for Patients and Doctors.
* **Prescription Handling** – Doctors generate prescriptions linked to completed appointments.
* **Security** – HTTP Basic authentication over HTTPS; Spring Security enforces role-based access.

## User Roles & Modules

### Patients

* `POST /api/auth/register` & `POST /api/auth/login`
* `POST /api/patient/appointment`
* `GET /api/patient/doctors`, `/api/patient/appointments` (all/upcoming/previous)
* `GET /api/patient/appointments/doctor/{doctorId}`

### Doctors

* `GET /api/doctor/appointments/upcoming`
* `GET /api/doctor/appointments/previous`
* `POST /api/doctor/patients/{patientId}/prescription`

### Admin

* `PUT /api/admin/approve-doctor/{userName}` & `PUT /api/admin/approve-all-doctors`
* `GET /api/admin/patients`, `/api/admin/doctors` (approved/unapproved)
* `DELETE /api/admin/remove-patient/{userName}`, `/api/admin/remove-doctor/{userName}`

### Authentication

* `POST /api/auth/register/batch`
* `POST /api/auth/login`

*All protected endpoints require HTTP Basic credentials.*

## Technology Stack

* **Spring Boot v3.4.5 (Java 21)** – Core framework with embedded Tomcat and auto-configuration.
* **Spring Data JPA** – ORM via Hibernate.
* **MySQL** – Relational database (Connector/J driver).
* **Spring Security** – HTTP Basic authentication and role-based authorization.
* **Springdoc OpenAPI (Swagger UI)** – Interactive API docs at `/swagger-ui/index.html`.
* **Maven** – Build and dependency management.

## Installation & Prerequisites

1. **Java 21** – Install JDK 21 and set `JAVA_HOME` accordingly.
2. **MySQL** – Create a database and configure credentials in `application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/mediconnect
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. **Build & Run**:

   ```bash
   git clone https://github.com/Shakhaout-Hossain/Medical-Appointment-System.git
   cd Medical-Appointment-System
   mvn clean install
   mvn spring-boot:run
   # or: java -jar target/medical-appointment-system.jar
   ```
4. **Configuration** – Set environment variables or `application.properties` for mail, webhooks, etc.

## API Documentation & Deployment

The API is documented via Swagger UI at:
[https://medical-appointment-system-bjsh.onrender.com/swagger-ui/index.html](https://medical-appointment-system-bjsh.onrender.com/swagger-ui/index.html)

The live deployment is available at:
[https://medical-appointment-system-bjsh.onrender.com/](https://medical-appointment-system-bjsh.onrender.com/)

## License

This project is licensed under the [MIT License](LICENSE).

---

*Prepared with Spring Boot 3.4.5 and Java 21.*
