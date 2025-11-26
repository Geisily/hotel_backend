import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Quartos from './pages/Quartos'
import Reservas from './pages/Reservas'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

export default function App(){
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Dashboard/>} />
          <Route path="clientes" element={<Clientes/>} />
          <Route path="quartos" element={<Quartos/>} />
          <Route path="reservas" element={<Reservas/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </div>
  )
}
