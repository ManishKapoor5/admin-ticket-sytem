// ToastContext.js - Debug version to check if it's causing re-renders
import { createContext, useContext, useState, useCallback, useMemo } from "react"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  
  // Debug: Track renders
  console.log('ToastProvider render, toasts count:', toasts.length)
  
  // Memoize functions to prevent unnecessary re-renders
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
  }, [])
  
  const showSuccess = useCallback((message, duration) => {
    showToast(message, "success", duration)
  }, [showToast])
  
  const showError = useCallback((message, duration) => {
    showToast(message, "error", duration)
  }, [showToast])
  
  const showInfo = useCallback((message, duration) => {
    showToast(message, "info", duration)
  }, [showToast])
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    toasts,
    showToast,
    showSuccess,
    showError,
    showInfo,
    removeToast
  }), [toasts, showToast, showSuccess, showError, showInfo, removeToast])
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
            <button onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}