-- Insert sample skills
INSERT INTO skills (name, description, category, created_at) VALUES
('Java', 'Object-oriented programming language', 'TECHNICAL', NOW()),
('Python', 'High-level programming language', 'TECHNICAL', NOW()),
('JavaScript', 'Programming language for web development', 'TECHNICAL', NOW()),
('React', 'JavaScript library for building user interfaces', 'TECHNICAL', NOW()),
('Spring Boot', 'Java framework for building applications', 'TECHNICAL', NOW()),
('SQL', 'Structured Query Language for databases', 'TECHNICAL', NOW()),
('AWS', 'Amazon Web Services cloud platform', 'TECHNICAL', NOW()),
('Docker', 'Containerization platform', 'TECHNICAL', NOW()),
('Communication', 'Effective verbal and written communication', 'SOFT_SKILL', NOW()),
('Leadership', 'Ability to lead and manage teams', 'SOFT_SKILL', NOW()),
('Problem Solving', 'Analytical thinking and problem resolution', 'SOFT_SKILL', NOW()),
('Project Management', 'Planning and executing projects', 'SOFT_SKILL', NOW());

-- Insert sample users (passwords are 'password123' encoded with BCrypt)
INSERT INTO users (first_name, last_name, email, password, user_type, email_verified, is_active, created_at, updated_at) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'JOBSEEKER', true, true, NOW(), NOW()),
('Jane', 'Smith', 'jane.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'EMPLOYER', true, true, NOW(), NOW()),
('Mike', 'Johnson', 'mike.johnson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'JOBSEEKER', true, true, NOW(), NOW()),
('Sarah', 'Wilson', 'sarah.wilson@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'EMPLOYER', true, true, NOW(), NOW());

-- Insert sample jobs
INSERT INTO jobs (title, description, requirements, location, job_type, experience_level, salary_min, salary_max, company, status, employer_id, created_at, updated_at) VALUES
('Senior Java Developer', 'We are looking for an experienced Java developer to join our team.', 'Bachelor''s degree in Computer Science, 5+ years of Java experience, Spring Boot knowledge', 'San Francisco, CA', 'FULL_TIME', 'SENIOR_LEVEL', 120000, 150000, 'TechCorp Inc.', 'ACTIVE', 2, NOW(), NOW()),
('Frontend React Developer', 'Join our frontend team to build amazing user interfaces.', 'Bachelor''s degree, 3+ years React experience, JavaScript proficiency', 'New York, NY', 'FULL_TIME', 'MID_LEVEL', 90000, 120000, 'WebSolutions LLC', 'ACTIVE', 4, NOW(), NOW()),
('Python Data Scientist', 'Analyze data and build machine learning models.', 'Master''s degree in Data Science, Python, SQL, Machine Learning experience', 'Remote', 'FULL_TIME', 'MID_LEVEL', 100000, 130000, 'DataTech Corp', 'ACTIVE', 2, NOW(), NOW()),
('DevOps Engineer', 'Manage our cloud infrastructure and deployment pipelines.', 'Bachelor''s degree, AWS certification, Docker, Kubernetes experience', 'Seattle, WA', 'FULL_TIME', 'SENIOR_LEVEL', 110000, 140000, 'CloudFirst Inc.', 'ACTIVE', 4, NOW(), NOW());