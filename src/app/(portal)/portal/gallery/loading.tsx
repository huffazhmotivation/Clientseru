import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/ui";

export default function PortalGalleryLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={6} />
    </>
  );
}
