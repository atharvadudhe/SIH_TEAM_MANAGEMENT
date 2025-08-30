import React, { useEffect, useState } from 'react'
import api from '../api'
import TeamCard from '../components/TeamCard'
import Dropdown from '../components/Dropdown'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }){
  const [teams, setTeams] = useState([]);
  const [themes, setThemes] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(()=>{ fetchAll(); fetchThemes(); },[]);
  const fetchAll = async ()=>{
    const res = await api.get('/teams');
    setTeams(res.data.teams);
  }
  const fetchThemes = async ()=>{
    const res = await api.get('/lookups/themes');
    setThemes(res.data.themes);
  }

  const pinned = teams.find(t=> t.members.some(m => m._id === user._id && t.leader._id === user._id)) || teams.find(t=> t.members.some(m=> m._id === user._id));

  const shown = (filter ? teams.filter(t=> t.theme === filter) : teams).filter(Boolean);

  return (
    <main className="container">
      <div className="top-row">
        <h1>Teams</h1>
        <div>
          <Dropdown options={themes} value={filter} onChange={setFilter} />
        </div>
      </div>

      {pinned && <section><h2>Your Team</h2><TeamCard team={pinned} highlight/></section>}

      <section className="grid">
        {shown.map(team=> <TeamCard key={team._id} team={team} />)}
      </section>
    </main>
  )
}