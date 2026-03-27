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
  { id: 2, name: 'فتاح المجدوب', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 3, name: 'يونس الروكي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 4, name: 'محمد عسلي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 5, name: 'محمد حورية', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 6, name: 'مروان هلالي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 7, name: 'حمزة  كريش', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 8, name: 'أحمد مقدمي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 9, name: 'شيماء مسكي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 10, name: 'الميلودي الرك', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 11, name: 'حسن البحار', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 12, name: 'أحمد الزربي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 13, name: 'أحمد حوري', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 14, name: 'يوسف جبران', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 15, name: 'حليم عبد الهادي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 16, name: 'سعيد التدلاوي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 17, name: 'منير باهي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 18, name: 'أحمد شهبون', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 19, name: 'نور الدين ولد الغالية', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 20, name: 'محمد ازريزع', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 21, name: 'عمر سطور', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 22, name: 'نادية اجلادو', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 23, name: 'فتيحة كجاوي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 24, name: 'حليمة ابهالة', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 25, name: 'فاطمة الزهراء العريان', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 26, name: 'نزهة حمراء', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 27, name: 'حنان الخال', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 28, name: 'ثورية الرطباوي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 29, name: 'فتيحة جلال', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 30, name: 'بديعة الركي', present: false, checkInTimes: [], exitTimes: [], votes: {} },
  { id: 31, name: 'محجوبة تاج الدين', present: false, checkInTimes: [], exitTimes: [], votes: {} },
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
    exportJson: 'تصدير JSON',
    importJson: 'استيراد JSON',
    importJsonPlaceholder: 'ألصق البيانات JSON هنا',
    importSuccess: 'تم الاستيراد بنجاح',
    importError: 'خطأ في البيانات JSON',
    copySuccess: 'تم نسخ البيانات إلى الحافظة',
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
  const [timerStartTime, setTimerStartTime] = useState(saved.timerStartTime ?? null)
  const [timerStopTime, setTimerStopTime] = useState(saved.timerStopTime ?? null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportDataText, setExportDataText] = useState('')

  useEffect(() => {
    const payload = { members, agendas, timerSeconds, timerRunning, sessionName, currentPage, timerStartTime, timerStopTime }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  }, [members, agendas, timerSeconds, timerRunning, sessionName, currentPage, timerStartTime, timerStopTime])

  useEffect(() => {
    if (!timerRunning || !timerStartTime) return
    const timerId = setInterval(() => {
      setTimerSeconds(Math.floor((Date.now() - timerStartTime) / 1000))
    }, 1000)
    return () => clearInterval(timerId)
  }, [timerRunning, timerStartTime])

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

  const exportData = () => {
    const data = {
      members,
      agendas,
      timerSeconds,
      timerRunning,
      sessionName,
      currentPage,
      timerStartTime,
      timerStopTime,
      exportedAt: Date.now()
    }
    const jsonString = JSON.stringify(data, null, 2)
    setExportDataText(jsonString)
    setShowExportModal(true)
  }

  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString)
      
      // Validate required fields
      if (!data.members || !Array.isArray(data.members)) {
        throw new Error('Invalid members data')
      }
      
      // Update state
      setMembers(data.members || initialMembers)
      setAgendas(data.agendas || initialAgendas)
      setTimerSeconds(data.timerSeconds || 0)
      setTimerRunning(data.timerRunning || false)
      setSessionName(data.sessionName || '')
      setCurrentPage(data.currentPage || 'setup')
      setTimerStartTime(data.timerStartTime || null)
      setTimerStopTime(data.timerStopTime || null)
      
      alert(localeStrings.importSuccess)
    } catch (error) {
      console.error('Import error:', error)
      alert(localeStrings.importError)
    }
  }

  const resetSession = () => {
    setMembers(initialMembers)
    setAgendas(initialAgendas)
    setSessionName('')
    setCurrentPage('setup')
    setTimerSeconds(0)
    setTimerRunning(false)
    setTimerStartTime(null)
    setTimerStopTime(null)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  const localeStrings = locales.ar

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-6 px-3 sm:px-5 lg-px-10">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">نظام متابعة الحضور والتصويت لجماعة الشلالات</h1>
        {/* <div className="text-xs text-slate-500">{localeStrings.exportHint}</div> */}
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

            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              <button onClick={exportData} className="btn btn-primary">
                {localeStrings.exportJson}
              </button>
              <button 
                onClick={() => {
                  const jsonString = prompt(localeStrings.importJsonPlaceholder)
                  if (jsonString) {
                    importData(jsonString)
                  }
                }} 
                className="btn btn-secondary"
              >
                {localeStrings.importJson}
              </button>
            </div>

            <TimerControls
              timerSeconds={timerSeconds}
              timerStartTime={timerStartTime}
              timerStopTime={timerStopTime}
              timerRunning={timerRunning}
              onStart={() => {
                setTimerRunning(true)
                if (!timerStartTime) {
                  setTimerStartTime(Date.now())
                }
              }}
              onStop={() => {
                setTimerRunning(false)
                setTimerStopTime(Date.now())
              }}
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

        {currentPage === 'summary' && <SummaryPage members={members} agendas={agendas} timerStartTime={timerStartTime} timerStopTime={timerStopTime} localeStrings={localeStrings} />}
      </main>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">تصدير البيانات JSON</h3>
            <textarea
              value={exportDataText}
              readOnly
              className="w-full h-64 p-3 border border-slate-300 rounded font-mono text-sm"
              placeholder="البيانات JSON ستظهر هنا..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportDataText).then(() => {
                    alert('تم نسخ البيانات إلى الحافظة!')
                  }).catch(() => {
                    alert('يرجى نسخ البيانات يدوياً (Ctrl+A ثم Ctrl+C)')
                  })
                }}
                className="btn btn-primary"
              >
                نسخ إلى الحافظة
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="btn btn-secondary"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
