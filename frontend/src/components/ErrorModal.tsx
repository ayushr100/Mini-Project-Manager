import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ 
  isOpen, 
  message, 
  onClose, 
  title = "Login Error" 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      style={styles.backdrop} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-message"
    >
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 id="error-modal-title" style={styles.title}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={styles.closeButton}
            className="error-modal-close"
            aria-label="Close error dialog"
          >
            ×
          </button>
        </div>
        <div style={styles.body}>
          <div style={styles.iconContainer}>
            <span style={styles.errorIcon}>⚠️</span>
          </div>
          <p id="error-modal-message" style={styles.message}>
            {message}
          </p>
        </div>
        <div style={styles.footer}>
          <button 
            onClick={onClose}
            style={styles.okButton}
            className="error-modal-ok"
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    outline: 'none',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    width: '90%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflow: 'hidden',
    animation: 'fadeIn 0.2s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  title: {
    margin: 0,
    color: '#dc3545',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#6c757d',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  },
  body: {
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  iconContainer: {
    flexShrink: 0,
  },
  errorIcon: {
    fontSize: '2rem',
    display: 'block',
  },
  message: {
    margin: 0,
    color: '#495057',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  footer: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  okButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
};

export default ErrorModal;