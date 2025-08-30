import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import Dropdown from '../components/Dropdown'

export default function Signup({ onSignup }){
  const [form, setForm] = useState({ name:'', email:'', mobile:'', branch:'', gender:'female', password:'' });
  const [branches, setBranches] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{
    api.get('/lookups/branches').then(r=> setBranches(r.data.branches)).catch(()=>{});
  },[]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await api.post('/auth/signup', form);
      onSignup(res.data.user);
      nav('/dashboard');
    }catch(err){ alert(err.response?.data?.message || 'Signup failed'); }
  }

  return (
    <main className="form-page">
      <form onSubmit={submit} className="card">
        <h2>Signup</h2>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input placeholder="Mobile" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} />
        <Dropdown options={branches} value={form.branch} onChange={(v)=>setForm({...form,branch:v})} />
        <select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button type="submit">Signup</button>
      </form>
    </main>
  )
}