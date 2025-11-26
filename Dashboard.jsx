import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { currencyBRL, formatDateBR } from '../utils/format'
import './Dashboard.module.css'

export default function Dashboard(){
  const [stats, setStats] = useState({clientes:0, quartos:0, reservas:0, disponiveis:0})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      try{
        const [rClientes, rQuartos, rReservas] = await Promise.all([
          api.get('/clientes'), api.get('/quartos'), api.get('/reservas')
        ])
        const clientes = rClientes.data.length || 0
        const quartos = rQuartos.data.length || 0
        const reservas = rReservas.data.length || 0
        const disponiveis = rQuartos.data.filter(q=>q.disponivel).length
        setStats({clientes, quartos, reservas, disponiveis})
      }catch(err){
        console.error(err)
      }finally{ setLoading(false) }
    }
    load()
  }, [])

  if(loading) return <div>Carregando dashboard...</div>

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:180,padding:12,borderRadius:8,background:'linear-gradient(135deg,var(--primary-start),var(--primary-end))',color:'#fff'}}>
          <div>Total de Clientes</div>
          <h3>{stats.clientes}</h3>
        </div>
        <div style={{flex:1,minWidth:180,padding:12,borderRadius:8,background:'linear-gradient(135deg,#4bbf7a,#2b8a4b)',color:'#fff'}}>
          <div>Total de Quartos</div>
          <h3>{stats.quartos}</h3>
        </div>
        <div style={{flex:1,minWidth:180,padding:12,borderRadius:8,background:'#ffd54f',color:'#333'}}>
          <div>Total de Reservas</div>
          <h3>{stats.reservas}</h3>
        </div>
        <div style={{flex:1,minWidth:180,padding:12,borderRadius:8,background:'#6c757d',color:'#fff'}}>
          <div>Quartos Disponíveis</div>
          <h3>{stats.disponiveis}</h3>
        </div>
      </div>

      <section style={{marginTop:18}}>
        <h3>Informações do sistema</h3>
        <p>Horário: {formatDateBR(new Date())}</p>
      </section>
    </div>
  )
}
