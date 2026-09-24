export const siteName = 'danieldcs.com'

/**
 * Placeholder inbox for `/about` mailto links.
 * Confirm or replace before this ships live — the Footer still has no public email.
 */
export const contactEmail = 'hi@danieldcs.com'

export const linkedInProfileUrl = 'https://www.linkedin.com/in/odanieldcs'

const trilhaWhatsAppPhone = '+5551993657109'

/** Opens WhatsApp with a prefilled message about the Trilha. */
export function trilhaWhatsAppUrl(text: string): string {
  return `https://api.whatsapp.com/send?phone=${trilhaWhatsAppPhone}&text=${encodeURIComponent(text)}`
}
