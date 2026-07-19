import type { Metadata } from "next"
import HomeClient from "@/components/home-client"

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "fr" }]
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams?.locale ?? "en"

  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch {
    messages = (await import(`@/messages/en.json`)).default
  }

  const title = messages.meta.title
  const description = messages.meta.description

  return {
    title,
    description,
    metadataBase: new URL("https://situsdigital.com"),
    alternates: {
      canonical: `https://situsdigital.com/${locale}`,
      languages: {
        en: "https://situsdigital.com/en",
        fr: "https://situsdigital.com/fr",
        "x-default": "https://situsdigital.com/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://situsdigital.com/${locale}`,
      siteName: "Situs Digital",
      locale: locale === "fr" ? "fr_CA" : "en_CA",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Situs Digital",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Page(props: any) {
  return (
    <div className="min-h-screen text-foreground">
      <main id="main-content">
        <HomeClient />
      </main>
    </div>
  )
}

