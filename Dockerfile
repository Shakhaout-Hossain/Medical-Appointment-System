# Step 1: Build stage (using Maven and JDK 21)
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (for cache efficiency)
COPY pom.xml .

RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Step 2: Run stage (slim JRE for running the app)
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/medical-appointment-system-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app uses (default 8080)
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java","-jar","app.jar"]
