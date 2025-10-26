import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginData } from '../types';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing again
    if (error) setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError(''); // Clear any existing error

    try {
      await login(formData);
      // Only navigate on successful login
      navigate('/');
    } catch (error: any) {
      // Set error message and keep it visible
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(errorMessage);
      
      // Don't navigate on error - stay on login page
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.inputGroup}>
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="username"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div style={styles.error} role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              backgroundColor: isLoading ? '#bdc3c7' : '#3498db',
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#ecf0f1',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
    color: '#2c3e50',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.9rem',
    textAlign: 'center' as const,
    backgroundColor: '#fdf2f2',
    border: '1px solid #e74c3c',
    borderRadius: '4px',
    padding: '0.75rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  linkText: {
    textAlign: 'center' as const,
    marginTop: '1rem',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
  },
};

export default Login;