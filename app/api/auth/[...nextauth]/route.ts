/**
 * NextAuth v5 route handler — mounts all auth endpoints:
 *   GET  /api/auth/session
 *   GET  /api/auth/signin
 *   GET  /api/auth/signout
 *   GET/POST /api/auth/callback/github
 *   etc.
 */
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
