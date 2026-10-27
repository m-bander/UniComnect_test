import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "./uploadthing";

export const { uploadFiles } = genUploader<OurFileRouter>({
  url: import.meta.env.VITE_SERVER_URL,
});
