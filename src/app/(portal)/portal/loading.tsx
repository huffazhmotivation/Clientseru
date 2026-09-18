import { PageHeaderSkeleton, StatCardsSkeleton, TableRowsSkeleton } from "@/components/ui";

export default function PortalHomeLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <TableRowsSkeleton rows={4} />
    </>
  );
}
