import { siteName } from '@/lib/site'

export default function Home() {
  return (
    <main>
      <h1 className="text-red-500">{siteName}</h1>
    </main>
  )
}
