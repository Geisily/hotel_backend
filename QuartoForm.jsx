import React, { useState, useEffect } from 'react'
import styles from './Form.module.css'

export default function QuartoForm({initial, onClose, onSave}){
  const [form, setForm] = useState({numero:'', tipo:'Single', capacidade:1, valor:0, disponivel:true, descricao:''})
  const [errors, setErrors] = useState({})

  useEffect(()=>{ if(initial) setForm(initial) }, [initial])

  function validate(){
    const e = {}
    if(!form.numero) e.numero = 'Número é obrigatório'
    if(!(Number(form.valor) > 0)) e.valor = 'Valor deve ser maior que 0'
    return e
  }

  async function submit(ev){
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if(Object.keys(e).length) return
    await onSave({...form, capacidade: Number(form.capacidade), valor: Number(form.valor)})
    onClose()
  }
  const isValid = (() => {
    const e = validate()
    return Object.keys(e).length === 0
  })()

  return (
    <div className={styles.modal}>
      <div className={styles.dialog}>
        <h3>{initial? 'Editar Quarto':'Novo Quarto'}</h3>
        <form onSubmit={submit}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Número</label>
              <input className={styles.input} value={form.numero} onChange={e=>setForm({...form,numero:e.target.value})} />
              {errors.numero && <small style={{color:'#c33'}}>{errors.numero}</small>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tipo</label>
              <select className={styles.input} value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}>
                <option>Single</option>
                <option>Double</option>
                <option>Suite</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Capacidade</label>
              <input className={styles.input} type="number" min="1" value={form.capacidade} onChange={e=>setForm({...form,capacidade:e.target.value})} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Valor (R$)</label>
              <input className={styles.input} type="number" step="0.01" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})} />
              {errors.valor && <small style={{color:'#c33'}}>{errors.valor}</small>}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Disponível</label>
              <select className={styles.input} value={form.disponivel? 'true':'false'} onChange={e=>setForm({...form,disponivel: e.target.value === 'true'})}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Descrição</label>
              <input className={styles.input} value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} />
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
