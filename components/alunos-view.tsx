import { Fragment } from 'react'
import { Container } from '@/components/container'
import { certificatePage } from '@/lib/content/certificates'
import type {
  CertificateDescription,
  CertificateGroup,
} from '@/lib/content/certificates-schema'
import { linkClassName } from '@/lib/link-styles'

function Description({ parts }: { parts: CertificateDescription }) {
  return parts.map((part, index) =>
    typeof part === 'string' ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static description fragments, fixed order.
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <a
        key={part.href}
        href={part.href}
        className={linkClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {part.label}
      </a>
    ),
  )
}

function CertificateGroupSection({ group }: { group: CertificateGroup }) {
  const titleId = `${group.id}-title`

  return (
    <section id={group.id} aria-labelledby={titleId} className="max-w-content">
      <h2 id={titleId} className="font-display text-3xl font-medium">
        {group.title}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-foreground/70">
        <Description parts={group.description} />
      </p>
      {'emptyMessage' in group ? (
        <p className="mt-8 text-sm leading-relaxed text-foreground/55">
          {group.emptyMessage}
        </p>
      ) : (
        <>
          <h3 className="mt-8 text-sm font-semibold">{group.listLabel}</h3>
          <ul className="mt-4 flex list-none flex-col gap-2 text-sm">
            {group.certificates.map((certificate) => (
              <li
                key={certificate.number}
                className="grid grid-cols-[9.5rem_minmax(0,1fr)] gap-3"
              >
                <span className="font-mono text-foreground/55">
                  {certificate.number}
                </span>
                <span>{certificate.name}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export function AlunosView() {
  return (
    <Container as="main" width="page" className="py-20 sm:py-24">
      <header className="max-w-content">
        <h1 className="font-display text-3xl font-medium">
          {certificatePage.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/55">
          {certificatePage.intro}
        </p>
        <nav aria-label="Treinamentos e eventos" className="mt-8">
          <ul className="flex list-none flex-col gap-2 text-sm">
            {certificatePage.groups.map((group) => (
              <li key={group.id}>
                <a href={`#${group.id}`} className={linkClassName}>
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="mt-16 flex flex-col gap-20">
        {certificatePage.groups.map((group) => (
          <CertificateGroupSection key={group.id} group={group} />
        ))}
      </div>
    </Container>
  )
}
