import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import QuartoForm from '../components/QuartoForm'
import { currencyBRL } from '../utils/format'
import styles from './CRUD.module.css'
import { ToastContext } from '../context/ToastContext'

export default function Quartos(){
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const { addToast } = useContext(ToastContext)

  useEffect(()=>{ load() }, [])

  async function load(){ setLoading(true); try{ const res = await api.get('/quartos'); setQuartos(res.data) }catch(err){console.error(err)}finally{setLoading(false)} }

  async function handleSave(data){
    try{
      // validate unique room number client-side
      const exists = quartos.find(q=> String(q.numero) === String(data.numero))
      if(!editing && exists){
        addToast({type:'error', message:'Já existe um quarto com esse número'})
        return
      }
      if(editing){
        // if changing number, ensure not colliding with other
        const conflict = quartos.find(q=> String(q.numero) === String(data.numero) && q.id !== editing.id)
        if(conflict){ addToast({type:'error', message:'Número de quarto já em uso por outro registro'}); return }
        await api.put(`/quartos/${editing.id}`, data)
      }else{
        await api.post('/quartos', data)
      }
      await load()
    }catch(err){
      const msg = err?.response?.data?.message || 'Erro ao salvar quarto'
      addToast({type:'error', message: msg})
    }
  }

  async function handleDelete(q){
    if(!confirm(`Deletar quarto ${q.numero}?`)) return
    try{ await api.delete(`/quartos/${q.id}`); await load() }
    catch(err){ addToast({type:'error', message:'Erro ao deletar quarto'}) }
  }

  const { addToast } = useContext(ToastContext)

  return (
    <div>
      <h2>Quartos</h2>
      <div style={{marginBottom:12}}>
        <button onClick={()=>{setEditing(null);setShowForm(true)}}>Novo Quarto</button>
      </div>
      {loading? <div>Carregando...</div> : (
        <table className={styles.table}>
          <thead><tr><th>Número</th><th>Tipo</th><th>Capacidade</th><th>Valor</th><th>Disponível</th><th>Ações</th></tr></thead>
          <tbody>
            {quartos.map(q=> (
              <tr key={q.id}>
                <td>{q.numero}</td>
                <td>{q.tipo}</td>
                <td>{q.capacidade}</td>
                <td>{currencyBRL(q.valor)}</td>
                <td>{q.disponivel? 'Sim':'Não'}</td>
                <td>
                  <button onClick={()=>{setEditing(q);setShowForm(true)}}>Editar</button>
                  <button onClick={()=>handleDelete(q)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && <QuartoForm initial={editing} onClose={()=>setShowForm(false)} onSave={handleSave} />}
    </div>
  )
}
