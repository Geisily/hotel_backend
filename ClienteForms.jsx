import React, { useState, useEffect } from 'react'
import styles from './Form.module.css'
import { currencyBRL } from '../utils/format'

export default function ClienteForm({initial, onClose, onSave}){
  const [form, setForm] = useState({nome:'', email:'', telefone:'', cpf:'', endereco:''})
  const [errors, setErrors] = useState({})

  useEffect(()=>{ if(initial) setForm(initial) }, [initial])

  function validate(){
    const e = {}
    if(!form.nome) e.nome = 'Nome é obrigatório'
    if(!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Email inválido'
    if(!form.telefone) e.telefone = 'Telefone é obrigatório'
    return e
  }

  async function submit(e){
    e.preventDefault()
    const eobj = validate()
    setErrors(eobj)
    if(Object.keys(eobj).length) return
    await onSave(form)
    onClose()
  }

  const isValid = (() => {
    const e = validate()
    return Object.keys(e).length === 0
  })()

  return (
    <div className={styles.modal}>
      <div className={styles.dialog}>
        <h3>{initial? 'Editar Cliente':'Novo Cliente'}</h3>
        {errors._global && <div className={styles.error}>{errors._global}</div>}
        <form onSubmit={submit}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <input className={styles.input} value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} />
              {errors.nome && <small style={{color:'#c33'}}>{errors.nome}</small>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              {errors.email && <small style={{color:'#c33'}}>{errors.email}</small>}
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Telefone</label>
              <input className={styles.input} value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>CPF</label>
              <input className={styles.input} value={form.cpf} onChange={e=>setForm({...form,cpf:e.target.value})} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.field} style={{flex:1}}>
              <label className={styles.label}>Endereço</label>
              <input className={styles.input} value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})} />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={!isValid}>{isValid? 'Salvar':'Preencha o formulário'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
