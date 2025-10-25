import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContent}>
        <h1 style={styles.title} onClick={() => navigate('/')}>
          Project Manager
        </h1>
        {user && (
          <div style={styles.userSection}>
            <span style={styles.username}>Welcome, {user.username}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 0',
    marginBottom: '2rem',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '1rem',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Navbar;