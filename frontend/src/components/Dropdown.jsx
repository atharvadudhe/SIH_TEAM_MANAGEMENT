import React from 'react'

export default function Dropdown({ options=[], value, onChange, name }){
  return (
    <select name={name} value={value||''} onChange={e=> onChange(e.target.value)}>
      <option value="">Select</option>
      {options.map(o=> <option key={o} value={o}>{o}</option>)}
    </select>
  )
}