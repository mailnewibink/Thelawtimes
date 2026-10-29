import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session and authorization
  const user = await getCurrentAdminUser();

  // If unauthorized or no session, redirect to login page
  if (!user) {
    redirect("/admin/login");
  }

  // Prevent standard 'reader' role from accessing CMS
  if (user.role === "reader") {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      {/* Desktop Sidebar */}
      <AdminSidebar
        userRole={user.role}
        className="hidden md:flex h-screen sticky top-0 shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
