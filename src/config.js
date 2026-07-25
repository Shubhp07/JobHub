// Centralized API configuration
// In development, this defaults to localhost:8080
// In production, set VITE_API_BASE_URL to your Elastic Beanstalk URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
