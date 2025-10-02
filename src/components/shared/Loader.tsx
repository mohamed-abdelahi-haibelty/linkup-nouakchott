import React from "react";

const LoadingComponent = () => {
  return (
    <div
      className=" flex items-center justify-center"
      style={{ backgroundColor: "oklch(0.966 0.0053 106.4982)" }}
    >
      {/* Loading card */}
      <div className="   p-8 flex flex-col items-center space-y-6  w-full mx-4">
        {/* Spinner */}
        <div className="relative">
          <div
            className="w-10 h-10 border-3 rounded-full animate-spin"
            style={{
              borderColor: "oklch(0.9299 0.0053 106.503)",
              borderTopColor: "oklch(0.7938 0.1248 42.4248)",
            }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3
            className="font-semibold text-lg"
            style={{ color: "oklch(0.2781 0.0296 256.848)" }}
          >
            Loading Events
          </h3>
          <p
            className="text-sm opacity-70"
            style={{ color: "oklch(0.2781 0.0296 256.848)" }}
          >
            Finding amazing events near you
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "oklch(0.7938 0.1248 42.4248)",
              animationDelay: "0ms",
            }}
          ></div>
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "oklch(0.7149 0.0622 139.7513)",
              animationDelay: "150ms",
            }}
          ></div>
          <div
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "oklch(0.7938 0.1248 42.4248)",
              animationDelay: "300ms",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
