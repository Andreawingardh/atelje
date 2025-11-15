"use client";

import { useState } from "react";
import Image from "next/image";
import { downloadScreenshotFromR2 } from "@/lib/downloadScreenshot";
import CircleButton from "../CircleButton/CircleButton";

interface DownloadScreenshotButtonProps {
  screenshotUrl?: string | null;
  designName: string;
  disabled?: boolean;
  className?: string;
  size?: number;
}

export function DownloadScreenshotButton({
  screenshotUrl,
  designName,
  disabled = false,
  className,
  size = 30, // Icon size
}: DownloadScreenshotButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Disable if there are no screenshot URL or it's explicitly disabled
  const isDisabled = disabled || !screenshotUrl || isDownloading;

  async function handleDownload() {
    if (!screenshotUrl) return;

    setIsDownloading(true);
    setError(null);

    try {
      await downloadScreenshotFromR2(screenshotUrl, designName);
    } catch (err) {
      setError("Download failed");
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div>
      <CircleButton
        variant="vanilla"
        buttonIcon="/icons/download-icon.svg"
        onClick={handleDownload}
        disabled={isDisabled}
        title={
          !screenshotUrl
            ? "Save the design to enable screenshot download"
            : isDownloading
            ? "Downloading..."
            : "Download screenshot"
        }
        className={className}
      />
      {error && <span style={{ color: "red", fontSize: "12px" }}>{error}</span>}
    </div>
  );
}