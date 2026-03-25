import React, { useState } from 'react'

const voteOptions = [
  { key: 'yes', label: '👍 نعم' },
  { key: 'no', label: '👎 لا' },
  { key: 'abstain', label: '⚪ امتناع' },
]

const VotingPage = ({ members, agendas, onAddAgenda, onVote, localeStrings }) => {
  const [newAgenda, setNewAgenda] = useState('')
  const [selectedMembers, setSelectedMembers] = useState(new Set())
  const [selectedVote, setSelectedVote] = useState(null)

  const handleAdd = () => {
    if (!newAgenda.trim()) return
    onAddAgenda(newAgenda.trim())
    setNewAgenda('')
  }

  const toggleMember = (memberId) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedMembers(newSelected)
  }

  const toggleSelectAll = () => {
    const presentMembers = members.filter((m) => m.present).map((m) => m.id)
    if (selectedMembers.size === presentMembers.length) {
      setSelectedMembers(new Set())
    } else {
      setSelectedMembers(new Set(presentMembers))
    }
  }

  const applyVote = (agendaId) => {
    if (!selectedVote) {
      alert('اختر خيار تصويت أولاً')
      return
    }
    selectedMembers.forEach((memberId) => {
      onVote(memberId, agendaId, selectedVote)
    })
    setSelectedMembers(new Set())
    setSelectedVote(null)
    alert('تم تطبيق التصويت على جميع المختارين')
  }

  const presentMembersCount = members.filter((m) => m.present).length

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
          <div key={agenda.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-semibold mb-3 text-base">{agenda.title}</h3>

            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`selectall-${agenda.id}`}
                  checked={selectedMembers.size > 0 && selectedMembers.size === presentMembersCount}
                  onChange={() => toggleSelectAll(agenda.id)}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor={`selectall-${agenda.id}`} className="text-sm font-semibold cursor-pointer">
                  اختر الكل ({selectedMembers.size}/{presentMembersCount})
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {members
                  .filter((m) => m.present)
                  .map((member) => (
                    <label key={member.id} className="flex items-center gap-1 cursor-pointer text-xs p-1 bg-white rounded border">
                      <input
                        type="checkbox"
                        checked={selectedMembers.has(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="truncate">{member.name}</span>
                    </label>
                  ))}
              </div>

              {selectedMembers.size > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold mb-1">اختر خيار التصويت:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {voteOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSelectedVote(opt.key)}
                        className={`py-2 px-1 rounded text-xs font-semibold border ${
                          selectedVote === opt.key
                            ? 'btn btn-primary'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => applyVote(agenda.id)} className="w-full py-2 btn btn-success text-sm font-semibold">
                    تطبيق التصويت
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-600 mt-2">
              {members
                .filter((m) => m.present)
                .filter((m) => {
                  const vote = m.votes?.[agenda.id]
                  return vote
                }).length > 0 && (
                <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                  <div className="font-semibold mb-1">النتائج الحالية:</div>
                  <div>
                    نعم: {members.filter((m) => m.votes?.[agenda.id] === 'yes').length}
                  </div>
                  <div>
                    لا: {members.filter((m) => m.votes?.[agenda.id] === 'no').length}
                  </div>
                  <div>
                    امتناع: {members.filter((m) => m.votes?.[agenda.id] === 'abstain').length}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default VotingPage
