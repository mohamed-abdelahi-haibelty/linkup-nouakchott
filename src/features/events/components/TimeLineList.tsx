// function TimeLineList({ items }: Props) {
//   if (!items || items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-3 px-6">
//         <div className="relative mb-4">
//           <div
//             className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50"
//             style={{ boxShadow: "var(--shadow-md)" }}
//           >
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 blur-sm"></div>
//             <CalendarDays className="w-10 h-10 text-primary relative z-10" />
//           </div>
//           {/* Decorative elements */}
//           <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent/20 animate-pulse"></div>
//           <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-primary/30"></div>
//         </div>

//         <div className="text-center space-y-3 max-w-md">
//           <h3 className="text-xl font-bold text-foreground tracking-tight">
//             No schedule available
//           </h3>
//           <p className="text-sm text-muted-foreground leading-relaxed">
//             The event organizer hasn&apos;t added a schedule yet. Check back
//             later for updates and exciting program details.
//           </p>
//         </div>

//         <div className="mt-6 flex items-center gap-2 opacity-40">
//           <div className="w-8 h-px bg-gradient-to-r from-transparent to-border"></div>
//           <Calendar className="w-3 h-3 text-muted-foreground" />
//           <div className="w-8 h-px bg-gradient-to-l from-transparent to-border"></div>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="flex flex-col space-y-3 px-4 py-2">
//       {items?.map((item, index) => (
//         <TimelineItem key={index} {...item} />
//       ))}
//     </div>
//   );
// }

// export default TimeLineList;

function TimeLineList() {
  return <div>time line</div>;
}

export default TimeLineList;
