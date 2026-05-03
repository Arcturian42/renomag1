'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function uploadCertification(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const artisanId = formData.get('artisanId') as string

    if (!file || !artisanId) {
      return { success: false, error: 'Fichier ou ID artisan manquant' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non authentifié' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${artisanId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('certifications')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: 'Erreur lors de l\'upload' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certifications')
      .getPublicUrl(fileName)

    // Update artisan company with new certification
    const artisan = await prisma.artisanCompany.findUnique({
      where: { id: artisanId },
      select: { certificationDocs: true }
    })

    const existingDocs = (artisan?.certificationDocs as any) || []
    const newDocs = Array.isArray(existingDocs) ? existingDocs : []
    newDocs.push({ name: file.name, url: publicUrl })

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { certificationDocs: newDocs }
    })

    return { success: true, url: publicUrl }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}

export async function deleteCertification({ url, artisanId }: { url: string; artisanId: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Non authentifié' }
    }

    // Extract file path from URL
    const filePath = url.split('/certifications/')[1]

    if (filePath) {
      // Delete from storage
      await supabase.storage.from('certifications').remove([filePath])
    }

    // Update database
    const artisan = await prisma.artisanCompany.findUnique({
      where: { id: artisanId },
      select: { certificationDocs: true }
    })

    const existingDocs = (artisan?.certificationDocs as any) || []
    const newDocs = Array.isArray(existingDocs)
      ? existingDocs.filter((doc: any) => doc.url !== url)
      : []

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { certificationDocs: newDocs }
    })

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}

export async function uploadProjectDocument(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return { success: false, error: 'Fichier ou ID utilisateur manquant' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { success: false, error: 'Non authentifié' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { success: false, error: 'Erreur lors de l\'upload' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-documents')
      .getPublicUrl(fileName)

    // Save to database
    await prisma.projectDocument.create({
      data: {
        userId,
        fileName: file.name,
        fileUrl: publicUrl,
        fileType: file.type,
        fileSize: file.size
      }
    })

    return { success: true, url: publicUrl, fileName: file.name }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}

export async function deleteProjectDocument({ documentId, userId }: { documentId: string; userId: string }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return { success: false, error: 'Non authentifié' }
    }

    // Get document
    const document = await prisma.projectDocument.findUnique({
      where: { id: documentId }
    })

    if (!document) {
      return { success: false, error: 'Document non trouvé' }
    }

    // Extract file path from URL
    const filePath = document.fileUrl.split('/project-documents/')[1]

    if (filePath) {
      // Delete from storage
      await supabase.storage.from('project-documents').remove([filePath])
    }

    // Delete from database
    await prisma.projectDocument.delete({
      where: { id: documentId }
    })

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
