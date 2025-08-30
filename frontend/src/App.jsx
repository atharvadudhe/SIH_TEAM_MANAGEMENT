import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import TeamDetail from './pages/TeamDetail'
import CreateTeam from './pages/CreateTeam'
import Profile from './pages/Profile'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import api from './api'

export default function App(){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    api.get('/auth/me').then(r=> setUser(r.data.user)).catch(()=> setUser(null));
  },[]);

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Signup onSignup={setUser} />} />

        <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user}/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user}/></ProtectedRoute>} />
        <Route path="/teams/:id" element={<ProtectedRoute user={user}><TeamDetail user={user}/></ProtectedRoute>} />
        <Route path="/create-team" element={<ProtectedRoute user={user}><CreateTeam user={user}/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} setUser={setUser}/></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}