import { Resend } from 'resend'
import { logger } from './logger'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.FROM_EMAIL ?? 'onboarding@resend.dev'

let resend: Resend | null = null
if (resendApiKey) {
  resend = new Resend(resendApiKey)
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    logger.warn({ to, subject }, 'Resend not configured. Email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    })

    if (error) {
      logger.error({ err: error }, 'Email send failed')
      return { success: false, error: error.message }
    }

    logger.info({ id: data?.id, to, subject }, 'Email sent')
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Email error'
    logger.error({ err: err instanceof Error ? err : undefined }, 'Email exception')
    return { success: false, error: message }
  }
}
