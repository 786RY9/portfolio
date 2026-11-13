// Route transition fade. CSS-only (see .page-fade in globals.css) so the
// server-rendered HTML is never stuck at opacity 0 when JavaScript is slow or off.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>
}
