import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({children}){
  const [user, setUser] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('user')) }catch{ return null }
  })
  const [token, setToken] = useState(()=>localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    // verify token by pinging a protected endpoint (if available)
    let mounted = true
    async function verify(){
      if(!token){ if(mounted) setLoading(false); return }
      try{
        // try to fetch current user from a protected endpoint
        const res = await api.get('/auth/me')
        const u = res?.data?.user || res?.data || JSON.parse(localStorage.getItem('user') || 'null')
        if(mounted){
          setUser(u)
          setLoading(false)
        }
      }catch(err){
        // token invalid or endpoint not available -> logout
        if(mounted) logout()
      }
    }
    verify()
    return ()=>{ mounted = false }
  }, [])

  useEffect(()=>{
    function handleLogoutEvent(){
      logout()
    }
    window.addEventListener('auth:logout', handleLogoutEvent)
    return ()=> window.removeEventListener('auth:logout', handleLogoutEvent)
  }, [])

  async function login({email, password}){
    setLoading(true)
    setError(null)
    try{
      const res = await api.post('/auth/login', {email, password})
      const data = res.data
      const t = data.token || data.accessToken || ''
      const u = data.user || data.usuario || {email}
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
      setToken(t)
      setUser(u)
      setLoading(false)
      return {ok:true}
    }catch(err){
      const errMessage = err?.response?.data?.message || err?.message || 'Erro ao autenticar'
      setError(errMessage)
      setLoading(false)
      return {ok:false, error: errMessage}
    }
  }

  function logout(){
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // redirect to login
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{user, token, loading, error, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
