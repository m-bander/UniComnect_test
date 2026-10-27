import { RequestHandler } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { assignment, CoursesTable, enrolledIn, manages, message, submission, Teaches } from "../drizzle";
import { APIRequest } from "../types/api";
import { safePayload } from "../utils/safePayload";
import { verifyAuth } from "./verifyAuth";

export const sanitizeHostedResponse: RequestHandler = (_req, res, next) => {
  const original = res.json.bind(res);
  res.json = (body) => original(safePayload(body));
  next();
};

async function courseAccess(userId: string, courseCode: string, admin: boolean) {
  if (admin) return { member: true, teacher: true, manager: true };
  const [teacher, student, manager] = await Promise.all([
    db.query.Teaches.findFirst({where: and(eq(Teaches.userId,userId),eq(Teaches.courseCode,courseCode))}),
    db.query.enrolledIn.findFirst({where: and(eq(enrolledIn.userId,userId),eq(enrolledIn.courseCode,courseCode))}),
    db.query.manages.findFirst({where: and(eq(manages.userId,userId),eq(manages.courseCode,courseCode))})
  ]);
  return {member:!!(teacher||student||manager),teacher:!!teacher,manager:!!manager};
}

// This guard is opt-in for the internet-facing copy. The original local defect baseline remains reproducible.
export const hostedAccess: RequestHandler = (req: APIRequest, res, next) => {
  if (["/auth/login","/auth/refresh","/auth/logout","/health"].includes(req.path)) return next();
  if (req.path === "/users/register" || req.path.startsWith("/uploadthing")) {
    return res.status(403).json({message:"This public testing demo uses sample accounts; registration and external uploads are disabled."});
  }
  verifyAuth(req,res,async () => {
    try {
      if (!req.user) return res.status(401).json({message:"Sign in first."});
      const userId=req.user.userId, admin=req.user.role==="system_admin";
      const deny=()=>res.status(403).json({message:"You do not have permission for this record."});
      const courseMatch=req.path.match(/^\/courses\/([^/]+)(?:\/|$)/);
      if (courseMatch && courseMatch[1]!=="course-head") {
        const code=decodeURIComponent(courseMatch[1]);
        const access=await courseAccess(userId,code,admin);
        const enrolling=req.method==="POST" && /\/enrollments$/.test(req.path);
        if (!access.member && !enrolling) return deny();
        const submissionsMatch=req.path.match(/\/assignments\/([^/]+)\/submissions(?:\/([^/]+))?/);
        if (submissionsMatch) {
          const item=await db.query.assignment.findFirst({where:eq(assignment.id,submissionsMatch[1])});
          if (!item || item.course_id!==code) return deny();
          const id=submissionsMatch[2];
          if (id) {
            const record=await db.query.submission.findFirst({where:eq(submission.id,id)});
            if (!record || record.assignment_id!==item.id) return deny();
            if (!access.teacher && record.student_id!==userId) return deny();
            if (!access.teacher && req.method==="PATCH" &&
                ("grade" in (req.body||{}) || "feedback" in (req.body||{}))) return deny();
          } else if (req.method==="GET" && !access.teacher && req.query.userId!==userId) return deny();
        } else if (!["GET","HEAD"].includes(req.method) && !enrolling &&
                   !access.teacher && !access.manager && req.user.role!=="class_representative") return deny();
      }
      const chat=req.path.match(/^\/groups\/([^/]+)\/messages(?:\/([^/]+))?/);
      if (chat) {
        const course=await db.query.CoursesTable.findFirst({where:eq(CoursesTable.group_id,chat[1])});
        if (!course || !(await courseAccess(userId,course.code,admin)).member) return deny();
        if (req.method==="POST") req.body={...req.body,sender_id:userId};
        if (chat[2] && ["PATCH","DELETE"].includes(req.method)) {
          const record=await db.query.message.findFirst({where:eq(message.id,chat[2])});
          if (!record || record.group_id!==chat[1] || (!admin && record.sender_id!==userId)) return deny();
        }
      }
      next();
    } catch { res.status(400).json({message:"Invalid record request."}); }
  });
};
