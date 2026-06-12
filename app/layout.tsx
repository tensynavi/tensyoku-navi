import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '転職Navi - あなたの理想の仕事が見つかる',
  description: '都道府県・職種・キーワードで近くの求人をすぐに検索できる転職サイト',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
