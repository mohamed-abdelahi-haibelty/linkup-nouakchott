import React from "react";
import { SectionCards } from "./ui/SectionCards";
import StatCard from "./ui/StatCard";

function page() {
  return (
    <div className="container mx-auto">
      <div className="py-4  md:py-6">
        <SectionCards />
      </div>
    </div>
  );
}

export default page;
