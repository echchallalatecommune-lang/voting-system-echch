import { useEffect, useState } from 'react'
import AttendancePage from './components/AttendancePage'
import VotingPage from './components/VotingPage'
import SummaryPage from './components/SummaryPage'
import Navigation from './components/Navigation'
import TimerControls from './components/TimerControls'
import SessionSetup from './components/SessionSetup'
import './index.css'

const LOCAL_STORAGE_KEY = 'council-session-data'

const initialMembers = [
  { id: 1, name: 'أحمد داوود', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 2, name: 'ماريا سعد', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 3, name: 'يوسف محمود', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 4, name: 'سلمى فؤاد', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 5, name: 'علي محمد الكريم', present: false, checkInTimes: [], exitTimes: [], votes: {} },
]

const initialAgendas = []

const locales = {
  ar: {
    attendance: 'الحضور',
    voting: 'التصويت',
    summary: 'الملخص',
    status: 'الحالة',
    present: 'حاضر',
    absent: 'غائب',
    leftRoom: 'غادر القاعة',
    checkIn: 'وقت الحضور',
    exit: 'وقت المغادرة',
    noMembers: 'لا يوجد أعضاء بعد',
    addAgenda: 'أضف نقطة جدول',
    addAgendaPlaceholder: 'اكتب نقطة جدول جديدة',
    noAgenda: 'لا توجد نقاط جدول بعد',
    currentVote: 'التصويت الحالي',
    noVote: 'لم يصوت',
    totalPresent: 'إجمالي الحاضرين',
    totalAbsent: 'إجمالي الغائبين',
    leftMembers: 'الأعضاء الذين غادروا',
    noOneLeft: 'لم يغادر أحد',
    yes: 'نعم',
    no: 'لا',
    abstain: 'امتناع',
    sessionTimer: 'الساعة',
    start: 'ابدأ',
    stop: 'أوقف',
    resetSession: 'إعادة ضبط الجلسة',
    languageLabel: 'اللغة',
    exportHint: 'هيكل جاهز لتصدير PDF/Excel',
    sessionSetupTitle: 'إعداد جلسة جديدة',
    sessionName: 'عنوان الدورة',
    agendaTitle: 'جدول الأعمال',
    remove: 'إزالة',
    startSession: 'ابدأ الجلسة',
  },
}

function App() {
  const loadInitialState = () => {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch (error) {
      console.warn('localStorage parse fail', error)
      return null
    }
  }

  const saved = loadInitialState() || {}

  const [members, setMembers] = useState(saved.members ?? initialMembers)
  const [agendas, setAgendas] = useState(saved.agendas ?? initialAgendas)
  const [currentPage, setCurrentPage] = useState(saved.currentPage ?? 'setup')
  const [timerSeconds, setTimerSeconds] = useState(saved.timerSeconds ?? 0)
  const [timerRunning, setTimerRunning] = useState(saved.timerRunning ?? false)
  const [sessionName, setSessionName] = useState(saved.sessionName ?? '')

  useEffect(() => {
    const payload = { members, agendas, timerSeconds, timerRunning, sessionName, currentPage }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  }, [members, agendas, timerSeconds, timerRunning, sessionName, currentPage])

  useEffect(() => {
    if (!timerRunning) return
    const timerId = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000)
    return () => clearInterval(timerId)
  }, [timerRunning])

  const markPresent = (memberId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              present: true,
              checkInTimes: [...m.checkInTimes, Date.now()],
            }
          : m,
      ),
    )
  }

  const markAbsent = (memberId) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, present: false } : m)))
  }

  const markLeft = (memberId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              present: false,
              exitTimes: [...m.exitTimes, Date.now()],
            }
          : m,
      ),
    )
  }

  const addAgenda = (title) => {
    setAgendas((prev) => [...prev, { id: Date.now(), title }])
  }

  const vote = (memberId, agendaId, value) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m
        if (!m.present) return m

        return {
          ...m,
          votes: {
            ...m.votes,
            [agendaId]: value,
          },
        }
      }),
    )
  }

  const resetSession = () => {
    setMembers(initialMembers)
    setAgendas(initialAgendas)
    setSessionName('')
    setCurrentPage('setup')
    setTimerSeconds(0)
    setTimerRunning(false)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  const localeStrings = locales.ar

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-6 px-3 sm:px-5 lg-px-10">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">نظام متابعة الحضور والتصويت لمجالس البلدية</h1>
        <div className="text-xs text-slate-500">{localeStrings.exportHint}</div>
        {sessionName.trim() && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <span className="font-semibold">دورة:</span> {sessionName}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto space-y-4">
        {currentPage !== 'setup' && (
          <>
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} localeStrings={localeStrings} />

            <TimerControls
              timerSeconds={timerSeconds}
              timerRunning={timerRunning}
              onStart={() => setTimerRunning(true)}
              onStop={() => setTimerRunning(false)}
              onReset={resetSession}
              localeStrings={localeStrings}
            />
          </>
        )}

        {currentPage === 'setup' && (
          <SessionSetup
            sessionName={sessionName}
            setSessionName={setSessionName}
            agendas={agendas}
            setAgendas={setAgendas}
            onContinue={() => setCurrentPage('attendance')}
            localeStrings={localeStrings}
          />
        )}

        {currentPage === 'attendance' && (
          <AttendancePage
            members={members}
            onMarkPresent={markPresent}
            onMarkAbsent={markAbsent}
            onMarkLeft={markLeft}
            localeStrings={localeStrings}
          />
        )}

        {currentPage === 'voting' && (
          <VotingPage members={members} agendas={agendas} onAddAgenda={addAgenda} onVote={vote} localeStrings={localeStrings} />
        )}

        {currentPage === 'summary' && <SummaryPage members={members} agendas={agendas} localeStrings={localeStrings} />}
      </main>
    </div>
  )
}

export default App
