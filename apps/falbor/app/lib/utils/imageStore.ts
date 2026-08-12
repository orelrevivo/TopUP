export const FALBOR_DB_NAME = 'FalborGameImages';
export const FALBOR_STORE_NAME = 'images';

/**
 * Save an image to the store for a specific chat.
 */
export async function saveImageToStore(chatId: string, filePath: string, base64Data: string) {
  try {
    const res = await fetch(`/api/chat/${chatId}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath, base64Data })
    });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("Failed to save image to API", error);
    return false;
  }
}

/**
 * Get all images for a specific chat.
 */
export async function getImagesForChat(chatId: string): Promise<Array<{filePath: string, base64Data: string}>> {
  try {
    const res = await fetch(`/api/chat/${chatId}/images`);
    const data = await res.json();
    return data.images || [];
  } catch (error) {
    console.error("Failed to fetch images from API", error);
    return [];
  }
}


/**
 * Automatically removes the solid background from an image via Canvas.
 * It samples the top-left pixel to determine the background color.
 */
export function removeBackgroundFromBase64(base64Data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(base64Data); // Fallback
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Sample top-left corner as the background color
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];
      
      // We'll use a tolerance to remove near-matches (compression artifacts)
      const tolerance = 40; 
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate Euclidean distance from background color
        const distance = Math.sqrt(
          Math.pow(r - bgR, 2) + 
          Math.pow(g - bgG, 2) + 
          Math.pow(b - bgB, 2)
        );
        
        if (distance <= tolerance) {
          // Make pixel completely transparent
          data[i + 3] = 0; 
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      // Return new base64 (strip the data:image/png;base64, prefix)
      const dataUrl = canvas.toDataURL('image/png');
      const b64 = dataUrl.split(',')[1];
      resolve(b64 || base64Data);
    };
    img.onerror = () => reject(new Error("Failed to load image for background removal"));
    
    // Add prefix if missing
    if (!base64Data.startsWith('data:')) {
      img.src = `data:image/png;base64,${base64Data}`;
    } else {
      img.src = base64Data;
    }
  });
}
