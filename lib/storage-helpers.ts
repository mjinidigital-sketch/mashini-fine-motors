import { Id } from "@/convex/_generated/dataModel";

/**
 * Upload an image to Convex storage
 * @param file - The file to upload
 * @param generateUploadUrl - Function to generate upload URL
 * @param saveFileUrl - Function to save file URL
 * @returns The URL of the uploaded file
 */
export async function uploadImage(
    file: File,
    generateUploadUrl: () => Promise<string>,
    saveFileUrl: (storageId: Id<"_storage">) => Promise<string>
): Promise<string> {
    // Step 1: Get upload URL
    const uploadUrl = await generateUploadUrl();

    // Step 2: Upload the file
    const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
    });

    if (!response.ok) {
        throw new Error("Failed to upload file");
    }

    // Step 3: Get the storage ID from the response
    const { storageId } = await response.json();

    // Step 4: Save and get the URL
    const url = await saveFileUrl(storageId as Id<"_storage">);

    return url;
}

/**
 * Upload multiple images to Convex storage
 * @param files - Array of files to upload
 * @param generateUploadUrl - Function to generate upload URL
 * @param saveFileUrl - Function to save file URL
 * @returns Array of URLs of the uploaded files
 */
export async function uploadImages(
    files: File[],
    generateUploadUrl: () => Promise<string>,
    saveFileUrl: (storageId: Id<"_storage">) => Promise<string>
): Promise<string[]> {
    const uploadPromises = files.map((file) =>
        uploadImage(file, generateUploadUrl, saveFileUrl)
    );
    return Promise.all(uploadPromises);
}

/**
 * Generate a thumbnail from an image file
 * This is a client-side helper that creates a resized version
 * @param file - The original image file
 * @param maxWidth - Maximum width of the thumbnail (default: 300)
 * @param maxHeight - Maximum height of the thumbnail (default: 300)
 * @param quality - Image quality (0-1, default: 0.8)
 * @returns A Promise that resolves to a Blob of the thumbnail
 */
export async function generateThumbnail(
    file: File,
    maxWidth: number = 300,
    maxHeight: number = 300,
    quality: number = 0.8
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        img.onload = () => {
            // Calculate dimensions maintaining aspect ratio
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and resize
            ctx?.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Failed to generate thumbnail"));
                    }
                },
                file.type,
                quality
            );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Upload image with automatic thumbnail generation
 * @param file - The original image file
 * @param generateUploadUrl - Function to generate upload URL
 * @param saveFileUrl - Function to save file URL
 * @returns Object with original URL and thumbnail URL
 */
export async function uploadImageWithThumbnail(
    file: File,
    generateUploadUrl: () => Promise<string>,
    saveFileUrl: (storageId: Id<"_storage">) => Promise<string>
): Promise<{ originalUrl: string; thumbnailUrl: string }> {
    // Upload original image
    const originalUrl = await uploadImage(file, generateUploadUrl, saveFileUrl);

    // Generate thumbnail
    const thumbnailBlob = await generateThumbnail(file);
    const thumbnailFile = new File([thumbnailBlob], `thumb_${file.name}`, {
        type: file.type,
    });

    // Upload thumbnail
    const thumbnailUrl = await uploadImage(
        thumbnailFile,
        generateUploadUrl,
        saveFileUrl
    );

    return { originalUrl, thumbnailUrl };
}

/**
 * Validate image file type and size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 10)
 * @returns True if valid, throws error if invalid
 */
export function validateImageFile(
    file: File,
    maxSizeMB: number = 10
): boolean {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
    }

    if (file.size > maxSizeBytes) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit.`);
    }

    return true;
}

/**
 * Get a preview URL for a file (client-side)
 * @param file - The file to preview
 * @returns Object URL that should be revoked when no longer needed
 */
export function getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a preview URL to free memory
 * @param url - The URL to revoke
 */
export function revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
}
