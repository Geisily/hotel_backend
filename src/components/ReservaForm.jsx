import React, { useState, useEffect } from 'react'
import styles from './Form.module.css'
import { daysBetween, currencyBRL, formatDateBR } from '../utils/format'

export default function ReservaForm({initial, onClose, onSave, clientes=[], quartos=[]}){
  const [form, setForm] = useState({clienteId:'', quartoId:'', entrada:'', saida:'', total:0})
  const [errors, setErrors] = useState({})

  useEffect(()=>{ if(initial) setForm(initial) }, [initial])

  useEffect(()=>{
    const dias = daysBetween(form.entrada, form.saida)
    const quarto = quartos.find(q=>String(q.id) === String(form.quartoId))
    const diaria = quarto ? Number(quarto.valor || 0) : 0
    const total = dias * diaria
    setForm(prev=>({...prev, total}))
  }, [form.entrada, form.saida, form.quartoId, quartos])

  function validate(){
    const e = {}
    if(!form.clienteId) e.clienteId = 'Cliente é obrigatório'
    if(!form.quartoId) e.quartoId = 'Quarto é obrigatório'
    if(!form.entrada) e.entrada = 'Data de entrada é obrigatória'
    if(!form.saida) e.saida = 'Data de saída é obrigatória'
    if(new Date(form.saida) <= new Date(form.entrada)) e.saida = 'Saída deve ser posterior à entrada'
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
        <h3>{initial? 'Editar Reserva':'Nova Reserva'}</h3>
        <form onSubmit={submit}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Cliente</label>
              <select className={styles.input} value={form.clienteId} onChange={e=>setForm({...form,clienteId:e.target.value})}>
                <option value="">-- selecione --</option>
                {clientes.map(c=> <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              {errors.clienteId && <small style={{color:'#c33'}}>{errors.clienteId}</small>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Quarto</label>
              <select className={styles.input} value={form.quartoId} onChange={e=>setForm({...form,quartoId:e.target.value})}>
                <option value="">-- selecione --</option>
                {quartos.filter(q=>q.disponivel).map(q=> <option key={q.id} value={q.id}>{q.numero} — {q.tipo} — {currencyBRL(q.valor)}</option>)}
              </select>
              {errors.quartoId && <small style={{color:'#c33'}}>{errors.quartoId}</small>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Entrada</label>
              <input className={styles.input} type="date" value={form.entrada} onChange={e=>setForm({...form,entrada:e.target.value})} />
              {errors.entrada && <small style={{color:'#c33'}}>{errors.entrada}</small>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Saída</label>
              <input className={styles.input} type="date" value={form.saida} onChange={e=>setForm({...form,saida:e.target.value})} />
              {errors.saida && <small style={{color:'#c33'}}>{errors.saida}</small>}
            </div>
          </div>

          <div style={{marginTop:10}}>
            <strong>Resumo:</strong>
            <div>Período: {form.entrada? formatDateBR(form.entrada): '-'} → {form.saida? formatDateBR(form.saida): '-'}</div>
            <div>Total dias: {daysBetween(form.entrada, form.saida)}</div>
            <div>Valor total: {currencyBRL(form.total)}</div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Salvar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
