import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import { AuthContext } from '../context/AuthContext'

export default function Layout(){
  const { user, logout } = useContext(AuthContext)
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}></div>
          <h1>HotelSys</h1>
        </div>
        <nav>
          <NavLink to="/" end className={({isActive})=>isActive?styles.active:''}>Dashboard</NavLink>
          <NavLink to="/clientes" className={({isActive})=>isActive?styles.active:''}>Clientes</NavLink>
          <NavLink to="/quartos" className={({isActive})=>isActive?styles.active:''}>Quartos</NavLink>
          <NavLink to="/reservas" className={({isActive})=>isActive?styles.active:''}>Reservas</NavLink>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}></div>
          <div className={styles.headerRight}>
            <span className={styles.user}>{user?.email || 'Usuário'}</span>
            <button className={styles.logout} onClick={logout}>Sair</button>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
