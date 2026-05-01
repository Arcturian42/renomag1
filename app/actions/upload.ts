'use server'

import { uploadImage, deleteImage, extractPathFromUrl } from '@/lib/storage'
import { revalidatePath } from 'next/cache'

export async function uploadAvatar(file: File, userId: string) {
  const result = await uploadImage(file, 'avatar', userId)
  if (result.success) {
    revalidatePath('/espace-pro/profil')
    revalidatePath('/admin/utilisateurs')
  }
  return result
}

export async function uploadLogo(file: File, artisanId: string) {
  const result = await uploadImage(file, 'logo', artisanId)
  if (result.success) {
    revalidatePath('/espace-pro/profil')
    revalidatePath('/annuaire/[slug]')
  }
  return result
}

export async function uploadGalleryImage(file: File, artisanId: string) {
  const result = await uploadImage(file, 'gallery', artisanId)
  if (result.success) {
    revalidatePath('/espace-pro/profil')
    revalidatePath('/annuaire/[slug]')
  }
  return result
}

export async function removeImage(url: string, type: 'avatar' | 'logo' | 'gallery') {
  const path = extractPathFromUrl(url, type)
  if (!path) return { success: false, error: 'Invalid URL' }

  const result = await deleteImage(path, type)
  if (result.success) {
    revalidatePath('/espace-pro/profil')
    revalidatePath('/annuaire/[slug]')
    revalidatePath('/admin/utilisateurs')
  }
  return result
}
