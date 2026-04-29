'use client'

// PostHog browser client - use in client components only
export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) return

  // Access posthog from window - loaded via CDN or script
  const posthog = (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog

  if (!posthog) {
    console.warn('PostHog not loaded')
    return
  }

  try {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('PostHog capture error:', err)
  }
}

export function capturePageView(url: string, properties?: Record<string, unknown>) {
  captureEvent('$pageview', {
    url,
    ...properties,
  })
}

export function captureUserAction(action: string, properties?: Record<string, unknown>) {
  captureEvent(action, {
    source: 'user_action',
    ...properties,
  })
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  const posthog = (window as unknown as { posthog?: { identify: (id: string, p?: Record<string, unknown>) => void } }).posthog
  if (!posthog) return

  try {
    posthog.identify(userId, properties)
  } catch (err) {
    console.error('PostHog identify error:', err)
  }
}

export function setUserProperties(properties: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  const posthog = (window as unknown as { posthog?: { people?: { set: (p: Record<string, unknown>) => void } } }).posthog
  if (!posthog?.people) return

  try {
    posthog.people.set(properties)
  } catch (err) {
    console.error('PostHog set properties error:', err)
  }
}

export function resetUser() {
  if (typeof window === 'undefined') return

  const posthog = (window as unknown as { posthog?: { reset: () => void } }).posthog
  if (!posthog) return

  try {
    posthog.reset()
  } catch (err) {
    console.error('PostHog reset error:', err)
  }
}