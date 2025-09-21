# MPMA - Mahapola Port and Maritime Academy

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.x-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)

*NOTICE: This project including the README is a work in progress and is not yet complete. The current version is intended for demonstration purposes only.*

A comprehensive Learning Management System designed for the Mahapola Port and Maritime Academy, providing interfaces for course management, content delivery, student tracking, and academic administration.

![MPMA Dashboard Screenshot](https://via.placeholder.com/800x400?text=MPMA+Dashboard+Preview)

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Authentication & Security](#-authentication--security)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🌟 Project Overview

MPMA (Mahapola Port and Maritime Academy) is a full-stack web application designed to manage academic programs, courses, teaching and training resources. It provides interfaces for lecturers, students, trainers, trainees, and administrators to interact with educational content and track academic progress.

### Purpose
The system aims to digitize and streamline educational management processes for maritime education, allowing for:
- Centralized course content management
- Efficient communication between faculty and students
- Paperless assignment submission and grading
- Comprehensive tracking of academic performance
- Administrative oversight of all educational activities

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.x with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with DaisyUI
- **State Management**: React Hooks and Context API
- **UI Components**: Headless UI, HeroIcons
- **Development Tools**: ESLint, Prettier

### Backend
- **Framework**: Spring Boot 3.4.x
- **Language**: Java 23
- **Database**: PostgreSQL 16
- **ORM**: Spring Data JPA
- **API Documentation**: Swagger UI (SpringDoc OpenAPI)
- **Authentication/Authorization**: Spring Security
- **Environment Management**: Dotenv Java

### DevOps
- **Containerization**: Docker
- **Monitoring**: cAdvisor
- **Version Control**: Git
- **Deployment**: Docker Compose

## 💡 Key Features

- **Course Management System**
  - Create and organize courses by semester, department, and program
  - Set up course prerequisites and co-requisites
  - Manage course enrollment and capacity

- **Faculty Member Portal**
  - Create and manage course announcements with visibility controls
  - Upload and organize lecture materials and resources
  - Schedule and manage lectures with room assignments
  - Create, assign, and grade assignments and assessments

- **Student Dashboard**
  - Access course materials and announcements
  - Submit assignments and track submission status
  - View grades and academic progress
  - Receive notifications about course updates

- **Administrative Controls**
  - User management for all system roles
  - Course catalog administration
  - System-wide announcements and notifications
  - Academic calendar management

- **Supporting Features**
  - Integrated grade tracking and reporting
  - File upload and management system
  - Full-text search for course materials
  - Mobile-responsive design

## 📸 Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Dashboard
![Dashboard](https://via.placeholder.com/800x450?text=Dashboard)

### Course Page
![Course Page](https://via.placeholder.com/800x450?text=Course+Page)

### Lecture Management
![Lecture Management](https://via.placeholder.com/800x450?text=Lecture+Management)

### Assignment Submission
![Assignment Submission](https://via.placeholder.com/800x450?text=Assignment+Submission)
</details>

## 📁 Project Structure

```
mpma/
├── README.md
├── Software/
│   ├── Backend/
│   │   └── backend/            # Spring Boot application
│   ├── Database/
│   │   └── mpma/              # Database scripts and migrations
│   ├── Docker/
│   │   └── docker-compose.yaml # Docker configuration
│   └── Frontend/
│       └── mpma/              # Next.js application
├── SRS/                       # Software Requirements Specification
└── UML Diagrams/              # Project design diagrams
```

### Backend Structure
The backend follows a layered architecture:
- **Controllers**: REST API endpoints
- **Services**: Business logic
- **Repositories**: Data access
- **Models**: Entity definitions
- **DTOs**: Data Transfer Objects for API responses
- **Config**: Application configuration

### Frontend Structure
The frontend follows a component-based architecture:
- **app/**: Next.js pages and routing
- **components/**: Reusable UI components
- **contexts/**: React Context providers
- **services/**: API integration services
- **types/**: TypeScript type definitions
- **utils/**: Helper functions and utilities

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- Java 23 (for local backend development)
- Node.js 20+ (for local frontend development)
- PostgreSQL 16 (for local database development)
- Git (for version control)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/RandithaK/mpma.git
   cd mpma
   ```
   or using GitHub CLI:
   ```bash
   gh repo clone RandithaK/mpma
   cd mpma
   ```

2. Start the application using Docker Compose:
   ```bash
   cd Software/Docker
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:13000
   - Backend API: http://localhost:18080
   - API Documentation: http://localhost:18080/swagger-ui.html
   - Monitoring: http://localhost:13080

### Local Development Setup

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd Software/Frontend/mpma
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   NEXT_PUBLIC_APP_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The frontend will be available at http://localhost:3000

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd Software/Backend/backend
   ```

2. Configure the .env file:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mpma
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=postgres
   SPRING_JPA_HIBERNATE_DLL_AUTO=update
   JWT_SECRET=your_secure_jwt_signing_key
   JWT_EXPIRATION=86400
   ```

3. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend API will be available at http://localhost:8080

5. Access the OpenAPI documentation:
   
   Try the following URLs (in this order) if one doesn't work:
   
   For local development:
   - http://localhost:8080/swagger-ui/index.html
   
   For Docker deployment:
   - http://localhost:18080/swagger-ui/index.html

#### Database

1. Make sure PostgreSQL is installed and running
2. Create a database named `mpma`:
   ```sql
   CREATE DATABASE mpma;
   ```
3. Run the Backend application to automatically create the necessary tables.
## 🔐 Authentication & Security

### Authentication System
- **JWT-based Authentication**: Secure authentication using JSON Web Tokens
  - `JwtTokenUtil` handles token generation, validation, and extraction of user details
  - `JwtRequestFilter` intercepts all requests to validate tokens in the Authorization header
  - Token is passed in requests via `Bearer {token}` in the Authorization header
- **Token Management**: 
  - Tokens expire after 24 hours (configurable via `jwt.expiration`)
  - Authentication state persisted client-side in both localStorage and cookies
- **Login Process**:
  - Frontend sends credentials to `/api/auth/login` endpoint
  - Backend `AuthController` validates credentials, generates JWT, and returns user details
  - Failed authentication attempts are logged and return appropriate error responses

### Security Features
- **Role-based Access Control**: Implementation with five distinct user roles:
  - Spring Security roles are prefixed with `ROLE_` (e.g., `ROLE_ADMINISTRATOR`)
  - Backend: Method-level security with `@PreAuthorize` annotations:
    ```java
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'LECTURER')")
    ```
  - Frontend: Route protection in `middleware.ts` with role-to-route mapping:
    ```typescript
    const roleRouteMapping: Record<string, string[]> = {
      LECTURER: ["/facultyMember"],
      STUDENT: ["/student"],
      // ... other role mappings
    }
    ```
- **Protected API Endpoints**: Secured with multiple protection layers:
  - Global security configuration in `WebSecurityConfig` with path-based rules
  - Public endpoints explicitly defined (e.g., `/api/auth/**`, `/status`)
  - Role-specific endpoint protection (e.g., `/api/admin/**` for administrators only)
- **Password Security**: BCrypt hashing with strength factor 12 (higher than default)
- **CORS Configuration**: Configured in `WebSecurityConfig` with:
  - Allowed origins, methods, and headers
  - Authorization header exposed for cross-origin requests
  - Custom CORS configuration source bean

### Security Configuration
The security settings can be customized in:
- Backend: `application.properties` or `.env` file with the following parameters:
  ```
  jwt.secret=your_secure_jwt_signing_key
  jwt.expiration=86400  # Token validity in seconds (24 hours)
  ```
- Frontend: Authentication state managed via React Context API in `AuthContext.tsx`
  - JWT tokens stored in both localStorage and HTTP cookies for different access patterns
  - User details and role information persisted for efficient access control

## 🔧 Configuration

The application can be configured through environment variables defined in:
- Frontend: `.env.local` file in the Frontend/mpma directory
- Backend: `.env` file in the Backend/backend directory

### Environment Variables

#### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_ENV=development|production
```

#### Backend
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/mpma
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DLL_AUTO=update
JWT_SECRET=your_secure_jwt_signing_key
JWT_EXPIRATION=86400
FILE_UPLOAD_DIRECTORY=./uploads
```

## 📚 API Documentation

- API Documentation is auto-generated using SpringDoc OpenAPI
- Access the interactive API documentation at `/swagger-ui.html` when the backend is running
- The OpenAPI specification is available at `/v3/api-docs`
- Project documentation is available in the `SRS` directory
- UML diagrams showing the system architecture are in the `UML Diagrams` directory
## 🤝 Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guidelines before submitting pull requests. Here's an overview:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests if available
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## ⚠️ Troubleshooting

### Common Issues and Solutions

- **CORS Errors**:
  - Ensure your browser allows CORS or use a CORS browser extension for development
  - Verify the backend CORS configuration includes your frontend origin

- **JWT Authentication Issues**:
  - Check that tokens haven't expired (default is 24 hours)
  - Verify your Authorization header is formatted correctly (`Bearer <token>`)

- **Docker Deployment Problems**:
  - Ensure ports are not in use by other applications
  - Check Docker logs with `docker-compose logs -f`

### Getting Help
If you encounter issues, please:
1. Check the existing issues in the repository
2. Consult the documentation in the SRS directory
3. Open a new issue with detailed information about your problem

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Group Laser from the University of Moratuwa for Level 2 Software Project.
