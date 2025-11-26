import React, { createContext, useState, useCallback } from 'react'
import Toasts from '../components/Toasts'

export const ToastContext = createContext()

export function ToastProvider({children}){
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const t = { id, type: toast.type || 'info', message: toast.message || '' }
    setToasts(prev => [...prev, t])
    // auto remove
    setTimeout(()=>{
      setToasts(prev => prev.filter(x => x.id !== id))
    }, toast.duration || 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{addToast, removeToast}}>
      {children}
      <Toasts items={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
