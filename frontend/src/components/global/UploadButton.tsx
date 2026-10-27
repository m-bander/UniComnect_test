import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

// import "@uploadthing/react/styles.css";

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: import.meta.env.VITE_SERVER_URL,
});
