import { PageHeaderSkeleton, TableRowsSkeleton } from "@/components/ui";

export default function RequestsLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <TableRowsSkeleton rows={7} />
    </>
  );
}
