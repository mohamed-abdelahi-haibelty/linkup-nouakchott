import { ParticipantWithUserAndCount } from "@/types";
import ParticipantItem from "./ParticipantItem";
import { UserPlus, Users } from "lucide-react";

type Props = {
  users: ParticipantWithUserAndCount[];
};

function ParticipantsList({ users }: Props) {
  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-3 px-6">
        <div className="relative mb-4">
          <div
            className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 blur-sm"></div>
            <Users className="w-10 h-10 text-primary relative z-10" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent/20 animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-primary/30"></div>
        </div>

        <div className="text-center space-y-3 max-w-md">
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            No participants yet
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Be the first to join this amazing event! Registration is open and
            we're excited to see who will be part of this experience.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 opacity-40">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-border"></div>
          <UserPlus className="w-3 h-3 text-muted-foreground" />
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-border"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-1.5 grid grid-cols-1 md:grid-cols-2 items-start gap-2">
      {users.map((user) => (
        <ParticipantItem key={user.id} {...user} />
      ))}
    </div>
  );
}

export default ParticipantsList;
