"use client"

import Link from "next/link"
import { useReveal } from "@/hooks/use-reveal"
import { useTranslations } from "next-intl"

type Project = {
  number: string
  year: string
}

const projects: Project[] = [
  { number: "01", year: "2026" },
  { number: "02", year: "2026" },
  { number: "03", year: "2025" },
  { number: "04", year: "2025" },
]

export function WorkSection() {
  const t = useTranslations("work")
  const { ref, isVisible } = useReveal(0.3)

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {t("title")}
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">{t("subtitle")}</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={`${project.number}-${i}`} project={project} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isVisible,
}: {
  project: { number: string; year: string }
  index: number
  isVisible: boolean
}) {
  const t = useTranslations("work")

  const direction = index % 2 === 0 ? "left" : "right"

  const getRevealClass = () => {
    if (!isVisible) {
      return direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
    }
    return "translate-x-0 opacity-100"
  }

  const link = t(`projects.${index}.link`)
  const hasLink = Boolean(link)

  return (
    <div
      className={`group flex items-center justify-between border-b border-foreground/10 py-6 transition-all duration-700 hover:border-foreground/20 md:py-8 ${getRevealClass()}`}
      style={{
        transitionDelay: `${index * 150}ms`,
        marginLeft: index % 2 === 0 ? "0" : "auto",
        maxWidth: index % 2 === 0 ? "85%" : "90%",
      }}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
          {project.number}
        </span>
        <div>
          {hasLink ? (
            <div className="inline-flex items-center gap-2 group/link">
              <Link
                href={link}
                className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="mb-1 font-sans text-2xl font-light text-foreground transition-transform duration-300 group-hover/link:translate-x-2 md:text-3xl lg:text-4xl">
                  {t(`projects.${index}.title`)}
                </h3>
              </Link>
            </div>
          ) : (
            <h3 className="mb-1 font-sans text-2xl font-light text-foreground md:text-3xl lg:text-4xl">
              {t(`projects.${index}.title`)}
            </h3>
          )}
          <p className="font-mono text-xs text-foreground/50 md:text-sm">{t(`projects.${index}.category`)}</p>
        </div>
      </div>
      <span className="font-mono text-xs text-foreground/30 md:text-sm">{project.year}</span>
    </div>
  )
}
