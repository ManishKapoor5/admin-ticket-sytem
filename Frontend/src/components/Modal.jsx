"use client"

import { X } from "lucide-react"
import "./Modal.css"

const Modal = ({ isOpen, onClose, title, description, children }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{title}</h2>
            {description && <p className="modal-description">{description}</p>}
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
