import { supabaseServerClient } from "./supabase/server";

/**
 * Uploads an image to supabaseServerClient Storage.
 * @param imageFile - The image file to upload (from an <input> element).
 * @param fileName - The name to save the file as in the bucket.
 * @param bucketName - The name of the supabaseServerClient Storage bucket.
 * @returns The public URL of the uploaded image.
 */
export const uploadImageToStorage = async (
  imageFile: File,
  fileName: string,
  bucketName: string
): Promise<string> => {
  console.log(imageFile, fileName, bucketName); // Debugging line to check the values
  try {
    if (!imageFile) {
      throw new Error("No image file provided.");
    }

    if (!bucketName) {
      throw new Error("Bucket name is required.");
    }

    // Upload the file to supabaseServerClient Storage
    const { data, error } = await supabaseServerClient.storage
      .from(bucketName)
      .upload(fileName, imageFile, {
        contentType: imageFile.type, // Use the file's MIME type
        upsert: true, // Overwrite the file if it already exists
      });

    if (error) {
      throw new Error(error.message);
    }

    // Get the public URL of the uploaded image
    const publicUrlData = supabaseServerClient.storage
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
