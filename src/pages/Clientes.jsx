import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import ClienteForm from '../components/ClienteForm'
import styles from './CRUD.module.css'
import { ToastContext } from '../context/ToastContext'

export default function Clientes(){
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const { addToast } = useContext(ToastContext)

  useEffect(()=>{ load() }, [])

  async function load(){
    setLoading(true)
    try{ const res = await api.get('/clientes'); setClientes(res.data) }catch(err){console.error(err)}finally{setLoading(false)}
  }

  async function handleSave(data){
    try{
      if(editing){
        await api.put(`/clientes/${editing.id}`, data)
      }else{
        await api.post('/clientes', data)
      }
      await load()
    }catch(err){
      const msg = err?.response?.data?.message || 'Erro ao salvar cliente'
      addToast({type:'error', message: msg})
    }
  }

  async function handleDelete(c){
    if(!confirm(`Confirmar remoção de ${c.nome}?`)) return
    try{ await api.delete(`/clientes/${c.id}`); await load() }
    catch(err){ addToast({type:'error', message: err?.response?.data?.message || 'Erro ao deletar cliente'}) }
  }

  const { addToast } = useContext(ToastContext)

  return (
    <div>
      <h2>Clientes</h2>
      <div style={{marginBottom:12}}>
        <button onClick={()=>{setEditing(null);setShowForm(true)}}>Novo Cliente</button>
      </div>
      {loading? <div>Carregando...</div> : (
        <table className={styles.table}>
          <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>CPF</th><th>Endereço</th><th>Ações</th></tr></thead>
          <tbody>
            {clientes.map(c=> (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.email}</td>
                <td>{c.telefone}</td>
                <td>{c.cpf}</td>
                <td>{c.endereco}</td>
                <td>
                  <button onClick={()=>{setEditing(c);setShowForm(true)}}>Editar</button>
                  <button onClick={()=>handleDelete(c)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && <ClienteForm initial={editing} onClose={()=>setShowForm(false)} onSave={handleSave} />}
    </div>
  )
}
