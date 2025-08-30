import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onLogin }){
  const { setUser } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const res = await api.post('/auth/login', { identifier, password });
      setUser(res.data.user);
      onLogin(res.data.user);
      nav('/dashboard');
    }catch(err){ setErr(err.response?.data?.message || 'Login failed'); }
  }

  return (
    <main className="form-page">
      <form onSubmit={submit} className="card">
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <input placeholder="Email or mobile" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </main>
  )
}