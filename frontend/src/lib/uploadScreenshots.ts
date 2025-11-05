import { DesignService } from "@/api/generated";

interface ScreenshotUploadResult {
  screenshotUrl: string;
  thumbnailUrl: string;
}

/**
 * Uploads screenshots to Cloudflare R2 and returns public URLs
 */
export async function uploadScreenshotsToR2(
  designId: number,
  fullBlob: Blob,
  thumbnailBlob: Blob
): Promise<ScreenshotUploadResult> {
  
  // Generate unique filenames
  const timestamp = Date.now();
  const fullFileName = `design-${designId}-${timestamp}-full.jpg`;
  const thumbnailFileName = `design-${designId}-${timestamp}-thumb.jpg`;
  
  // Request presigned URLs from backend
  const urlResponse = await DesignService.getScreenshotUploadUrls({
    fullFileName,
    thumbnailFileName
  });

  if (!urlResponse.fullSizeUploadUrl || !urlResponse.thumbnailUploadUrl || 
      !urlResponse.fullSizePublicUrl || !urlResponse.thumbnailPublicUrl) {
    throw new Error('Invalid presigned URL response from server');
  }
  
  // Upload fullsize and thumbnail screenshot to Cloudflare
  const fullUploadResponse = await fetch(urlResponse.fullSizeUploadUrl, {
    method: 'PUT',
    body: fullBlob,
    headers: {
      'Content-Type': 'image/jpeg'
    }
  });
  
  if (!fullUploadResponse.ok) {
    throw new Error(`Full screenshot upload failed: ${fullUploadResponse.status}`);
  }
  
  const thumbnailUploadResponse = await fetch(urlResponse.thumbnailUploadUrl, {
    method: 'PUT',
    body: thumbnailBlob,
    headers: {
      'Content-Type': 'image/jpeg'
    }
  });
  
  if (!thumbnailUploadResponse.ok) {
    throw new Error(`Thumbnail upload failed: ${thumbnailUploadResponse.status}`);
  }
  
  // Return the public URLs
  return {
    screenshotUrl: urlResponse.fullSizePublicUrl,
    thumbnailUrl: urlResponse.thumbnailPublicUrl
  };
}