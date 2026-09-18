import { PageHeaderSkeleton, Skeleton } from "@/components/ui";

export default function SettingsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="glass max-w-lg rounded-2xl p-6">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-4 h-9 w-full rounded-lg" />
        <Skeleton className="mt-4 h-4 w-1/3" />
        <Skeleton className="mt-4 h-9 w-full rounded-lg" />
        <Skeleton className="mt-6 h-9 w-28 rounded-lg" />
      </div>
    </>
  );
}
