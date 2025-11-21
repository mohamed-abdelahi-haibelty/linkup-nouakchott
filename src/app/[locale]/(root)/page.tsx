"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  QrCode,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PatternBg from "@/components/shared/PatternBg";
import BrowserMockup from "@/components/ui/BowserMockup";
import AppNavbar from "../(root)/components/AppNavbar";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("landingPage");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <div className="min-h-screen">
        <AppNavbar />

        {/* HERO */}
        <PatternBg>
          <section
            ref={heroRef}
            className="relative pt-10 pb-20 md:pt-10 md:pb-32 overflow-hidden"
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--accent)/0.15),transparent_50%)]" />
              <div
                className="absolute inset-0 opacity-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--accent)/0.15), transparent 40%)`,
                }}
              />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16 space-y-8 animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium text-foreground">
                      {t("hero.badge.live")}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {t("hero.badge.beta")}
                    </Badge>
                  </div>

                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
                    <span className="block text-foreground mb-2">
                      {t("hero.title.line1")}
                    </span>
                    <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                      {t("hero.title.line2")}
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {t("hero.description")}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link href={"/events"}>
                      <Button size="lg" className="text-base px-8 h-12 group">
                        {t("hero.buttons.explore")}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>

                    <Link href={"/events/create"}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-base px-8 h-12 border-2"
                      >
                        {t("hero.buttons.create")}
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative animate-fade-in-up">
                  <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-3xl blur-3xl" />
                  <div className="relative rounded-2xl overflow-hidden border shadow-2xl bg-card">
                    <BrowserMockup
                      src="/images/discover-events-lg.png"
                      alt="discover events"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </PatternBg>

        {/* FEATURES */}
        <PatternBg>
          <section id="features" className="py-24 md:py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />

            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-20 space-y-4">
                  <Badge variant="outline" className="text-sm">
                    {t("features.sectionTitle")}
                  </Badge>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                    {t("features.sectionSubtitle.line1")}
                    <br />
                    <span className="text-muted-foreground">
                      {t("features.sectionSubtitle.line2")}
                    </span>
                  </h2>
                </div>

                <div className="space-y-32">
                  {/* Feature 1 */}
                  <div className="relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6 lg:pr-8">
                        <h3 className="text-4xl md:text-5xl font-bold">
                          {t("features.feature1.title")}
                        </h3>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                          {t("features.feature1.description")}
                        </p>

                        <div className="flex flex-wrap gap-3 pt-4">
                          {t
                            .raw("features.feature1.categories")
                            .map((cat: string, i: number) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-sm px-4 py-1.5"
                              >
                                {cat}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div className="relative group">
                        <BrowserMockup
                          src="/images/discover-events-lg.png"
                          alt="event discovery"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="lg:order-2 space-y-6 lg:pl-8">
                        <h3 className="text-4xl md:text-5xl font-bold">
                          {t("features.feature2.title")}
                        </h3>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                          {t("features.feature2.description")}
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                          {t
                            .raw("features.feature2.points")
                            .map((point: any, index: number) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Check className="w-5 h-5 text-green-600" />
                                  <span className="font-semibold">
                                    {point.title}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {point.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>

                      <BrowserMockup
                        src="/images/ticket-mobile.png"
                        alt="ticket mobile"
                      />
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6 lg:pr-8">
                        <h3 className="text-4xl md:text-5xl font-bold">
                          {t("features.feature3.title")}
                        </h3>

                        <p className="text-xl text-muted-foreground leading-relaxed">
                          {t("features.feature3.description")}
                        </p>

                        <div className="space-y-4 pt-4">
                          {t
                            .raw("features.feature3.bullets")
                            .map((bullet: string, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-orange-600" />
                                </div>
                                <span className="font-medium">{bullet}</span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <BrowserMockup
                        src="/images/create-events-lg.png"
                        alt="event creation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how-it-works" className="py-24 md:py-10 relative">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-20 space-y-4">
                  <Badge variant="outline" className="text-sm">
                    {t("steps.sectionTitle")}
                  </Badge>

                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
                    {t("steps.sectionSubtitle.line1")}
                    <br />
                    <span className="text-muted-foreground">
                      {t("steps.sectionSubtitle.line2")}
                    </span>
                  </h2>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-12">
                  {t.raw("steps.items").map((step: any, index: number) => (
                    <div key={index} className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground text-3xl font-bold">
                        {`0${index + 1}`}
                      </div>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </PatternBg>

        {/* COMMUNITY */}
        <section id="community" className="py-24 md:py-32 relative">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <Badge variant="outline">{t("community.sectionTitle")}</Badge>

                  <h2 className="text-4xl sm:text-5xl font-bold">
                    {t("community.sectionSubtitle.line1")}
                    <br />
                    <span className="text-muted-foreground">
                      {t("community.sectionSubtitle.line2")}
                    </span>
                  </h2>

                  <p className="text-xl text-muted-foreground">
                    {t("community.description")}
                  </p>

                  <div className="space-y-4">
                    {t
                      .raw("community.bullets")
                      .map((bullet: string, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <span className="text-lg font-medium">{bullet}</span>
                        </div>
                      ))}
                  </div>

                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground"
                  >
                    {t("community.button")}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <BrowserMockup
                  src="/images/post-card-mobile-3.png"
                  alt="Community post card"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
