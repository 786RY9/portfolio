/**
 * The login page has its own minimal layout — no auth check here,
 * that's handled in the page itself. This prevents redirect loops.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
