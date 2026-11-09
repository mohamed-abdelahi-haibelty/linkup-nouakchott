import { Button } from "@/components/ui/button";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

export default function AuthenticationError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">
        We couldn’t finish signing you in
      </h1>
      <p className="text-muted-foreground">
        Please try again. If this continues, contact the event organizer.
      </p>
      <Button asChild>
        <LoginLink>Try signing in again</LoginLink>
      </Button>
    </main>
  );
}
