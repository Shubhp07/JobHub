import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const GoogleLoginPage = () => {
  const handleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      // Send token to backend
      const response = await axios.post('http://localhost:8080/api/oauth2/google', {
        token: credential,
      });

      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      window.location.href = '/dashboard/jobseeker';
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return (
    <GoogleOAuthProvider clientId="413537568741-b85faovlj0nd7qf29enfsbchvn41978v.apps.googleusercontent.com">
      <div className="flex justify-center items-center h-screen">
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.log('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginPage;
