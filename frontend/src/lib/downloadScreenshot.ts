/**
 * Downloads the full-size screenshot from Cloudflare R2 to user's computer
 */
export async function downloadScreenshotFromR2(
  screenshotUrl: string,
  designName: string
): Promise<void> {
  try {
    // Fetch the image from Cloudflare
    const response = await fetch(screenshotUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch screenshot: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Create and automatically click download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${designName}-screenshot.jpg`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
}