"use client";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import {
  X,
  Loader2,
  AlertCircle,
  Upload,
  Image,
  ImageIcon,
} from "lucide-react";

interface FileUploadComponentProps {
  onImageChange?: (url: string | null) => void;
  endpoint: "eventImage";
  value: string | null;
}

function FileUploadComponent({
  onImageChange,
  endpoint,
  value,
}: FileUploadComponentProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(value);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveImage = () => {
    setImageUrl(null);
    setError(null);
    onImageChange?.(null);
  };

  if (imageUrl) {
    return (
      <div className="relative mt-2 border shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)] rounded-md overflow-hidden group">
        <img
          src={imageUrl}
          alt="Uploaded image"
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 p-2 bg-accent cursor-pointer shadow-[4px_4px_0px_0px_hsl(0_0%_0%_/_1)] rounded-full  hover:scale-95 transition-all "
          aria-label="Remove image"
          type="button"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`relative border-2  border-dashed mt-2  rounded-lg  hover:border-muted-foreground/75 transition-colors cursor-pointer ${
          error ? "border-red-400" : "border-muted-foreground/50 "
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
              <p className="text-sm text-muted-foreground">
                Uploading image...
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to $MB
              </p>

              <UploadButton
                appearance={{
                  button:
                    "bg-white border  mt-3 hover:opacity-90 hover:bg-muted-foreground/5 text-muted-foreground px-3 py-2.5 rounded-lg font-medium transition-opacity ut-ready:bg-[oklch(0.7938_0.1248_42.4248)] ut-uploading:bg-[oklch(0.7938_0.1248_42.4248)]/50",
                  container: "flex items-center justify-center",
                  allowedContent: "hidden",
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (isUploading)
                      return (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      );
                    if (ready)
                      return (
                        <span className="flex items-center text-xs gap-2 text-muted-foreground">
                          <Upload className="w-4 h-4" />
                          Choose File
                        </span>
                      );
                    return (
                      <span className="text-foreground">
                        "Getting ready..."
                      </span>
                    );
                  },
                }}
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setImageUrl(res[0].ufsUrl);
                    setIsUploading(false);
                    setError(null);
                    onImageChange?.(res[0].ufsUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  setError(error.message || "Failed to upload image");
                  setIsUploading(false);
                }}
                onUploadBegin={(name) => {
                  setIsUploading(true);
                  setError(null);
                  console.log("Uploading: ", name);
                }}
                endpoint={endpoint}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default FileUploadComponent;
