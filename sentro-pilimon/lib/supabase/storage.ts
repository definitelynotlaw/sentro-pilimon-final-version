import { createClient } from '@/lib/supabase/client'

const AVATAR_BUCKET = 'avatars'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient()

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    throw new Error(`Failed to upload avatar: ${uploadError.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function deleteAvatar(userId: string): Promise<void> {
  const supabase = createClient()

  const { error: deleteError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`])

  if (deleteError) {
    console.error('Failed to delete avatar:', deleteError)
  }
}

export async function updateUserAvatarUrl(userId: string, avatarUrl: string): Promise<void> {
  const supabase = createClient()

  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (updateError) {
    throw new Error(`Failed to update avatar URL: ${updateError.message}`)
  }
}
const ORG_LOGOS_BUCKET = 'avatars'

export async function uploadOrgLogo(orgId: string, file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `orgs/${orgId}/logo.${ext}`
  const { error: uploadError } = await supabase.storage
    .from(ORG_LOGOS_BUCKET)
    .upload(filePath, file, { upsert: true, contentType: file.type })
  if (uploadError) throw new Error(`Failed to upload org logo: ${uploadError.message}`)
  const { data: urlData } = supabase.storage
    .from(ORG_LOGOS_BUCKET)
    .getPublicUrl(filePath)
  return urlData.publicUrl
}

export async function updateOrgLogoUrl(orgId: string, logoUrl: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('organizations')
    .update({ logo_url: logoUrl })
    .eq('id', orgId)
  if (error) throw new Error(`Failed to update org logo URL: ${error.message}`)
}
