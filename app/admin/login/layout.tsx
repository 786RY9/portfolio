/**
 * Login page gets its own layout that renders ONLY the children,
 * without the admin sidebar (which would look wrong on the login screen).
 *
 * In Next.js App Router, more-specific layouts override parent layouts
 * for their segment, so this prevents the admin sidebar from showing
 * on the /admin/login page.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
