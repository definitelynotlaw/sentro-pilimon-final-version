'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, LogOut, Shield, User, Monitor } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { usePasswordStrength } from '@/hooks/usePasswordStrength'
import { passwordChangeSchema, type PasswordChangeData } from '@/lib/validations/auth.schema'
import { uploadAvatar, deleteAvatar, updateUserAvatarUrl } from '@/lib/supabase/storage'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { StrengthMeter } from '@/components/ui/StrengthMeter'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

const roleColors: Record<string, string> = {
  student: '#1E3A5F',
  officer: '#1A6B3C',
  office_staff: '#7B3F00',
  moderator: '#4A1A7A',
  admin: '#6B0000',
}

export default function AccountSettingsPage() {
  const { profile, isHydrated, signOut, refreshProfile } = useAuth()
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { password: newPassword, setPassword, strength, requirements, isValid } = usePasswordStrength()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const currentPassword = watch('currentPassword')
  const confirmPassword = watch('confirmPassword')

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, or WEBP images are allowed')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB')
      return
    }

    setIsUploadingAvatar(true)
    try {
      const avatarUrl = await uploadAvatar(profile.id, file)
      await updateUserAvatarUrl(profile.id, avatarUrl)
      await refreshProfile()
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }, [profile, refreshProfile])

  const handleRemoveAvatar = useCallback(async () => {
    if (!profile) return
    setIsUploadingAvatar(true)
    try {
      await deleteAvatar(profile.id)
      await updateUserAvatarUrl(profile.id, '')
      await refreshProfile()
    } catch (error) {
      console.error('Avatar removal error:', error)
      alert('Failed to remove avatar. Please try again.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }, [profile, refreshProfile])

  const onPasswordSubmit = async (data: PasswordChangeData) => {
    setIsUpdatingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || '',
        password: data.currentPassword,
      })

      if (signInError || !signInData.user) {
        setPasswordError('Current password is incorrect')
        setIsUpdatingPassword(false)
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (updateError) {
        setPasswordError(updateError.message || 'Failed to update password')
      } else {
        setPasswordSuccess(true)
        reset()
        setPassword('')
      }
    } catch (error) {
      setPasswordError('An unexpected error occurred')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const avatarUrl = profile?.avatar_url
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A18' }}
        >
          Account Settings
        </h1>

        {/* Profile Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Profile</h2>
          </div>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: roleColors[profile?.role || 'student'] || '#6B0000' }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    initials
                  )}
                </div>
                <label
                  className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer"
                  style={{ backgroundColor: '#6B0000', color: 'white' }}
                >
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar}
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-sm" style={{ color: '#9A9A95' }}>Name</label>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>{profile?.full_name || 'User'}</p>
                  <p className="text-xs mt-1" style={{ color: '#9A9A95' }}>Name is synced from your institutional account</p>
                </div>
                <div>
                  <label className="text-sm" style={{ color: '#9A9A95' }}>Email</label>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>{profile?.email || ''}</p>
                </div>
                <div>
                  <label className="text-sm" style={{ color: '#9A9A95' }}>Role</label>
                  <span
                    className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mt-1"
                    style={{ backgroundColor: roleColors[profile?.role || 'student'] || '#6B0000' }}
                  >
                    {profile?.role || 'student'}
                  </span>
                </div>
              </div>
            </div>

            {/* Remove Avatar Button */}
            {avatarUrl && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #EBEBEA' }}>
                <Button variant="ghost" size="sm" onClick={handleRemoveAvatar} disabled={isUploadingAvatar}>
                  Remove photo
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Password Change Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Security</h2>
          </div>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            {passwordSuccess ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: '#EDF7F0' }}
                >
                  <svg className="h-8 w-8" style={{ color: '#1A6B3C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>Password Updated</h3>
                <p className="text-sm mb-4" style={{ color: '#5A5A56' }}>Your password has been successfully changed.</p>
                <Button variant="outline" onClick={() => setPasswordSuccess(false)}>
                  Change again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5A5A56' }}>
                    Current Password
                  </label>
                  <PasswordInput
                    error={!!errors.currentPassword}
                    {...register('currentPassword')}
                    placeholder="Enter current password"
                  />
                  {errors.currentPassword && (
                    <p className="text-sm mt-1" style={{ color: '#9B1C1C' }}>{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5A5A56' }}>
                    New Password
                  </label>
                  <PasswordInput
                    error={!!errors.newPassword}
                    {...register('newPassword')}
                    placeholder="Enter new password"
                    onChange={(e) => {
                      register('newPassword').onChange(e)
                      setPassword(e.target.value)
                    }}
                  />
                  {errors.newPassword && (
                    <p className="text-sm mt-1" style={{ color: '#9B1C1C' }}>{errors.newPassword.message}</p>
                  )}
                </div>

                {currentPassword && (
                  <StrengthMeter
                    password={newPassword}
                    strength={strength}
                    requirements={requirements}
                  />
                )}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#5A5A56' }}>
                    Confirm New Password
                  </label>
                  <PasswordInput
                    error={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm mt-1" style={{ color: '#9B1C1C' }}>{errors.confirmPassword.message}</p>
                  )}
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm mt-1" style={{ color: '#9B1C1C' }}>Passwords do not match</p>
                  )}
                </div>

                {passwordError && (
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#9B1C1C' }}>
                    {passwordError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isUpdatingPassword || !isValid}
                  isLoading={isUpdatingPassword}
                >
                  Update Password
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* Session Management Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-5 w-5" style={{ color: '#6B0000' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Active Sessions</h2>
          </div>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F5F5F3' }}
                >
                  <Monitor className="h-5 w-5" style={{ color: '#5A5A56' }} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1A1A18' }}>Current session</p>
                  <p className="text-sm" style={{ color: '#9A9A95' }}>This browser</p>
                </div>
              </div>
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: '#EDF7F0', color: '#1A6B3C' }}
              >
                Active
              </span>
            </div>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #EBEBEA' }}>
              <p className="text-xs" style={{ color: '#9A9A95' }}>
                Signing out other sessions will require you to log in again on other devices.
              </p>
            </div>
          </div>
        </section>

        {/* Logout Section */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <LogOut className="h-5 w-5" style={{ color: '#9B1C1C' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A18' }}>Sign Out</h2>
          </div>
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid #EBEBEA', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <p className="mb-4" style={{ color: '#5A5A56' }}>
              Are you sure you want to sign out of your account?
            </p>
            <Button variant="danger" onClick={() => setShowLogoutConfirm(true)}>
              Sign Out
            </Button>
          </div>
        </section>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleSignOut}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to log in again to access your account."
        confirmText="Sign Out"
        variant="danger"
        isLoading={isSigningOut}
      />
    </main>
  )
}