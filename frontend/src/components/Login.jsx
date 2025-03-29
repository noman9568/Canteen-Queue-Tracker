import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../form.css';

const Login = ({ setToken, setRole, setUsername }) => {
  const [data, setData] = useState({
    userId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (response.ok) {
        setToken(result.token);
        setRole(result.role);
        setUsername(result.name);
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.role);
        navigate(result.role === "admin" ? "/admindashboard" : "/");
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='formContainer'>
      <form onSubmit={handleSubmit} className='Form'>
        <h1>Welcome Back</h1>
        <p className="form-subtitle">Sign in to your account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="userId">User ID</label>
          <input 
            type='text' 
            id="userId"
            name='userId' 
            value={data.userId} 
            onChange={handleChange} 
            placeholder='Enter your User ID' 
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type='password' 
            id="password"
            name='password' 
            value={data.password}
            onChange={handleChange} 
            placeholder='Enter your password' 
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type='submit' 
            className='loginButton' 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className='forgotpwd'>Forgot password?</div>
        </div>
      </form>
    </div>
  );
}

export default Login;