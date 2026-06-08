// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // The JWT is now securely stored in an HttpOnly cookie, so we don't
    // need to extract it from the URL. The browser will automatically 
    // send it with the fetch request below thanks to credentials: "include".

    fetch('http://localhost:8080/api/users/profile', {
      credentials: "include", 
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(user => {
        // Store access token from URL params if present
        const accessToken = params.get('access_token');
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }

        // Store user details for UI state
        localStorage.setItem('user', JSON.stringify(user));

        // Clean URL params by removing the token from browser history
        window.history.replaceState({}, document.title, window.location.pathname);

        // ✅ THE FIX: Compare against 'EMPLOYER' and 'JOBSEEKER' (no underscores)
        const userRole = (user.userType || '').trim().toUpperCase();

        if (userRole === 'EMPLOYER') {
          navigate('/dashboard/employer', { replace: true });
        } else if (userRole === 'JOBSEEKER') {
          navigate('/dashboard/jobseeker', { replace: true });
        } else {
          console.error(`Redirection failed: Unknown role "${user.userType}".`);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        console.error("OAuth process failed:", err);
        localStorage.clear(); // Clear all auth data
        navigate('/login', { replace: true });
      });

  }, [navigate, params]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Finalizing login...</h1>
    </div>
  );
};

export default OAuthSuccess;
