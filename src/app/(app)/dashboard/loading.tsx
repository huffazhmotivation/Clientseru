import { PageHeaderSkeleton, StatCardsSkeleton, ChartsSkeleton, CardGridSkeleton } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <ChartsSkeleton />
      <div className="mb-4 mt-2 h-5 w-32 animate-pulse rounded-md bg-edge/10" />
      <CardGridSkeleton count={6} />
    </>
  );
}
