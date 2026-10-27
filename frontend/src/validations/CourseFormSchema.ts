import { YEARS } from "@/constants/student/student";
import z from "zod";

const CourseFormSchema = z.object({
  image_url: z.url().optional(),
  code: z.string().nonempty("Course code is required."),
  name: z.string().nonempty("Course name is required."),
  year: z.enum(YEARS),
});

type ICourseFormSchema = z.infer<typeof CourseFormSchema>;

export { CourseFormSchema, type ICourseFormSchema };
