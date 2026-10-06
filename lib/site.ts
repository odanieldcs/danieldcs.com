export const siteName = 'danieldcs.com'

/** Canonical origin of the site, including in previews before the launch. */
export const siteUrl = 'https://danieldcs.com'

export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).href
}

export const contactEmail = 'hi@danieldcs.com'

export const linkedInProfileUrl = 'https://www.linkedin.com/in/odanieldcs'

export const gitHubProfileUrl = 'https://github.com/odanieldcs'
export const youTubeProfileUrl = 'https://www.youtube.com/c/odanieldcs'
export const instagramProfileUrl = 'https://www.instagram.com/odanieldcs'

export const personName = 'Daniel Castro'
export const personJobTitle = 'Engenheiro de software'
export const personImagePath = '/media/personal/daniel_castro_profile_3.jpg'

export const personId = `${siteUrl}/#person`
export const websiteId = `${siteUrl}/#website`

/** Profile URLs referenced by JSON-LD Person.sameAs (not Instagram). */
export const personSameAs = [
  linkedInProfileUrl,
  youTubeProfileUrl,
  gitHubProfileUrl,
] as const

const trilhaWhatsAppPhone = '+5551993657109'

/** Opens WhatsApp with a prefilled message about the Trilha. */
export function trilhaWhatsAppUrl(text: string): string {
  return `https://api.whatsapp.com/send?phone=${trilhaWhatsAppPhone}&text=${encodeURIComponent(text)}`
}
