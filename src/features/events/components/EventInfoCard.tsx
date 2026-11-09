interface EventInfoCardProps {
  icon: React.ReactNode;
  label: string | number;
}

function EventInfoCard({ icon, label }: EventInfoCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-2.5 md:px-4 py-2 md:py-3 flex items-center gap-2">
      {icon}
      <span className="text-xs md:text-sm font-medium text-white">{label}</span>
    </div>
  );
}

export default EventInfoCard;
