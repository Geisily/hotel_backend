export function currencyBRL(value){
  const num = Number(value) || 0
  return num.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})
}

export function formatDateBR(dateInput){
  if(!dateInput) return ''
  const d = new Date(dateInput)
  if(Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

export function daysBetween(start, end){
  const s = new Date(start)
  const e = new Date(end)
  if(Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0
  const diff = Math.ceil((e - s) / (1000*60*60*24))
  return diff > 0 ? diff : 0
}
