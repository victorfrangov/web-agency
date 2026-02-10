"use client"

import { useReveal } from "@/hooks/use-reveal"
import { useTranslations } from "next-intl"

export function ProcessSection() {
  const t = useTranslations("process")

  const { ref, isVisible } = useReveal(0.3)

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Description"),
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Description"),
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Description"),
    },
    {
      number: "04",
      title: t("step4Title"),
      description: t("step4Description"),
    },
  ]

  return (
    <section
      ref={ref}
      className="flex min-h-screen w-screen shrink-0 snap-start items-center px-4 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Left side - Heading */}
          <div>
            <div
              className={`mb-6 transition-all duration-700 md:mb-12 ${
                isVisible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
              }`}
            >
              <h2 className="mb-3 font-sans text-5xl font-light leading-none tracking-tight text-foreground md:mb-4 md:text-7xl lg:text-8xl">
                {t("heading")}
              </h2>
              <p className="max-w-md font-mono text-sm text-foreground/60 md:text-base">{t("subheading")}</p>
            </div>

            <div
              className={`space-y-3 transition-all duration-700 md:space-y-4 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="max-w-md text-base leading-relaxed text-foreground/90 md:text-xl">{t("description")}</p>
            </div>
          </div>

          {/* Right side - Process Steps */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            {steps.map((step, i) => {
              const getRevealClass = () => {
                if (!isVisible) {
                  return "translate-x-16 opacity-0"
                }
                return "translate-x-0 opacity-100"
              }

              return (
                <div
                  key={i}
                  className={`flex gap-4 border-l border-foreground/30 pl-4 transition-all duration-700 md:gap-6 md:pl-6 ${getRevealClass()}`}
                  style={{
                    transitionDelay: `${300 + i * 150}ms`,
                  }}
                >
                  <div className="shrink-0 font-mono text-2xl font-light text-foreground/60 md:text-3xl">
                    {step.number}
                  </div>
                  <div className="space-y-2">
                    <div className="font-sans text-lg font-light text-foreground md:text-2xl">{step.title}</div>
                    <div className="text-sm leading-relaxed text-foreground/70 md:text-base">{step.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
