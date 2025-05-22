import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ message, type, onClose, autoClose = true, autoCloseTime = 5000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseTime, onClose, visible]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-dark';
      case 'info':
        return 'bg-info text-dark';
      default:
        return 'bg-light text-dark';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="bi bi-check-circle-fill me-2"></i>;
      case 'error':
        return <i className="bi bi-exclamation-triangle-fill me-2"></i>;
      case 'warning':
        return <i className="bi bi-exclamation-circle-fill me-2"></i>;
      case 'info':
        return <i className="bi bi-info-circle-fill me-2"></i>;
      default:
        return null;
    }
  };

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div 
        className={`toast show ${getToastClass()}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div className="toast-header">
          {getIcon()}
          <strong className="me-auto">
            {type === 'success' && 'Succès'}
            {type === 'error' && 'Erreur'}
            {type === 'warning' && 'Attention'}
            {type === 'info' && 'Information'}
          </strong>
          <button 
            type="button" 
            className="btn-close" 
            aria-label="Fermer" 
            onClick={handleClose}
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes.number
};