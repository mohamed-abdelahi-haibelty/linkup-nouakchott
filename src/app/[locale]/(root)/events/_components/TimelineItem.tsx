// import { formatTime } from "@/lib/utils";
// import { TimelineItem as Props } from "@prisma/client";
// import { Clock } from "lucide-react";
// import React from "react";

// function TimelineItem(item: Props) {
//   return (
//     <div className="relative pl-6 border-l-2 border-primary">
//       <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-full bg-primary"></div>
//       <div className="flex flex-col bg-card border shadow-sm rounded-lg p-3">
//         <div className="flex justify-between items-center">
//           <h3 className="text-sm font-semibold">{item?.title}</h3>
//           <div className="flex items-center gap-x-1 text-muted-foreground text-xs">
//             <Clock className="w-3.5 h-3.5" />
//             <span>
//               {formatTime(item?.startTime)} - {formatTime(item?.endTime)}
//             </span>
//           </div>
//         </div>
//         <p className="text-xs text-muted-foreground mt-1">
//           {item?.description}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default TimelineItem;
