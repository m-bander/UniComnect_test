import type { OurFileRouter } from "@/lib/uploadthing";
import { generateUploadDropzone } from "@uploadthing/react";

export const UploadDropZone = generateUploadDropzone<OurFileRouter>({
  url: import.meta.env.VITE_SERVER_URL,
});
