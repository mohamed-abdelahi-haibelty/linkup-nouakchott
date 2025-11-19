import { DataTable } from "@/components/shared/DataTable";
import { columns, CommunityPostWithUser } from "./columns";
import { getAllCommunityPosts } from "@/app/[locale]/actions/community/admin/getAllCommunityPosts";
import { deleteManyCommunityPosts } from "@/app/[locale]/actions/community/admin/deleteManyCommunityPosts";
import { getUserRole } from "@/app/[locale]/actions/user/getUserRole";
import { redirect } from "next/navigation";
import NotFound from "@/app/[locale]/not-found";
import { setRequestLocale } from "next-intl/server";

// Define the community post statuses
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

// Define community post categories/tags (matching your EventTag enum)
const communityCategories = [
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "education", label: "Education" },
  { value: "tech", label: "Tech" },
  { value: "business", label: "Business" },
  { value: "art", label: "Art" },
  { value: "food", label: "Food" },
  { value: "culture", label: "Culture" },
  { value: "charity", label: "Charity" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "community", label: "Community" },
];

type Props = {
  params: Promise<{ locale: string }>;
};

async function page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { user, success, code } = await getUserRole();
  if (!user || !success) redirect("/api/auth/login");
  if (user.role !== "admin" && user.role !== "moderator") return NotFound();
  const posts = await getAllCommunityPosts();

  return (
    <div className="">
      <DataTable<CommunityPostWithUser, any>
        data={posts.data ?? []}
        columns={columns}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: communityPostStatuses,
          },
          {
            columnId: "tag",
            title: "Category",
            options: communityCategories,
          },
        ]}
        deleteAction={deleteManyCommunityPosts}
        deleteConfirmTitle="Delete selected community posts"
      />
    </div>
  );
}

export default page;
