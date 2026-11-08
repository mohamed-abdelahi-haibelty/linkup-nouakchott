import { DataTable } from "@/components/shared/DataTable";
import { getUserCommunityPosts } from "@/features/community/actions/user/getUserCommunityPosts";

import { postColumns } from "@/features/manage/tables/posts";
import { CommunityPostWithUser } from "@/features/admin/tables/community";
import { redirect } from "next/navigation";

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
      <DataTable<CommunityPostWithUser>
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
