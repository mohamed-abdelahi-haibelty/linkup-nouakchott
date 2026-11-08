import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

function DotsLoader({ className }: Props) {
  return (
    <div className={cn("flex items-center justify-center my-8", className)}>
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 rounded-full bg-[oklch(0.7938_0.1248_42.4248)] animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[oklch(0.7149,0.0622,139.7513)] animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-[oklch(0.7938,0.1248,42.4248)] animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}

export default DotsLoader;
