import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ username: data.user.username }));
        alert('Login successful! Welcome, ' + data.user.username);
        navigate('/location');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signin');
  };
//   const handleGoogleSuccess = async (credentialResponse) => {
//     console.log("Google success", credentialResponse);
//   try {
//     const response = await fetch('http://localhost:5000/api/google-login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         token: credentialResponse.credential
//       })
//     });

//     const data = await response.json();

//     if (response.ok) {
//       localStorage.setItem('user', JSON.stringify(data.user));
//       navigate('/location');
//     }

//   } catch (error) {
//     console.error("Google login error", error);
//   }
// };
const handleGoogleSuccess = async (credentialResponse) => {
  console.log("Google success", credentialResponse);

  try {
    const response = await fetch('http://localhost:5000/api/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: credentialResponse.credential
      })
    });

    console.log("response", response);

    const data = await response.json();
    console.log("data", data);

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/location');
    }

  } catch (error) {
    console.error("Google login error", error);
  }
};

  return (
    <main className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>🏥 Hospital Login</h2>
        
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        <div className="form-group">
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        
        <button 
          type="submit"
          className="login-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
            />
        </div>

        <p className="signup-text">
          Don't have an account? <button type="button" className="signup-link" onClick={handleSignup}>Sign up here</button>
        </p>
      </form>
    </main>
  );
};

export default Login;
