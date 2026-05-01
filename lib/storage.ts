import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

const BUCKET_AVATARS = 'avatars'
const BUCKET_LOGOS = 'logos'
const BUCKET_GALLERY = 'gallery'

export type UploadResult = {
  success: boolean
  url?: string
  error?: string
}

function getBucket(type: 'avatar' | 'logo' | 'gallery') {
  switch (type) {
    case 'avatar':
      return BUCKET_AVATARS
    case 'logo':
      return BUCKET_LOGOS
    case 'gallery':
      return BUCKET_GALLERY
  }
}

export async function uploadImage(
  file: File,
  type: 'avatar' | 'logo' | 'gallery',
  entityId: string
): Promise<UploadResult> {
  try {
    const supabase = await createClient()
    const bucket = getBucket(type)
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${entityId}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (error) {
      logger.error({ err: error }, 'Upload failed')
      return { success: false, error: error.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return { success: true, url: publicUrl }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload error'
    logger.error({ err: err instanceof Error ? err : undefined }, 'Upload exception')
    return { success: false, error: message }
  }
}

export async function deleteImage(
  path: string,
  type: 'avatar' | 'logo' | 'gallery'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const bucket = getBucket(type)

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      logger.error({ err: error }, 'Delete failed')
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete error'
    logger.error({ err: err instanceof Error ? err : undefined }, 'Delete exception')
    return { success: false, error: message }
  }
}

export function extractPathFromUrl(url: string, type: 'avatar' | 'logo' | 'gallery'): string | null {
  const bucket = getBucket(type)
  const prefix = `/storage/v1/object/public/${bucket}/`
  const idx = url.indexOf(prefix)
  if (idx === -1) return null
  return url.slice(idx + prefix.length)
}
