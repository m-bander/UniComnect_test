import jwt, { TokenExpiredError } from "jsonwebtoken";
import { RequestHandler } from "express";
import "dotenv/config";
import { AccessTokenPayload, APIRequest } from "../types/api";

export const verifyAuth: RequestHandler = (
  req: APIRequest<unknown>,
  res,
  next
) => {
  if (!req.cookies?.jwt)
    return res.status(401).json({ message: "Missing cookies." });

  const authHeader =
    req.headers["authorization"] || (req.headers["Authorization"] as string);
  if (!authHeader) return res.sendStatus(403);

  const [type, token] = authHeader.split(" ");

  if (type != "Bearer") return res.sendStatus(403);

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError)
      return res.status(403).json({ message: "Expired access token." });

    res.sendStatus(process.env.UNICONNECT_PUBLIC_HOST === "1" ? 401 : 500);
  }
};
