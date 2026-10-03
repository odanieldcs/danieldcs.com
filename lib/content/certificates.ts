import { certificatePageData } from '@/content/certificates'
import {
  type CertificatePage,
  certificatePageSchema,
} from './certificates-schema'

export const certificatePage: CertificatePage =
  certificatePageSchema.parse(certificatePageData)
