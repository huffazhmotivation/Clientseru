import { PageHeaderSkeleton, StatCardsSkeleton, TableRowsSkeleton } from "@/components/ui";

export default function ClientDetailLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <TableRowsSkeleton rows={5} />
    </>
  );
}
