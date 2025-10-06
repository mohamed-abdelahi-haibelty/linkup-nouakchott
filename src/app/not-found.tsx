import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />

      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        <div className="space-y-6">
          <div className="text-[8rem] md:text-[12rem] font-bold leading-none bg-gradient-to-br from-primary/60 via-primary/40 to-accent/30 bg-clip-text text-transparent select-none drop-shadow-2xl">
            404
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground drop-shadow-sm">
              Page not found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              The event you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Link href="/events">
              <Calendar className="w-4 h-4 mr-2" />
              Browse Events
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
