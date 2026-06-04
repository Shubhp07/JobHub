// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    localStorage.setItem('token', token);

    fetch('http://localhost:8080/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user));

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
