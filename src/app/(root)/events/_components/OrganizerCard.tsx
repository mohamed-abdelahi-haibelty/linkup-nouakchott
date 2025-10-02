import { Button } from "@/components/ui/button";
import { generateRandomAvatar } from "@/lib/utils";
import { Organizer } from "@/types";
import { Mail, Smartphone, User } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  organizer: Organizer;
  phone: string;
};

function OrganizerCard({ organizer, phone }: Props) {
  return (
    <div className="bg-card rounded-lg border shadow-xs p-4 sm:p-5 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-secondary/10 rounded-md">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
        <h2 className="font-semibold text-sm text-foreground">Organized by</h2>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <Image
            className="rounded-full aspect-square border-2 border-primary/20"
            width={56}
            height={56}
            src={organizer?.avatarUrl ?? generateRandomAvatar(organizer.id)}
            alt="Organizer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground mb-1">
            {organizer.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            Event Organizer • {organizer?.hostedEventsCount} events hosted
          </p>
          <div className="flex items-center gap-1 text-xs text-accent">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Verified Organizer</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3  rounded-md border">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-primary/10 rounded-full">
            <Mail className="w-3 h-3 text-accent" />
          </div>
          <span className="text-xs text-foreground">{organizer.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-1 bg-primary/10 rounded-full">
            <Smartphone className="w-3 h-3 text-accent" />
          </div>
          <span className="text-xs text-foreground">
            {phone ?? organizer.phoneNumber}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1 bg-accent text-xs h-9">
          <Mail className="w-3 h-3 mr-1" />
          Contact
        </Button>
      </div>
    </div>
  );
}

export default OrganizerCard;
