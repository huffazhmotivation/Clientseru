import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { getClientOverview } from "@/lib/quota";
import { Card, PageHeader } from "@/components/ui";
import { RequestForm } from "@/components/request-form";

export const dynamic = "force-dynamic";

export default async function NewRequestPage() {
  const session = await requireClient();
  const overview = await getClientOverview(session.clientId);
  if (!overview) notFound();

  return (
    <>
      <PageHeader title="Request desain baru" description="Isi detail desain yang Anda butuhkan. Tim designer akan segera menindaklanjuti." />
      <Card className="max-w-2xl">
        <RequestForm remaining={overview.remaining} />
      </Card>
    </>
  );
}
