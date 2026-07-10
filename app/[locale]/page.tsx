import type { Metadata } from "next"
import HomeClient from "@/components/home-client"

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }, { locale: "fr" }]
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams?.locale ?? "en"

  return {
    title: "Situs Digital",
    description: "Situs Digital",
    metadataBase: new URL("https://situsdigital.com")
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

