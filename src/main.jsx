import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { JobProvider } from './context/JobContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="413537568741-b85faovlj0nd7qf29enfsbchvn41978v.apps.googleusercontent.com">
      <JobProvider>
      <App />
      </JobProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
