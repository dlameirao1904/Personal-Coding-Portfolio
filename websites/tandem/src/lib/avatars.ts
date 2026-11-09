import { requireSupabase } from '@/lib/supabase'

const BUCKET = 'avatars'
const MAX_BYTES = 3 * 1024 * 1024

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Escolhe uma imagem (JPEG, PNG ou WebP).'
  if (file.size > MAX_BYTES) return 'A imagem deve ter no máximo 3 MB.'
  return null
}

function cacheBust(url: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}t=${Date.now()}`
}

export async function uploadProfileAvatar(userId: string, file: File): Promise<string> {
  const validation = validateImageFile(file)
  if (validation) throw new Error(validation)

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `profiles/${userId}/avatar.${ext}`
  const sb = requireSupabase()

  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path)
  return cacheBust(data.publicUrl)
}

export async function uploadHouseholdAvatar(householdId: string, file: File): Promise<string> {
  const validation = validateImageFile(file)
  if (validation) throw new Error(validation)

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `households/${householdId}/avatar.${ext}`
  const sb = requireSupabase()

  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path)
  return cacheBust(data.publicUrl)
}
