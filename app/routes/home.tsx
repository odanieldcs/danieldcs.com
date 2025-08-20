import { Welcome } from '../welcome/welcome'

export function meta() {
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
