// components/Toast.jsx
import React, { useEffect, useState } from 'react'
import './Toast.css'

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default: // info
        return 'ℹ'
    }
  }

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-show' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast