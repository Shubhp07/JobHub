# JobHub Backend API

A comprehensive Spring Boot backend for a job portal application with features for job seekers and employers.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Job Seeker, Employer, Admin)
- Email verification
- Password reset functionality
- Refresh token support

### User Management
- User registration and profile management
- Profile picture and resume upload
- Skill management
- Experience and education tracking
- User search for employers

### Job Management
- Job posting creation and management
- Advanced job search with filters
- Job recommendations
- Job status management
- Employer job dashboard

### Application System
- Job application submission
- Application status tracking
- Employer application management
- Application statistics

### Messaging System
- Direct messaging between users
- Conversation management
- Unread message tracking
- Real-time messaging support

### Additional Features
- Saved jobs functionality
- File upload support
- Email notifications
- API documentation with Swagger
- Comprehensive error handling

## Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL (with H2 for testing)
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI 3
- **Email**: Spring Mail
- **File Storage**: Local file system (configurable)
- **Build Tool**: Maven

## Getting Started

### Prerequisites
- Java 17 or higher
- PostgreSQL database
- Maven 3.6+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-portal-backend
```

2. Configure database in `application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobhub
    username: your_username
    password: your_password
```

3. Configure email settings
```yaml
spring:
  mail:
    host: smtp.gmail.com
    username: your-email@gmail.com
    password: your-app-password
```

4. Build and run the application
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### API Documentation

Once the application is running, you can access:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/picture` - Upload profile picture
- `POST /api/users/resume` - Upload resume
- `GET /api/users/search` - Search job seekers (Employers only)
- `GET /api/users/{userId}` - Get user profile by ID
- `DELETE /api/users/profile` - Delete user account

### Job Management
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/{jobId}` - Get job by ID
- `POST /api/jobs` - Create new job (Employers only)
- `PUT /api/jobs/{jobId}` - Update job (Employers only)
- `DELETE /api/jobs/{jobId}` - Delete job (Employers only)
- `PUT /api/jobs/{jobId}/status` - Update job status (Employers only)
- `GET /api/jobs/my-jobs` - Get employer's jobs
- `GET /api/jobs/recommendations` - Get job recommendations

### Job Applications
- `POST /api/applications` - Apply for a job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/job/{jobId}` - Get job applications (Employers only)
- `GET /api/applications/{applicationId}` - Get application details
- `PUT /api/applications/{applicationId}/status` - Update application status (Employers only)
- `DELETE /api/applications/{applicationId}` - Withdraw application
- `GET /api/applications/employer/all` - Get all employer applications
- `GET /api/applications/stats` - Get application statistics

### Saved Jobs
- `POST /api/saved-jobs/{jobId}` - Save a job
- `DELETE /api/saved-jobs/{jobId}` - Remove saved job
- `GET /api/saved-jobs` - Get all saved jobs
- `GET /api/saved-jobs/check/{jobId}` - Check if job is saved

### Messaging
- `POST /api/messages` - Send a message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/{userId}` - Get conversation with user
- `PUT /api/messages/{messageId}/read` - Mark message as read
- `GET /api/messages/unread` - Get unread messages
- `GET /api/messages/unread/count` - Get unread message count
- `DELETE /api/messages/{messageId}` - Delete a message

## Database Schema

The application uses the following main entities:
- **User**: User accounts with roles and profile information
- **Job**: Job postings with details and requirements
- **JobApplication**: Applications submitted by job seekers
- **SavedJob**: Jobs saved by users for later reference
- **Message**: Direct messages between users
- **Skill**: Skills that can be associated with users and jobs
- **Experience**: Work experience records
- **Education**: Education records

## Configuration

### Environment Variables
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `MAIL_HOST`: SMTP server host
- `MAIL_USERNAME`: Email username
- `MAIL_PASSWORD`: Email password
- `FILE_UPLOAD_DIR`: Directory for file uploads
- `FRONTEND_URL`: Frontend application URL

### Security
- JWT tokens expire in 24 hours (configurable)
- Refresh tokens expire in 7 days (configurable)
- Passwords are encrypted using BCrypt
- CORS is configured for cross-origin requests

## Testing

Run tests with:
```bash
mvn test
```

## Deployment

### Production Configuration
1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `mvn clean package`
4. Run with: `java -jar target/job-portal-backend-1.0.0.jar`

### Docker Deployment
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/job-portal-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.