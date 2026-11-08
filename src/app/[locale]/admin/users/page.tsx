import { DataTable } from "@/components/shared/DataTable";
import { getAllUsers } from "@/features/community/actions/user/getAllUsers";
import { getUserRole } from "@/features/users/actions/getUserRole";
import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { columns, UserWithCounts } from "@/features/admin/tables/users";

// Define the user roles for filtering
const userRoles = [
  {
    value: "admin",
    label: "Admin",
    className:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    value: "moderator",
    label: "Moderator",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    value: "user",
    label: "User",
    className:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400",
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  // Check if user is authenticated and is an admin
  const { user, success } = await getUserRole();
  const { locale } = await params;
  setRequestLocale(locale);

  if (!user || !success) {
    redirect("/api/auth/login");
  }

  // Only admins can access this page
  if (user.role !== "admin") {
    notFound();
  }

  // Fetch all users
  const usersData = await getAllUsers();

  if (!usersData.success || !usersData.data) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Failed to load users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      <DataTable<UserWithCounts>
        data={usersData.data}
        columns={columns}
        filters={[
          {
            columnId: "role",
            title: "Role",
            options: userRoles,
          },
        ]}
        searchColumns={["name"]}
        searchPlaceholder="Search users..."
      />
    </div>
  );
}

export default page;
