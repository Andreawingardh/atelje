interface ScreenshotDimensions {
    width: number;
    height: number;
}

interface ScreenshotResult {
    fullBlob: Blob;
    thumbnailBlob: Blob;
}

// Captures two screenshots: fullsize and thumbnail
export async function captureScreenshot(
    canvas: HTMLCanvasElement,
    fullSize: ScreenshotDimensions = { width: 1920, height: 1080 },
    thumbnailSize: ScreenshotDimensions = { width: 400, height: 300 }
): Promise<ScreenshotResult> {

    // Calculate canvas aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
  
    // Adjust target dimensions to match canvas aspect ratio
    const adjustedFullSize = {
        width: fullSize.width,
        height: Math.round(fullSize.width / canvasAspectRatio)
    };
  
    const adjustedThumbnailSize = {
        width: thumbnailSize.width,
        height: Math.round(thumbnailSize.width / canvasAspectRatio)
    };

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    
    const fullBlob = await rezizeImage(dataUrl, adjustedFullSize.width, adjustedFullSize.height);
    
    const thumbnailBlob = await rezizeImage(dataUrl, adjustedThumbnailSize.width, adjustedThumbnailSize.height);
  
  return { fullBlob, thumbnailBlob };
}

// Captures a single screenshot at specific dimensions
async function rezizeImage(
    dataUrl: string,
    targetWidth: number,
    targetHeight: number
): Promise<Blob> {
    return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the image (not the WebGL canvas)
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to blob
      tempCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.85
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0]?.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1] || '');
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}