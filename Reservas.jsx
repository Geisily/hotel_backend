import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import ReservaForm from '../components/ReservaForm'
import { formatDateBR, currencyBRL } from '../utils/format'
import styles from './CRUD.module.css'
import { ToastContext } from '../context/ToastContext'

export default function Reservas(){
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const { addToast } = useContext(ToastContext)

  useEffect(()=>{ loadAll() }, [])

  async function loadAll(){
    setLoading(true)
    try{
      const [r1,r2,r3] = await Promise.all([api.get('/reservas'), api.get('/clientes'), api.get('/quartos')])
      setReservas(r1.data)
      setClientes(r2.data)
      setQuartos(r3.data)
    }catch(err){console.error(err)}finally{setLoading(false)}
  }

  async function handleSave(data){
    try{
      if(editing){ await api.put(`/reservas/${editing.id}`, data) }
      else{ await api.post('/reservas', data) }
      await loadAll()
    }catch(err){ addToast({type:'error', message: err?.response?.data?.message || 'Erro ao salvar reserva'}) }
  }
  async function handleDelete(r){
    if(!confirm('Deletar reserva?')) return
    try{ await api.delete(`/reservas/${r.id}`); await loadAll() }
    catch(err){ addToast({type:'error', message: err?.response?.data?.message || 'Erro ao deletar reserva'}) }
  }

  return (
    <div>
      <h2>Reservas</h2>
      <div style={{marginBottom:12}}>
        <button onClick={()=>{setEditing(null);setShowForm(true)}}>Nova Reserva</button>
      </div>
      {loading? <div>Carregando...</div> : (
        <table className={styles.table}>
          <thead><tr><th>Cliente</th><th>Quarto</th><th>Entrada</th><th>Saída</th><th>Total</th><th>Ações</th></tr></thead>
          <tbody>
            {reservas.map(r=> (
              <tr key={r.id}>
                <td>{r.cliente?.nome || r.clienteNome || '-'}</td>
                <td>{r.quarto?.numero || r.quartoNumero || '-'}</td>
                <td>{formatDateBR(r.entrada)}</td>
                <td>{formatDateBR(r.saida)}</td>
                <td>{currencyBRL(r.total)}</td>
                <td>
                  <button onClick={()=>{setEditing(r);setShowForm(true)}}>Editar</button>
                  <button onClick={()=>handleDelete(r)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && <ReservaForm initial={editing} onClose={()=>setShowForm(false)} onSave={handleSave} clientes={clientes} quartos={quartos} />}
    </div>
  )
}
