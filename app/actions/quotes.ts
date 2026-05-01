'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface QuoteLineItemInput {
  designation: string
  quantity: number
  unitPrice: number
}

export async function createQuote({
  leadId,
  artisanId,
  lineItems,
  notes,
  validityDays = 30,
  tvaRate = 0.2,
}: {
  leadId: string
  artisanId: string
  lineItems: QuoteLineItemInput[]
  notes?: string
  validityDays?: number
  tvaRate?: number
}) {
  try {
    const totalHT = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const totalTTC = totalHT * (1 + tvaRate)

    const quote = await prisma.quote.create({
      data: {
        leadId,
        artisanId,
        notes: notes || null,
        validityDays,
        tvaRate,
        totalHT,
        totalTTC,
        lineItems: {
          create: lineItems.map((item) => ({
            designation: item.designation,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { lineItems: true, lead: true, artisan: true },
    })

    revalidatePath('/espace-pro/leads')
    revalidatePath('/espace-proprietaire/mon-projet')
    return { success: true, data: quote }
  } catch (err: any) {
    console.error('createQuote error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getQuoteById(quoteId: string) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { lineItems: true, lead: true, artisan: true },
    })
    if (!quote) return { success: false, error: 'Devis introuvable' }
    return { success: true, data: quote }
  } catch (err: any) {
    console.error('getQuoteById error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getQuotesByLead(leadId: string) {
  try {
    const quotes = await prisma.quote.findMany({
      where: { leadId },
      include: { lineItems: true, artisan: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: quotes }
  } catch (err: any) {
    console.error('getQuotesByLead error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getQuotesByArtisan(artisanId: string) {
  try {
    const quotes = await prisma.quote.findMany({
      where: { artisanId },
      include: { lineItems: true, lead: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: quotes }
  } catch (err: any) {
    console.error('getQuotesByArtisan error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function updateQuoteStatus(quoteId: string, status: 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED') {
  try {
    const data: any = { status }
    if (status === 'ACCEPTED') data.acceptedAt = new Date()
    if (status === 'REJECTED') data.rejectedAt = new Date()

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data,
      include: { lead: true },
    })

    // If accepted, optionally create a project
    if (status === 'ACCEPTED' && quote.lead) {
      await prisma.project.upsert({
        where: { leadId: quote.leadId },
        create: {
          leadId: quote.leadId,
          ownerId: quote.leadId, // placeholder — should be actual lead owner userId if linked
          artisanId: quote.artisanId,
          status: 'QUOTE_ACCEPTED',
          finalPrice: quote.totalTTC,
        },
        update: {
          status: 'QUOTE_ACCEPTED',
          finalPrice: quote.totalTTC,
        },
      })
    }

    revalidatePath('/espace-pro/leads')
    revalidatePath('/espace-proprietaire/mon-projet')
    return { success: true, data: quote }
  } catch (err: any) {
    console.error('updateQuoteStatus error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function deleteQuote(quoteId: string) {
  try {
    await prisma.quote.delete({ where: { id: quoteId } })
    revalidatePath('/espace-pro/leads')
    return { success: true }
  } catch (err: any) {
    console.error('deleteQuote error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}
