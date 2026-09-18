import { PageHeaderSkeleton, CardGridSkeleton, Skeleton } from "@/components/ui";

export default function ClientsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <div className="mb-6 max-w-sm">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
      <CardGridSkeleton count={6} />
    </>
  );
}
