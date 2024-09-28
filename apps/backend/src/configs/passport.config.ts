import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { db } from "@repo/db";
import * as z from "zod";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar: string;
}
const userSchema = z.object({
  email: z.string(),
  name: z.string(),
  avatar: z.string(),
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const parsedData = userSchema.safeParse({
        name: profile.displayName,
        email: profile.emails?.[0]?.value ?? "",
        avatar: profile.photos?.[0]?.value ?? "",
      });

      if (parsedData.error) {
        return cb(parsedData.error);
      }
      const finalData = parsedData.data;

      return cb(null, finalData);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});
