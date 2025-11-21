export default function BrowserMockup({
  src,
  alt,
  url = "linkupnouakchott/events",
}: {
  src: string;
  alt: string;
  url?: string;
}) {
  return (
    <div className="relative w-full mx-auto">
      <div className="rounded-xl border   bg-background shadow-2xl overflow-hidden">
        {/* Top Browser Bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111827] backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="w-3 h-3 bg-green-500 rounded-full" />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 text-sm bg-[#1c2333] rounded-md text-gray-400 border border-white/5">
              {url}
            </div>
          </div>

          <div className="w-8" />
        </div>

        {/* Screenshot */}
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[70vh] object-contain"
        />
      </div>
    </div>
  );
}
