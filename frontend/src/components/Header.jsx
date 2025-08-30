import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Header({ user, setUser }){
  const nav = useNavigate();
  const logout = async ()=>{
    await api.post('/auth/logout');
    setUser(null);
    nav('/login');
  }
  return (
    <header className="header">
      <div className="container">
        <nav>
          <Link to="/dashboard" className="brand">SIH TeamFinder</Link>
          {user ? (
            <>
              <Link to="/create-team">Create Team</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}