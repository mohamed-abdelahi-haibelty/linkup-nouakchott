import React from "react";
import ParticipantsList from "./ParticipantsList";
import { ParticipantWithUserAndCount } from "@/types";

type Props = {
  users: ParticipantWithUserAndCount[];
};

function ParticipantsSection({ users }: Props) {
  return (
    <div className=" bg-card/80 border-border/70 backdrop-blur-sm p-4  rounded-lg border flex flex-col md:min-h-110 max-h-[calc(100vh-260px)]">
      <h2 className="text-lg font-semibold mb-2">Participants</h2>
      <div className="overflow-y-auto flex-1 min-h-0 ">
        <ParticipantsList users={users} />
      </div>
    </div>
  );
}

export default ParticipantsSection;
