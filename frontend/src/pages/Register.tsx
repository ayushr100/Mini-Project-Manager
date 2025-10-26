import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterData } from '../types';
import ErrorModal from '../components/ErrorModal';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Use a ref to persist error state across component remounts
  const errorRef = useRef<string>('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Restore error state if component remounts
  useEffect(() => {
    if (errorRef.current && !error) {
      setError(errorRef.current);
      setShowErrorModal(true);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user starts typing again
    if (error) {
      setError('');
      setShowErrorModal(false);
      errorRef.current = '';
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    // Keep the error state but hide the modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError(''); // Clear any existing error
    setShowErrorModal(false);
    errorRef.current = '';

    try {
      await register(formData);
      // Only navigate on successful registration
      navigate('/');
    } catch (error: any) {
      // Set error message and keep it visible
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setShowErrorModal(true);
      errorRef.current = errorMessage; // Persist in ref
      
      // Don't navigate on error - stay on register page
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ErrorModal 
        isOpen={showErrorModal}
        message={error}
        onClose={handleCloseErrorModal}
        title="Registration Failed"
      />
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Register</h2>
          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
                maxLength={50}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                maxLength={100}
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
                minLength={6}
                maxLength={100}
              />
              <small style={styles.helpText}>Password must be at least 6 characters long</small>
            </div>
            {error && !showErrorModal && (
              <div style={styles.error} role="alert">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                backgroundColor: isLoading ? '#bdc3c7' : '#27ae60',
              }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p style={styles.linkText}>
            Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </div>
      </div>
    </>
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
  helpText: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
  },
};

export default Register;