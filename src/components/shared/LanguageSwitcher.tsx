import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CheckIcon, GlobeIcon, XIcon } from "lucide-react";
import React from "react";

function LanguageSwitcher() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="flex items-center rounded-full border border-primary p-2">
          <GlobeIcon className="h-4 w-4" />
          {/* <span>EN</span>
          <ChevronDownIcon className="h-4 w-4" /> */}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="grid gap-4 p-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium">
              Select Language
            </DialogTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <XIcon className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
          <div className="grid gap-2">
            <Button variant="ghost" className="justify-start gap-2">
              <GlobeIcon className="h-5 w-5" />
              <span>English</span>
              <CheckIcon className="h-5 w-5 ml-auto" />
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <GlobeIcon className="h-5 w-5" />
              <span>Arabic</span>
            </Button>
            <Button variant="ghost" className="justify-start gap-2">
              <GlobeIcon className="h-5 w-5" />
              <span>Français</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default LanguageSwitcher;
