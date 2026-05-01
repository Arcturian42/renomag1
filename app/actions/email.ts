'use server'

import { sendEmail } from '@/lib/email'
import { welcomeEmail, leadReceivedEmail, passwordResetEmail, newMessageEmail } from '@/lib/email-templates'

export async function sendWelcomeEmail(email: string, firstName?: string | null) {
  const { subject, html } = welcomeEmail({ firstName })
  return sendEmail({ to: email, subject, html })
}

export async function sendLeadReceivedEmail(
  email: string,
  artisanName: string,
  leadName: string,
  projectType: string,
  city: string,
  firstName?: string | null
) {
  const { subject, html } = leadReceivedEmail({ firstName, artisanName, leadName, projectType, city })
  return sendEmail({ to: email, subject, html })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const { subject, html } = passwordResetEmail({ resetUrl })
  return sendEmail({ to: email, subject, html })
}

export async function sendNewMessageEmail(email: string, senderName: string, preview: string) {
  const { subject, html } = newMessageEmail({ senderName, preview })
  return sendEmail({ to: email, subject, html })
}
