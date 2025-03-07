import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/admin" className="font-bold">
            Admin
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <Link
              href="/admin/basic"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Basic
            </Link>
            <Link
              href="/admin/manage"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Manage
            </Link>
            <Link
              href="/admin/collections"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Collections
            </Link>
            <Link
              href="/admin/collections/manage"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Assign Collections
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              View Site
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
} 