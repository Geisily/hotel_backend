import React from 'react'
import styles from './Toasts.module.css'

export default function Toasts({items, onClose}){
  return (
    <div className={styles.toastsContainer}>
      {items.map(t=> (
        <div key={t.id} className={`${styles.toast} ${styles[t.type] || styles.info}`}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
            <div>{t.message}</div>
            <button className={styles.close} onClick={()=>onClose(t.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
