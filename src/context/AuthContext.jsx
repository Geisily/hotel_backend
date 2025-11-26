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

  // 1. Efeito para verificar token na inicialização
  useEffect(()=>{
    // verify token by pinging a protected endpoint (if available)
    let mounted = true
    async function verify(){
      // Se não houver token, marca como carregado e sai
      if(!token){ if(mounted) setLoading(false); return }

      try{
        // Tenta buscar usuário atual (rota protegida)
        const res = await api.get('/auth/me')
        const u = res?.data?.user || res?.data || JSON.parse(localStorage.getItem('user') || 'null')
        if(mounted){
          setUser(u)
          setLoading(false)
        }
      }catch(err){
        // Token inválido ou erro -> desloga
        if(mounted) logout()
      }
    }
    verify()
    return ()=>{ mounted = false }
  }, [])

  // 2. Efeito para configurar o Header de Autorização do Axios (CORREÇÃO CRÍTICA)
  useEffect(()=>{
    if(token){
      // Adiciona o token no formato Bearer ao cabeçalho de todas as requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }else{
      // Remove o token se o usuário deslogar
      delete api.defaults.headers.common['Authorization']
    }
  }, [token]) // Executa sempre que o token muda (login ou logout)

  // 3. Efeito para escutar evento de logout externo
  useEffect(()=>{
    function handleLogoutEvent(){
      logout()
    }
    window.addEventListener('auth:logout', handleLogoutEvent)
    return ()=> window.removeEventListener('auth:logout', handleLogoutEvent)
  }, [])

  // Função de login
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

  // Função de logout (CORREÇÃO: Removido window.location.href)
  function logout(){
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // O redirecionamento é tratado pelo ProtectedRoute ao ver que user é null.
    // window.location.href = '/login' (REMOVIDO)
  }

  return (
    <AuthContext.Provider value={{user, token, loading, error, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
