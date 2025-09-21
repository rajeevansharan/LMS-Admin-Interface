# Stage 1: The Build Stage - Use a full JDK with Maven to build our application
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app

# Copy the pom.xml first to leverage Docker's layer caching.
# If dependencies haven't changed, this layer won't be re-run.
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application, creating the .jar file. Skip tests in the CI build.
RUN mvn package -DskipTests


# Stage 2: The Final Stage - Use a minimal Java Runtime Environment
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the .jar file from the 'build' stage into our final image
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the Spring Boot application runs on
EXPOSE 8080

# The command to run the application when the container starts
ENTRYPOINT ["java","-jar","app.jar"]