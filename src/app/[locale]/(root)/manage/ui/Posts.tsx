import { getUserCommunityPosts } from "@/app/[locale]/actions/community/user/getUserCommunityPosts";
import { DataTable } from "@/components/shared/DataTable";

import { redirect } from "next/navigation";
import { postColumns } from "../postColumns";
import { CommunityPostWithUser } from "@/app/[locale]/admin/community/columns";

const communityPostStatuses = [
  {
    value: "approved",
    label: "Approved",
    className:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  {
    value: "pending",
    label: "Pending",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    value: "rejected",
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
];

async function Posts() {
  const result = await getUserCommunityPosts();

  if (!result.success) {
    if (result.code === 401) {
      redirect("/api/auth/login");
    }
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <DataTable<CommunityPostWithUser, any>
        data={result.data ?? []}
        columns={postColumns}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: communityPostStatuses,
          },
        ]}
        searchPlaceholder="Search posts..."
      />
    </div>
  );
}

export default Posts;
