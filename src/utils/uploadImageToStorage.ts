import { supabaseServer } from "./supabase/server";

/**
 * Uploads an image to supabaseServer Storage.
 * Converts the image to JPEG format before uploading.
 * @param imageFile - The image file to upload (from an <input> element).
 * @param fileName - The name to save the file as in the bucket.
 * @param bucketName - The name of the supabaseServer Storage bucket.
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

    // Check if the file size is greater than 0 and within a reasonable limit (e.g., 5MB)
    const maxFileSize = 1 * 1024 * 1024; // 5MB
    if (imageFile.size === 0) {
      throw new Error("File is empty.");
    }
    if (imageFile.size > maxFileSize) {
      throw new Error("File size exceeds the 1MB limit.");
    }

    if (!bucketName) {
      throw new Error("Bucket name is required.");
    }

    // Convert the image to JPEG format
    const jpegFile = await convertToJpeg(imageFile);

    // Update the file name to have a .jpg extension
    const jpegFileName = fileName.replace(/\.[^/.]+$/, ".jpg");

    // Upload the file to supabaseServer Storage
    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(jpegFileName, jpegFile, {
        contentType: "image/jpeg", // Set the MIME type to JPEG
        upsert: true, // Overwrite the file if it already exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get the public URL of the uploaded image
    const publicUrlData = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData.data || !publicUrlData.data.publicUrl) {
      throw new Error("Failed to retrieve the public URL.");
    }

    return publicUrlData.data.publicUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Converts an image file to JPEG format using a canvas.
 * @param imageFile - The original image file.
 * @returns A Blob containing the JPEG image data.
 */
const convertToJpeg = async (imageFile: File): Promise<Blob> => {
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

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert the canvas content to a JPEG Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to convert image to JPEG."));
            }
          },
          "image/jpeg",
          0.9 // Quality (0.0 to 1.0)
        );
      };
      img.onerror = () => reject(new Error("Failed to load image."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(imageFile);
  });
};
