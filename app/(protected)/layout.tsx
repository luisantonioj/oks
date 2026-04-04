// app/(protected)/layout.tsx
// This layout is intentionally a pass-through.
// Each protected page (stakeholder, office, portal) manages its own
// full-width layout, sticky header, navigation, and footer independently.
// A shared wrapper here would conflict with those per-page layouts.

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}