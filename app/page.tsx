import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";
import { ArrowRight, CheckCircle2, Sparkles, ChevronRight, Phone } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

// Font setup to match the aesthetic
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function AgencyLandingPage() {
  return (
    <main className={`min-h-screen bg-white text-slate-900 ${playfair.variable} ${inter.variable} font-sans`}>
      {/* Navigation */}
      <header className="border-b py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-2 font-serif text-xl font-bold">
            <Sparkles className="h-6 w-6 text-[#1D2D44]" />
            <span>Spark Agency</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <Link href="#services">Services</Link>
            <Link href="#process">Process</Link>
            <Link href="#case-studies">Case Studies</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
          <Button className="bg-[#1D2D44] hover:bg-[#3E5C76] text-white rounded-full px-6 flex gap-2">
            Book a 15-min Call <Phone className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* HERO SECTION with Sliding Carousel */}
      <section className="py-20 md:py-32 px-4 overflow-hidden relative">
        <div className="container mx-auto text-center max-w-4xl mb-16">
          <p className="text-slate-500 mb-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-slate-400 rounded-full"></span> 1,000+ Projects
            <span className="w-2 h-2 bg-slate-400 rounded-full ml-4"></span> 20+ Years Experience
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
            Trusted Conversion Websites, <br />
            Built for <span className="italic text-[#1D2D44] relative inline-block">Agencies That Scale.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Turn every visit into growth—partner with a team that's invested in your continued success.
          </p>
          <Button className="bg-[#1D2D44] hover:bg-[#3E5C76] text-white text-lg rounded-full px-8 py-6 flex gap-2 mx-auto shadow-lg shadow-[#F0EBD8]">
             Book a 15-min Call <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Sliding Website Carousel */}
        <div className="container mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {/* Mockup Items - Replace src with actual project screenshots */}
              {[1, 2, 3, 4].map((item) => (
                <CarouselItem key={item} className="pl-4 md:basis-1/2 lg:basis-2/3">
                  <div className="p-1 rounded-2xl bg-slate-100 border shadow-xl overflow-hidden aspect-[16/10] relative group">
                   <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-serif text-2xl">
                      Website Project {item}
                   </div>
                   {/* Example of how actual image would look:
                    <Image src={`/project-${item}.jpg`} alt="Project" fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                   */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
                <CarouselPrevious className="left-4"/>
                <CarouselNext className="right-4" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* TRUSTED BY & STATS SECTION */}
      <section className="py-24 bg-slate-50/50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-2xl text-slate-400 mb-8 italic">Trusted By</h3>
            {/* Placeholder Logos */}
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
                {['LogoIpsum', 'AgencyOne', 'ScaleUp', 'GrowthLabs', 'PartnerCo'].map((logo) => (
                    <div key={logo} className="font-bold text-2xl text-slate-300 flex items-center gap-2">
                        <div className="h-8 w-8 bg-slate-300 rounded-full"></div> {logo}
                    </div>
                ))}
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto mb-20">
             <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-slate-800">
                Driving <span className="text-[#1D2D44] italic">conversions</span>, scaling agencies, and transforming <span className="text-[#1D2D44] italic">growth</span>. Let's build your success together.
             </h2>
          </div>

          {/* Stats Grid with Dashed Borders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-dashed border-slate-200 bg-white shadow-none text-center py-8 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-serif text-6xl font-bold text-slate-800">1,000<span className="text-[#1D2D44]">+</span></CardTitle>
                <CardDescription className="text-lg font-medium text-slate-700 uppercase tracking-widest pt-4">Projects Delivered</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed px-8">
                We've successfully completed over 1,000 conversion-focused websites and we're just getting started.
              </CardContent>
            </Card>
            <Card className="border-2 border-dashed border-slate-200 bg-white shadow-none text-center py-8 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-serif text-6xl font-bold text-slate-800">85<span className="text-[#1D2D44]">%</span></CardTitle>
                <CardDescription className="text-lg font-medium text-slate-700 uppercase tracking-widest pt-4">Conversion Increase</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed px-8">
                Our strategies have helped agencies achieve up to 85% average conversion rate improvements.
              </CardContent>
            </Card>
            <Card className="border-2 border-dashed border-slate-200 bg-white shadow-none text-center py-8 rounded-[2rem]">
              <CardHeader>
                <CardTitle className="font-serif text-6xl font-bold text-slate-800">500<span className="text-[#1D2D44]">+</span></CardTitle>
                <CardDescription className="text-lg font-medium text-slate-700 uppercase tracking-widest pt-4">Agency Partners</CardDescription>
              </CardHeader>
              <CardContent className="text-slate-600 leading-relaxed px-8">
                More than 500 agencies trust us as their white-label partner to deliver quality work.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER & CASE STUDIES */}
      <section id="services" className="py-24 px-4">
        <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Left Side: Offerings */}
                <div className="lg:w-2/5">
                    <span className="text-[#1D2D44] font-bold tracking-widest uppercase text-sm">What We Offer</span>
                    <h2 className="font-serif text-4xl font-bold mt-4 mb-8">Premium Development for High-Growth Agencies</h2>
                    <p className="text-slate-600 mb-12 text-lg">We act as an extension of your team, handling the heavy lifting of development so you can focus on client relationships and strategy.</p>

                    <div className="grid gap-6">
                        {[
                            { title: "Webflow & Framer Development", desc: "Pixel-perfect builds on modern no-code platforms." },
                            { title: "Next.js & React Custom Builds", desc: "Headless solutions for complex requirements." },
                            { title: "Conversion Rate Optimization (CRO)", desc: "Data-driven tweaks to maximize ROI." },
                        ].map((service, i) => (
                            <div key={i} className="flex gap-4 items-start p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="bg-[#F0EBD8] p-2 rounded-full text-[#3E5C76] mt-1">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold font-serif">{service.title}</h4>
                                    <p className="text-slate-600 mt-2">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Case Studies Placeholder */}
                <div id="case-studies" className="lg:w-3/5 relative">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white h-full flex flex-col justify-end overflow-hidden relative group">
                        {/* Placeholder background image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                        <div className="absolute inset-0 bg-slate-800 group-hover:scale-105 transition-transform duration-700"></div>

                        <div className="relative z-20">
                            <span className="inline-block py-1 px-3 rounded-full bg-[#1D2D44] text-sm font-bold mb-4">Featured Case Study</span>
                            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">Scaling "TechFlow's" Lead Gen by 140% in 90 Days.</h3>
                            <p className="text-slate-300 mb-8 max-w-md">A complete rebuild using Next.js and Sanity CMS, focusing on site speed and clear conversion pathways.</p>
                            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 rounded-full">
                                View Case Study <ChevronRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section id="process" className="py-24 bg-slate-50 px-4">
          <div className="container mx-auto text-center max-w-3xl mb-16">
            <span className="text-[#1D2D44] font-bold tracking-widest uppercase text-sm">Our Approach</span>
            <h2 className="font-serif text-4xl font-bold mt-4">How We Work Together</h2>
            <p className="text-slate-600 mt-4 text-lg">A streamlined, transparent process designed to integrate seamlessly with your agency's workflow.</p>
          </div>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                  { step: "01", title: "Discovery & Handoff", desc: "We align on goals, digest your designs (Figma/Sketch), and define technical requirements." },
                  { step: "02", title: "Agile Development", desc: "We build in sprints with weekly updates, giving you full visibility into progress." },
                  { step: "03", title: "QA & Optimization", desc: "Rigorous testing across devices, speed optimization, and SEO foundation checks." },
                  { step: "04", title: "Launch & Support", desc: "Smooth deployment to your hosting of choice, plus 30 days of post-launch support." },
              ].map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                      <span className="text-8xl font-serif font-bold text-slate-100 absolute -top-6 -right-4 select-none">{item.step}</span>
                      <h4 className="text-xl font-bold font-serif mb-4 relative z-10">{item.title}</h4>
                      <p className="text-slate-600 relative z-10">{item.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* Q&A SECTION */}
      <section id="faq" className="py-24 px-4">
        <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
                <h2 className="font-serif text-4xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-slate-200 py-2">
                    <AccordionTrigger className="text-xl font-serif font-medium hover:text-[#1D2D44] text-left">Do you work directly with clients or are you white-label?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-lg leading-relaxed">
                        We are primarily a white-label partner for agencies. We work behind the scenes, and you maintain the direct relationship with your client. Our work is completely invisible to them unless you choose otherwise.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-slate-200 py-2">
                    <AccordionTrigger className="text-xl font-serif font-medium hover:text-[#1D2D44] text-left">What is your typical turnaround time for a project?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-lg leading-relaxed">
                        For a standard 5-10 page marketing site, our typical turnaround is 2-3 weeks from design sign-off. More complex builds with custom integrations may take 4-6 weeks.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b-slate-200 py-2">
                    <AccordionTrigger className="text-xl font-serif font-medium hover:text-[#1D2D44] text-left">What platforms do you specialize in?</AccordionTrigger>
                    <AccordionContent className="text-slate-600 text-lg leading-relaxed">
                        We specialize in Webflow for rapid, high-end marketing sites, and Next.js/React for more complex, data-driven web applications or headless CMS architectures.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-32 px-4 bg-slate-900 text-center text-white rounded-t-[3rem] mt-12">
          <div className="container mx-auto max-w-4xl">
              <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-tight">Are you ready to scale your <br/> agency's development capacity?</h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">Book a free consultation call. We'll discuss your current bottlenecks and how our team can integrate with yours.</p>
              <Button className="bg-[#1D2D44] hover:bg-[#3E5C76] text-white text-lg rounded-full px-10 py-7 flex gap-2 mx-auto shadow-xl shadow-[#0D1321]/20">
                  Book Your Strategy Call Now <ArrowRight className="h-6 w-6" />
              </Button>
          </div>
      </section>
    </main>
  );
}