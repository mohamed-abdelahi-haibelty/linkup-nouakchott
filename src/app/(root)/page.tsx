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
          className="relative mt-[-100px] pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden"
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
                {/* <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm">
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
                </div> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PatternBg>
  );
}
