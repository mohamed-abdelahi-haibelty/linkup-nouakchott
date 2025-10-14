"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  Users,
  QrCode,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PatternBg from "@/components/shared/PatternBg";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

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
    <PatternBg>
      <div className="min-h-screen bg-background">
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all" />
                  <div className="relative w-9 h-9 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-lg">
                      L
                    </span>
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  LinkUp Nouakchott
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {["Features", "How it works", "Community"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign in
                </Button>
                <Button
                  size="sm"
                  className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  Get started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section
          ref={heroRef}
          className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
        >
          {/* Interactive gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_50%)]" />
            <div
              className="absolute inset-0 opacity-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary)/0.15), transparent 40%)`,
              }}
            />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
          </div>

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              {/* Hero content */}
              <div className="text-center mb-16 space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    Now live in Nouakchott
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Beta
                  </Badge>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance">
                  <span className="block text-foreground mb-2">
                    Events that bring
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    people together
                  </span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                  Discover, create, and manage events in Nouakchott. Digital
                  tickets, QR codes, and community—all in one beautiful
                  platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href={"/events"}>
                    <Button
                      size="lg"
                      className="text-base px-8 h-12 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
                    >
                      Explore events
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-12 border-2 bg-transparent"
                  >
                    Create an event
                  </Button>
                </div>

                {/* Social proof */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-primary/40"
                          style={{ zIndex: 5 - i }}
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        2,500+
                      </div>
                      <div className="text-muted-foreground">Active users</div>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">4.9/5</div>
                      <div className="text-muted-foreground">User rating</div>
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">500+</div>
                      <div className="text-muted-foreground">Events hosted</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="relative animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-08%20at%2012.13.31-NAL8Xfr8ddCcKxVLhjh2beTywxf5CJ.png"
                    alt="LinkUp Nouakchott Platform"
                    className="w-full h-auto relative z-10"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-6 -left-6 animate-float">
                  <div className="bg-card border border-border rounded-xl shadow-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Verified
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Official events
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="absolute -bottom-6 -right-6 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="bg-card border border-border rounded-xl shadow-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          QR Tickets
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Instant access
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <Badge variant="outline" className="text-sm">
                  Platform features
                </Badge>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                  Everything you need,
                  <br />
                  <span className="text-muted-foreground">
                    nothing you don't
                  </span>
                </h2>
              </div>

              <div className="space-y-32">
                {/* Feature 1 - Event Discovery (Full width with large image) */}
                <div className="relative">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="space-y-6 lg:pr-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                        <Calendar className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground">
                        Discover events you'll love
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        Browse curated events across sports, culture, tech, and
                        more. Smart filters and personalized recommendations
                        help you find exactly what you're looking for in
                        Nouakchott.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-4">
                        {[
                          "Sports",
                          "Culture",
                          "Tech",
                          "Food",
                          "Music",
                          "Art",
                        ].map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="text-sm px-4 py-1.5"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-08%20at%2012.13.31-NAL8Xfr8ddCcKxVLhjh2beTywxf5CJ.png"
                          alt="Event discovery interface"
                          className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature 2 - Digital Tickets & QR (Reversed layout) */}
                <div className="relative">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-2 space-y-6 lg:pl-8">
                      <div className="flex items-center gap-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
                          <Ticket className="w-8 h-8 text-white" />
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                          <QrCode className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground">
                        Digital tickets with unique QR codes
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        Instant delivery to your device. Every ticket includes a
                        secure, unique QR code for seamless entry. Eco-friendly,
                        always accessible, and impossible to lose.
                      </p>
                      <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="w-5 h-5" />
                            <span className="font-semibold">Paperless</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Eco-friendly digital delivery
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-purple-600">
                            <Shield className="w-5 h-5" />
                            <span className="font-semibold">Secure</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Unique QR verification
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:order-1 relative">
                      <div className="relative rounded-2xl bg-gradient-to-br from-green-500/10 via-purple-500/10 to-pink-500/10 p-12 border border-border">
                        <div className="bg-background rounded-xl shadow-2xl p-8 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-foreground">
                                Tech Innovation Conf
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Oct 15, 2025 • 3:00 PM
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-900 hover:bg-green-100">
                              <Check className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <div className="flex items-center justify-center py-8">
                            <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                              <QrCode className="w-32 h-32 text-purple-600" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">
                              Ticket ID
                            </p>
                            <p className="font-mono text-xs text-foreground">
                              TKT-2025-XY7K-9M3P
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature 3 - Organizer Tools (Full width with screenshot) */}
                <div className="relative">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="space-y-6 lg:pr-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground">
                        Built for organizers
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        Create and manage events in minutes. Track
                        registrations, monitor attendance, send updates, and
                        engage with your audience—all from one powerful
                        dashboard.
                      </p>
                      <div className="space-y-4 pt-4">
                        {[
                          "Create events in under 5 minutes",
                          "Real-time attendance tracking",
                          "Automated ticket distribution",
                          "Participant management tools",
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                              <Check className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-foreground font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-08%20at%2012.14.44-vwMjTWIVv9r7yZfk0QGImcsEiOn02h.png"
                          alt="Event creation dashboard"
                          className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature 4 - Community & Trust (Split with visual card) */}
                <div className="relative">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="lg:order-2 space-y-6 lg:pl-8">
                      <div className="flex items-center gap-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-foreground">
                        Community with transparency
                      </h3>
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        Share unofficial events and connect organically with
                        your local community. Clear verification badges ensure
                        everyone knows what's official and what's
                        community-driven.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-4">
                        <Badge className="bg-green-100 text-green-900 hover:bg-green-100 border-0 text-sm px-4 py-1.5">
                          <Check className="w-3 h-3 mr-1.5" />
                          Verified Events
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-sm px-4 py-1.5"
                        >
                          Unverified Community Posts
                        </Badge>
                      </div>
                    </div>
                    <div className="lg:order-1 relative">
                      <div className="space-y-4">
                        {/* Verified event card */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-2xl">
                              🎨
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-foreground">
                                  Art Exhibition
                                </h4>
                                <Badge className="bg-green-100 text-green-900 hover:bg-green-100 border-0 text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Official cultural event • Oct 20
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Community post card */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg flex items-center justify-center text-2xl">
                              ☕
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-foreground">
                                  Coffee Meetup
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  Unverified
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Community post • Tomorrow
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-24 md:py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <Badge variant="outline" className="text-sm">
                  Simple process
                </Badge>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                  Get started in
                  <br />
                  <span className="text-muted-foreground">
                    three simple steps
                  </span>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
                {/* Connection lines */}
                <div className="hidden md:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {[
                  {
                    number: "01",
                    title: "Browse events",
                    description:
                      "Explore events by category, date, or location. Use smart filters to find exactly what interests you.",
                    icon: Calendar,
                    gradient: "from-primary to-primary/80",
                  },
                  {
                    number: "02",
                    title: "Join instantly",
                    description:
                      "Register with one click and receive your digital ticket with a unique QR code immediately.",
                    icon: Ticket,
                    gradient: "from-primary/80 to-primary/60",
                  },
                  {
                    number: "03",
                    title: "Attend & enjoy",
                    description:
                      "Show your QR code at the entrance for seamless check-in and enjoy the experience.",
                    icon: QrCode,
                    gradient: "from-primary/60 to-primary/40",
                  },
                ].map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="text-center">
                      <div className="relative inline-flex mb-8">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.gradient} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                        />
                        <div
                          className={`relative w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}
                        >
                          <step.icon className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-border rounded-full flex items-center justify-center text-sm font-bold text-foreground">
                          {step.number}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Event Preview Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-20 space-y-4">
                <Badge variant="outline" className="text-sm">
                  Live platform
                </Badge>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
                  See it in action
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                  Join thousands discovering and creating amazing events
                </p>
              </div>

              {/* Event detail showcase */}
              <div className="mb-20">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-08%20at%2012.14.02-noN8RZHzWUX48H3v5vKM4CaI7xmcsT.png"
                      alt="Event detail page"
                      className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    emoji: "🏃",
                    title: "5K Charity Run",
                    category: "Sports",
                    color: "from-yellow-400 to-orange-500",
                    badge: "bg-yellow-100 text-yellow-900",
                  },
                  {
                    emoji: "🎨",
                    title: "Art Exhibition",
                    category: "Culture",
                    color: "from-blue-400 to-cyan-500",
                    badge: "bg-blue-100 text-blue-900",
                  },
                  {
                    emoji: "💻",
                    title: "Tech Meetup",
                    category: "Tech",
                    color: "from-purple-400 to-pink-500",
                    badge: "bg-purple-100 text-purple-900",
                  },
                ].map((event, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-border"
                  >
                    <div
                      className={`relative h-48 bg-gradient-to-br ${event.color} flex items-center justify-center`}
                    >
                      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {event.emoji}
                      </div>
                      <Badge
                        className={`absolute top-4 left-4 ${event.badge} hover:${event.badge} border-0 shadow-lg`}
                      >
                        {event.category}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-card-foreground">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Join us for an amazing experience in Nouakchott
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Oct {15 + index * 5}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {100 + index * 30}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 group bg-transparent"
                >
                  View all events
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section
          id="community"
          className="py-24 md:py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/5 to-background -z-10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <Badge variant="outline" className="mb-6">
                      Community feature
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
                      Your events,
                      <br />
                      <span className="text-muted-foreground">
                        your community
                      </span>
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Not an official organizer? Share informal gatherings,
                      meetups, and community events with transparent unverified
                      badges.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Post events without verification",
                      "Connect with like-minded people",
                      "Build your local community",
                      "Transparent badge system",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                          <Check className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="text-foreground font-medium text-lg">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/25"
                  >
                    Join the community
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-accent/20 to-accent/10 rounded-3xl blur-3xl" />
                  <Card className="relative p-8 bg-card/80 backdrop-blur-sm shadow-2xl border-border hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                        ☕
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-bold text-lg text-card-foreground">
                            Coffee Meetup
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            Unverified
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Posted by Sarah M. • 2 hours ago
                        </p>
                      </div>
                    </div>

                    <p className="text-foreground leading-relaxed mb-6">
                      Casual coffee meetup for freelancers and remote workers.
                      Let's connect, share experiences, and build our network!
                      ☕✨
                    </p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tomorrow, 10 AM
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        12 interested
                      </span>
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Café Central
                      </span>
                    </div>

                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                      I'm interested
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--primary))_100%)] opacity-50" />

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary-foreground text-balance leading-tight">
                Ready to discover your next event?
              </h2>
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty leading-relaxed">
                Join thousands already using LinkUp Nouakchott to discover,
                create, and manage amazing events
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 text-lg px-10 h-14 shadow-2xl group"
                >
                  Get started free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-10 h-14 bg-transparent backdrop-blur-sm"
                >
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border">
          <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              <div>
                <Link href="/" className="flex items-center gap-3 mb-6 group">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-lg">
                      L
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    LinkUp Nouakchott
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connecting people through amazing events in Nouakchott.
                </p>
              </div>

              {[
                {
                  title: "Platform",
                  links: [
                    "Discover events",
                    "Create event",
                    "Community",
                    "Pricing",
                  ],
                },
                {
                  title: "Company",
                  links: ["About us", "Contact", "Blog", "Careers"],
                },
                {
                  title: "Legal",
                  links: [
                    "Privacy policy",
                    "Terms of service",
                    "Cookie policy",
                  ],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-foreground mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                © 2025 LinkUp Nouakchott. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PatternBg>
  );
}
