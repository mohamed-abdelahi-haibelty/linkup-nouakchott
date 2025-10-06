import { Compass, Ticket, User, Users } from "lucide-react";

function Footer() {
  return (
    <div
      className="fixed bottom-3 z-50 w-[90%] max-w-md 
           bg-card border rounded-2xl px-3 py-3 mx-auto left-0 right-0 sm:hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1 items-center">
          <Compass className="w-5 h-5" />
          <span className="text-[13px]">Discover</span>
        </div>
        <div className="flex flex-col gap-y-1 items-center">
          <Users className="w-5 h-5 " />
          <span className="text-[13px]">Community</span>
        </div>
        <div className="flex flex-col gap-y-1 items-center">
          <Ticket className="w-5 h-5 " />
          <span className="text-[13px]">My Events</span>
        </div>
        <div className="flex flex-col gap-y-1 items-center">
          <User className="w-5 h-5 " />
          <span className="text-[13px]">Profile</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
