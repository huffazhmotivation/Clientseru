import { PageHeaderSkeleton, TableRowsSkeleton } from "@/components/ui";

export default function PortalRequestsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <TableRowsSkeleton rows={6} />
    </>
  );
}
