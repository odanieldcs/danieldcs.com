import { Container } from '@/components/container'
import { linkClassName } from '@/lib/link-styles'
import { siteName } from '@/lib/site'

const emailAddress = 'hi@danieldcs.com'
const linkedInUrl = 'https://www.linkedin.com/in/odanieldcs'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <Container
        width="page"
        className="flex flex-col gap-content-gap py-section"
      >
        <ul className="flex list-none flex-wrap gap-content-gap text-body">
          <li>
            <a
              href={`mailto:${emailAddress}`}
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              {emailAddress}
            </a>
          </li>
          <li>
            <a
              href={linkedInUrl}
              className={linkClassName}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>
        <p className="text-caption text-muted">
          © {year} {siteName}
        </p>
      </Container>
    </footer>
  )
}
