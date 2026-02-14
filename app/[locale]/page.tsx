import type { Metadata } from "next"
import HomeClient from "@/components/home-client"

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "fr" }]
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams?.locale ?? "en"

  return {
    title: "Web Agency",
    description: "description",
    metadataBase: new URL("https://example.com"),
    other: {
      "theme-color": "#1e1e1e",
    },
  }
}

export default async function Page(props: any) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content">
        <HomeClient />
      </main>
    </div>
  )
}

