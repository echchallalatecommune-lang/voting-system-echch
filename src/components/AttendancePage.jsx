import React, { useState } from 'react'

const formatDateTime = (timestamp) => new Date(timestamp).toLocaleString()

const AttendancePage = ({ members, onMarkPresent, onMarkAbsent, onMarkLeft, onTakeWord, localeStrings }) => {
  const [searchTerm, setSearchTerm] = useState('')

  if (members.length === 0) {
    return <p className="text-center py-4">{localeStrings.noMembers}</p>
  }

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="البحث بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={() => members.forEach(m => onMarkPresent(m.id))}
            className="w-full sm:w-auto py-2 px-4 btn btn-success font-semibold"
          >
            اختر الكل كحاضرين
          </button>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-slate-600">
            تم العثور على {filteredMembers.length} عضو من أصل {members.length}
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="space-y-2">
        {filteredMembers.map((member) => (
        <div key={member.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-md">
          <div className="md:col-span-2">
            <div className="font-semibold text-lg">{member.name}</div>
            <div className="text-sm mt-1">
              <span className={member.present ? 'text-emerald-600' : 'text-rose-600'}>
                {localeStrings.status}: {member.present ? localeStrings.present : localeStrings.absent}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              <div className="mb-1 font-semibold">السجل:</div>
              {member.checkInTimes.length === 0 && member.exitTimes.length === 0 ? (
                <span>لا توجد حركة بعد</span>
              ) : (
                <div className="space-y-0.5">
                  {member.checkInTimes.map((time, idx) => (
                    <div key={`in-${idx}`}>✓ حضور: {formatDateTime(time)}</div>
                  ))}
                  {member.exitTimes.map((time, idx) => (
                    <div key={`out-${idx}`}>✕ مغادرة: {formatDateTime(time)}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-2 justify-start md:justify-end">
            <button onClick={() => onMarkPresent(member.id)} className="px-3 py-2 btn btn-success shadow-sm">
              {localeStrings.present}
            </button>
            <button onClick={() => onMarkAbsent(member.id)} className="px-3 py-2 btn btn-secondary shadow-sm">
              {localeStrings.absent}
            </button>
            <button onClick={() => onTakeWord(member.id)} className="px-3 py-2 btn btn-warning shadow-sm">
              {localeStrings.tookWord}
            </button>
            <button onClick={() => onMarkLeft(member.id)} className="px-3 py-2 btn btn-danger shadow-sm">
              {localeStrings.leftRoom}
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default AttendancePage
