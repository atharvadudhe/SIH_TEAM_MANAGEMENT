import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function TeamDetail({ user }){
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const nav = useNavigate();

  useEffect(()=>{ api.get(`/teams/${id}`).then(r=> setTeam(r.data.team)).catch(()=>{}); },[id]);

  const join = async ()=>{
    try{ await api.put(`/teams/${id}/join`); alert('Joined'); nav('/dashboard'); }
    catch(e){ alert(e.response?.data?.message || 'Join failed'); }
  }
  const leave = async ()=>{
    try{ await api.put(`/teams/${id}/leave`); alert('Left team'); nav('/dashboard'); }
    catch(e){ alert(e.response?.data?.message || 'Leave failed'); }
  }
  const remove = async ()=>{
    if (!confirm('Delete team?')) return;
    try{ await api.delete(`/teams/${id}`); alert('Deleted'); nav('/dashboard'); }catch(e){ alert(e.response?.data?.message || 'Delete failed'); }
  }

  if (!team) return <div>Loading...</div>;

  const isMember = team.members.some(m=> m._id === user._id);
  const isLeader = team.leader._id === user._id;

  return (
    <main className="container card">
      <h2>{team.title}</h2>
      <p className="meta">{team.theme} • {team.members.length}/6</p>
      <p>{team.description}</p>
      <h3>Members</h3>
      <ul>
        {team.members.map(m=> <li key={m._id}>{m.name} ({m.branch}) {team.leader._id === m._id ? ' — Leader' : ''}</li>)}
      </ul>

      <div className="actions">
        {!isMember && <button onClick={join}>Join</button>}
        {isMember && !isLeader && <button onClick={leave}>Leave</button>}
        {isLeader && <button onClick={remove}>Delete Team</button>}
      </div>
    </main>
  )
}