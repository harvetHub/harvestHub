import { supabaseServer } from "@/utils/supabase/server";

/**
 * Uploads an image blob file to a Supabase bucket and returns the public URL.
 * @param imageBlob - The image blob file to upload.
 * @param fileName - The name to save the file as in the bucket.
 * @param bucketName - The name of the Supabase storage bucket.
 * @returns The public URL of the uploaded image.
 * @throws Error if the upload or URL generation fails.
 */
export async function uploadImageToStorage(
  imageBlob: Blob,
  fileName: string,
  bucketName: string
): Promise<string> {
  try {
    // Validate inputs
    if (!imageBlob) {
      throw new Error("No image blob provided.");
    }
    if (!bucketName) {
      throw new Error("Bucket name is required.");
    }

    // Upload the image to the Supabase bucket
    const { data, error } = await supabaseServer.storage
      .from(bucketName)
      .upload(fileName, imageBlob, {
        contentType: imageBlob.type,
        upsert: true, // Overwrite if the file already exists
      });

    if (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }

    // Generate a public URL for the uploaded image
    const { data: publicUrlData } = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new Error("Failed to retrieve the public URL.");
    }

    return publicUrlData.publicUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
}
