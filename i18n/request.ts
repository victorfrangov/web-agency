import { getRequestConfig } from "next-intl/server"

const SUPPORTED = ["en", "fr"] as const

export default getRequestConfig(async ({ locale }) => {
  const selected = SUPPORTED.includes(locale as any) ? (locale as (typeof SUPPORTED)[number]) : "en"
  return {
    locale: selected,
    messages: (await import(`../messages/${selected}.json`)).default,
  }
})