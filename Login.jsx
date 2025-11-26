import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login(){
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    const res = await login({email, password})
    setLoading(false)
    if(res.ok){
      navigate('/', {replace:true})
    }else{
      setError(res.error || 'Credenciais inválidas')
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.box} onSubmit={submit}>
        <h2>Entrar</h2>
        {error && <div className={styles.error}>{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className={styles.btn} disabled={loading}>{loading? 'Carregando...':'Entrar'}</button>
      </form>
    </div>
  )
}
