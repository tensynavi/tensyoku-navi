export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-12 max-w-md w-full text-center shadow-lg">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-black text-gray-800 mb-3">決済が完了しました！</h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          求人が公開されました。<br />
          ご登録のメールアドレスに<br />
          公開完了メールをお送りしました。
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-left">
          <p className="text-green-700 text-sm font-semibold mb-2">✅ 自動で完了したこと</p>
          <ul className="text-green-600 text-sm space-y-1">
            <li>・求人ページが公開されました</li>
            <li>・完了メールを送信しました</li>
            <li>・月額1,000円の課金が開始しました</li>
          </ul>
        </div>
        <a href="/" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
          求人を探す →
        </a>
      </div>
    </div>
  )
}
