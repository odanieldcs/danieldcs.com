import { Welcome } from '../welcome/welcome'
import type { Route } from './+types/home'

// biome-ignore lint/correctness/noEmptyPattern: <explanation>
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Daniel Castro - Software Engineer' },
    {
      name: 'description',
      content: "Welcome to Daniel Castro's personal website!",
    },
  ]
}

export default function Home() {
  return <Welcome />
}
