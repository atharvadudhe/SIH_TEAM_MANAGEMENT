import React from 'react'
import { Link } from 'react-router-dom'

export default function TeamCard({ team, highlight }){
  return (
    <article className={`team-card ${highlight ? 'highlight' : ''}`}>
      <h3>{team.title}</h3>
      <p className="meta">{team.theme} • {team.members.length}/6</p>
      <p className="desc">{team.description}</p>
      <div className="foot">
        <small>Leader: {team.leader?.name || '—'}</small>
        <Link to={`/teams/${team._id}`}>View</Link>
      </div>
    </article>
  )
}