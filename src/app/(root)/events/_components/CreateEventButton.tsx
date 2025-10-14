"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { Button } from "@/components/ui/button";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogIn, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
function CreateEventButton() {
  const { isAuthenticated } = useKindeBrowserClient();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleAcessCheck() {
    if (isAuthenticated) {
      router.push("/events/create");
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <Button
        className=" md:hidden bg-accent hover:shadow-xl transition-all duration-300 gap-2 font-semibold"
        size="default"
        onClick={handleAcessCheck}
      >
        <Plus className="h-4 w-4" />
        Create
      </Button>

      <ActionTooltip label="Create an Event">
        <Button
          onClick={handleAcessCheck}
          className="bg-white border hidden md:block rounded-sm   shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)]"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </ActionTooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to log in or sign up to create an event.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button asChild>
              <LoginLink postLoginRedirectURL="/events/create">
                <LogIn />
                Login
              </LoginLink>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateEventButton;
