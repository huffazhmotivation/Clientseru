import { PageHeaderSkeleton, TableRowsSkeleton } from "@/components/ui";

export default function HistoryLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <TableRowsSkeleton rows={8} />
    </>
  );
}
