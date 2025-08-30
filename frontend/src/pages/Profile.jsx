import React from 'react'
import api from '../api'

export default function Profile({ user, setUser }){
  const logout = async ()=>{ await api.post('/auth/logout'); setUser(null); }
  return (
    <main className="container card">
      <h2>Profile</h2>
      <p><strong>{user.name}</strong></p>
      <p>{user.email}</p>
      <p>{user.mobile}</p>
      <p>{user.branch} • {user.gender}</p>
      <p>Team: {user.team ? user.team : 'None'}</p>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
    </main>
  )
}