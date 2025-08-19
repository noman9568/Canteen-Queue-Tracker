import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../form.css';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    admissionNo: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`{API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
      console.error("Error in submitting the form: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='formContainer'>
      <form onSubmit={handleSubmit} className='Form'>
        <h1>Create Account</h1>
        <p className="form-subtitle">Sign up to access the canteen services</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type='text' 
            id="name"
            name='name' 
            placeholder='Enter your name' 
            value={data.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type='email' 
            id="email"
            name='email' 
            placeholder='Enter your email' 
            value={data.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="admissionNo">Admission Number</label>
          <input 
            type='text' 
            id="admissionNo"
            name='admissionNo' 
            placeholder='Enter your admission number' 
            value={data.admissionNo} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type='password' 
            id="password"
            name='password' 
            placeholder='Create a secure password' 
            value={data.password} 
            onChange={handleChange} 
            required 
            minLength="6"
          />
        </div>
        
        <div className="form-actions register-actions">
          <button 
            type='submit' 
            className='registerButton' 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <p className="login-link">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;