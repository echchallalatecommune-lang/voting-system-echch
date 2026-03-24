import React, { useState } from 'react'

const voteOptions = [
  { key: 'yes', label: '👍' },
  { key: 'no', label: '👎' },
  { key: 'abstain', label: '⚪' },
]

const VotingPage = ({ members, agendas, onAddAgenda, onVote, localeStrings }) => {
  const [newAgenda, setNewAgenda] = useState('')

  const handleAdd = () => {
    if (!newAgenda.trim()) return
    onAddAgenda(newAgenda.trim())
    setNewAgenda('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input
          value={newAgenda}
          onChange={(e) => setNewAgenda(e.target.value)}
          placeholder={localeStrings.addAgendaPlaceholder}
          className="flex-1 input"
        />
        <button onClick={handleAdd} className="btn btn-primary">
          {localeStrings.addAgenda}
        </button>
      </div>

      {agendas.length === 0 ? (
        <p className="text-center text-slate-600">{localeStrings.noAgenda}</p>
      ) : (
        agendas.map((agenda) => (
          <div key={agenda.id} className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold mb-2">{agenda.title}</h3>
            <div className="space-y-2">
              {members.map((member) => {
                const currentVote = member.votes?.[agenda.id] || null
                const disabled = !member.present
                return (
                  <div key={`${agenda.id}-${member.id}`} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border border-slate-100 rounded-lg bg-white/80 items-center">
                    <div className="font-medium text-slate-700">{member.name}</div>
                    <div className="flex justify-start sm:justify-center gap-1 flex-wrap">
                      {voteOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => onVote(member.id, agenda.id, opt.key)}
                          disabled={disabled}
                          className={`px-3 py-1 rounded-md border text-sm ${
                            currentVote === opt.key
                              ? 'btn btn-primary'
                              : 'bg-white text-slate-700 border border-slate-300'
                          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 text-right sm:text-left">
                      {localeStrings.currentVote}: <span className="font-semibold">{currentVote || localeStrings.noVote}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default VotingPage
