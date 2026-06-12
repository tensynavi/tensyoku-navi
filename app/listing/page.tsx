'use client'
import { useState } from 'react'

export default function ListingPage() {
  const [form, setForm] = useState({ companyName: '', contactName: '', email: '', description: '', jobTitle: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.companyName || !form.email || !form.jobTitle) {
      setError('会社名・求人タイトル・メールアドレスは必須です')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setError(data.error || 'エラーが発生しました')
      }
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-2xl font-black text-blue-600">転職<span className="text-orange-500">Navi</span></a>
          <div className="flex gap-2">
            <a href="/" className="px-4 py-2 text-gray-500 hover:bg-blue-50 rounded-lg text-sm font-semibold">求人検索</a>
            <a href="/listing" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">企業掲載</a>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 text-center text-white mb-8">
          <h2 className="text-3xl font-black mb-3">求人を掲載して優秀な人材を採用しませんか？</h2>
          <p className="text-gray-300">全国の求職者に求人情報を届けられます</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 mb-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl font-black text-blue-600">1,000円<span className="text-xl text-gray-400">/月</span></div>
            <p className="text-gray-400 mt-2">1求人につき月額1,000円（税込）</p>
          </div>
          <ul className="space-y-3 mb-8">
            {['求人ページの無制限編集','都道府県・職種カテゴリへの掲載','応募者との直接メッセージ機能','閲覧数・応募数レポート','いつでもキャンセル可能'].map(f => (
              <li key={f} className="flex items-center gap-3 text-gray-700"><span className="text-green-500 font-bold">OK</span>{f}</li>
            ))}
          </ul>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">会社名</label>
              <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="株式会社〇〇" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">求人タイトル</label>
              <input value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} placeholder="営業スタッフ募集" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">担当者名</label>
              <input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} placeholder="山田 太郎" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">メールアドレス</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="info@company.co.jp" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">会社・求人の紹介（任意）</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="どんな求人か簡単にご記入ください" className="w-full border border-gray-200 rounded-lg px-4 py-3 h-24 resize-none focus:outline-none focus:border-blue-500" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-lg transition">
              {loading ? '処理中...' : '申し込んで決済へ進む'}
            </button>
            <p className="text-xs text-gray-400 text-center">ボタンを押すとStripeの決済ページへ移動します。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
