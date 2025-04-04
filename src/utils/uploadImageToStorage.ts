import { supabaseServer } from "./supabase/server";

/**
 * Uploads an image to Supabase Storage.
 * Resizes the image to ensure it is 300KB or less before uploading.
 * @param imageFile - The image file to upload (from an <input> element).
 * @param fileName - The name to save the file as in the bucket.
 * @param bucketName - The name of the Supabase Storage bucket.
 * @returns The public URL of the uploaded image.
 */
export const uploadImageToStorage = async (
  imageFile: File,
  fileName: string,
  bucketName: string
): Promise<string> => {
  console.log("Original File:", imageFile, fileName, bucketName);

  try {
    // Validate the image file
    if (!imageFile) {
      throw new Error("No image file provided.");
    }

    // Check if the file is an image
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validMimeTypes.includes(imageFile.type)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
      );
    }

    if (!bucketName) {
      throw new Error("Bucket name is required.");
    }

    // Resize the image to ensure it is 300KB or less
    const resizedImage = await resizeImage(imageFile, 300 * 1024); // 300KB

    // Upload the resized image to Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(fileName, resizedImage, {
        contentType: imageFile.type, // Use the file's original MIME type
        upsert: true, // Overwrite the file if it already exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to retrieve the public URL.");
    }

    return publicUrlData.publicUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Resizes an image to ensure it is within the specified size limit.
 * @param imageFile - The original image file.
 * @param maxSize - The maximum size in bytes (e.g., 300KB).
 * @returns A Blob containing the resized image data.
 */
const resizeImage = (imageFile: File, maxSize: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Failed to create canvas context."));
        }

        let width = img.width;
        let height = img.height;

        // Scale down the image dimensions proportionally
        const scaleFactor = Math.sqrt(maxSize / imageFile.size);
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to a Blob
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size <= maxSize) {
              resolve(blob);
            } else {
              reject(new Error("Failed to resize image to the desired size."));
            }
          },
          imageFile.type,
          0.8 // Adjust quality (0.0 to 1.0) for further compression if needed
        );
      };
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(imageFile);
  });
};
