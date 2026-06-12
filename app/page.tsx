'use client'
import { useState } from 'react'

const PREFECTURES = [
  "全国","北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
]

const JOB_TYPES = [
  "すべての職種","エンジニア・IT","営業","事務・管理","販売・接客",
  "医療・介護","教育・保育","建設・土木","製造・物流","デザイン・クリエイティブ",
  "飲食・フード","その他",
]

export default function Home() {
  const [prefecture, setPrefecture] = useState('全国')
  const [jobType, setJobType] = useState('すべての職種')
  const [keyword, setKeyword] = useState('')
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selected, setSelected] = useState<any>(null)

  const doSearch = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (prefecture !== '全国') params.set('prefecture', prefecture)
    if (jobType !== 'すべての職種') params.set('jobType', jobType)
    if (keyword) params.set('keyword', keyword)
    const res = await fetch(`/api/jobs?${params}`)
    const data = await res.json()
    setJobs(data.jobs || [])
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black text-blue-600">転職<span className="text-orange-500">Navi</span></span>
          <div className="flex gap-2">
            <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">求人検索</a>
            <a href="/listing" className="px-4 py-2 text-gray-500 hover:bg-blue-50 rounded-lg text-sm font-semibold">企業掲載</a>
          </div>
        </div>
      </nav>
      <div className="bg-gradient-to-br from-blue-800 to-blue-500 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-3">あなたの<span className="text-yellow-300">理想の仕事</span>が見つかる</h1>
          <p className="text-blue-100 mb-8">都道府県・職種・キーワードで近くの求人をすぐに検索</p>
          <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-wrap gap-4">
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">都道府県</label>
              <select value={prefecture} onChange={e => setPrefecture(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                {PREFECTURES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">職種</label>
              <select value={jobType} onChange={e => setJobType(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                {JOB_TYPES.map(j => <option key={j}>{j}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-36">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">キーワード</label>
              <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="会社名・職種名など" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <button onClick={doSearch} className="self-end bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-2.5 rounded-lg transition">検索する</button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {!searched ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-6xl mb-4">🔍</div>
            <p>条件を選んで「検索する」を押してください</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-gray-400"><p>検索中...</p></div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">😔</div>
            <p>条件に合う求人が見つかりませんでした</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6"><span className="text-blue-600 font-bold text-xl">{jobs.length}</span> 件の求人</p>
            <div className="flex flex-col gap-4">
              {jobs.map((job: any) => (
                <div key={job.id} onClick={() => setSelected(job)} className="bg-white rounded-xl border-2 border-gray-100 p-6 flex gap-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition">
                  <div className="text-4xl w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">{job.companies?.logo_emoji || '🏢'}</div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">{job.companies?.name}</p>
                    <p className="font-bold text-lg mb-2">{job.title}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                      <span>📍 {job.prefecture}</span>
                      <span>💼 {job.job_type}</span>
                      <span>📋 {job.employment_type}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(job.tags || []).map((t: string) => <span key={t} className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">{t}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-orange-500 font-black text-lg">{job.salary}</p>
                    <p className="text-xs text-gray-400 mt-1">年収目安</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{selected.companies?.logo_emoji || '🏢'}</div>
              <div className="flex-1">
                <h2 className="text-xl font-black">{selected.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selected.companies?.name} ・ {selected.prefecture}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-2xl text-gray-400">✕</button>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[['給与', selected.salary, 'text-orange-500'], ['雇用形態', selected.employment_type, ''], ['勤務地', selected.prefecture, ''], ['職種', selected.job_type, '']].map(([label, val, cls]) => (
                <div key={label as string} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">{label}</p>
                  <p className={`font-bold ${cls}`}>{val}</p>
                </div>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition">この求人に応募する →</button>
          </div>
        </div>
      )}
    </div>
  )
}
