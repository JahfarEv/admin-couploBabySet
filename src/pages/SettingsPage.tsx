import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { db, doc, getDoc, serverTimestamp, setDoc } from '@/config/firebase'

const BANNER_DOC_ID = 'home'

function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink-soft">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
      />
    </div>
  )
}

function Toggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setChecked((v) => !v)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-mauve-600' : 'bg-black/10'}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { user, resetPassword } = useAuth()
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [bannerTitle, setBannerTitle] = useState('Welcome to Couplo')
  const [bannerImage, setBannerImage] = useState('')
  const [bannerStatus, setBannerStatus] = useState<string | null>(null)
  const [isSavingBanner, setIsSavingBanner] = useState(false)
  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false)

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const bannerRef = doc(db, 'banners', BANNER_DOC_ID)
        const snapshot = await getDoc(bannerRef)

        if (snapshot.exists()) {
          const data = snapshot.data()
          if (data?.title) setBannerTitle(data.title)
          if (data?.image) setBannerImage(data.image)
        }
      } catch (err) {
        console.error('Failed to load banner settings:', err)
      }
    }

    loadBanner()
  }, [])

  const handlePasswordReset = async () => {
    if (!user?.email) {
      setError('Admin email is unavailable.')
      return
    }

    setError(null)
    setStatus(null)
    setIsSending(true)

    try {
      await resetPassword(user.email)
      setStatus('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email.')
    } finally {
      setIsSending(false)
    }
  }

  const handleBannerSave = async () => {
    if (isUploadingBannerImage) {
      setBannerStatus('Please wait for the image upload to finish before saving.')
      return
    }

    setIsSavingBanner(true)
    setBannerStatus(null)

    try {
      const bannerRef = doc(db, 'banners', BANNER_DOC_ID)
      await setDoc(
        bannerRef,
        {
          title: bannerTitle,
          image: bannerImage,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setBannerStatus('Banner settings saved to Firebase.')
    } catch (err) {
      setBannerStatus(err instanceof Error ? err.message : 'Failed to save banner settings.')
    } finally {
      setIsSavingBanner(false)
    }
  }

  return (
    <div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Settings</h2>
        <p className="mt-1 text-ink-muted">Manage your admin email, password reset, and homepage banner.</p>
      </div>

      <div className="mt-6 space-y-6">
        <SettingsCard title="Homepage Banner" description="Set the banner image and title shown on the storefront landing area.">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Banner title</label>
            <input
              type="text"
              value={bannerTitle}
              onChange={(event) => {
                setBannerTitle(event.target.value)
                setBannerStatus(null)
              }}
              placeholder="Enter a banner title"
              className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm focus:border-mauve-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink-soft">Banner image</label>
            <ImageUpload
              currentImage={bannerImage}
              onUploadStateChange={setIsUploadingBannerImage}
              onImageUpload={(imageUrl) => {
                setBannerImage(imageUrl)
                setBannerStatus(null)
              }}
            />
          </div>

          <div className="rounded-2xl border border-dashed border-black/10 bg-cream-soft/60 p-4">
            <p className="text-sm font-medium text-ink">Preview</p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-black/10 bg-white">
              {bannerImage ? (
                <img src={bannerImage} alt="Banner preview" className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-cream-soft text-sm text-ink-muted">
                  Upload an image to see the banner preview
                </div>
              )}
              <div className="p-4">
                <p className="text-lg font-semibold text-ink">{bannerTitle || 'Banner title'}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBannerSave}
            disabled={isSavingBanner || isUploadingBannerImage}
            className="inline-flex items-center justify-center rounded-full bg-mauve-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mauve-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingBanner ? 'Saving…' : 'Save banner settings'}
          </button>

          {bannerStatus && (
            <p className={`text-sm ${bannerStatus.includes('Failed') ? 'text-red-600' : 'text-emerald-600'}`}>
              {bannerStatus}
            </p>
          )}
        </SettingsCard>

        <SettingsCard title="Admin Account" description="Manage your admin sign-in email and reset your password.">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">Email</label>
            <input
              type="email"
              readOnly
              value={user?.email ?? 'admin@couplo.com'}
              className="w-full rounded-xl border border-black/10 bg-cream-soft px-3.5 py-2.5 text-sm text-ink-soft focus:border-mauve-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isSending || !user?.email}
            className="inline-flex items-center justify-center rounded-full bg-mauve-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-mauve-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? 'Sending reset email…' : 'Send password reset email'}
          </button>

          {status && <p className="text-sm text-emerald-600">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </SettingsCard>
      </div>
    </div>
  )
}
