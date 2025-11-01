/**
 * Upload file (image or video) directly to Cloudinary from frontend.
 * Requires: an unsigned upload preset in your Cloudinary settings.
 */

export async function uploadToCloudinary(file: File, kind: "image" | "video" = "image"): Promise<{ url: string; kind: "image" | "video" }> {
    if (!file) throw new Error("No file selected");
  
    const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    // const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  
    // Xác định loại file (image/video)
    // const kind: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
  
    // Chuẩn bị form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "usitech");
  
    // Gửi request trực tiếp đến Cloudinary
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${kind}/upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }
  
    return {
      url: data.url,
      kind,
    };
  }