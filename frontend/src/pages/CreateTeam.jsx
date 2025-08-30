import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import Dropdown from '../components/Dropdown'

export default function CreateTeam({ user }){
  const [form, setForm] = useState({ title:'', theme:'', description:'' });
  const [themes, setThemes] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{ api.get('/lookups/themes').then(r=> setThemes(r.data.themes)); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await api.post('/teams', form);
      nav('/dashboard');
    }catch(err){ alert(err.response?.data?.message || 'Create failed') }
  }

  return (
    <main className="form-page">
      <form onSubmit={submit} className="card">
        <h2>Create Team</h2>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <Dropdown options={themes} value={form.theme} onChange={(v)=>setForm({...form,theme:v})} />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
        <button type="submit">Create</button>
      </form>
    </main>
  )
}