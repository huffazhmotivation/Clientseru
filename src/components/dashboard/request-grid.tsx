"use client";

import { useState } from "react";
import { RequestCard } from "./request-card";
import { RequestDetailDialog, type RequestDetailData } from "./request-detail-dialog";

export function RequestGrid({
  requests,
  role,
  personLabel,
  personName,
  className = "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
}: {
  requests: RequestDetailData[];
  role: "DESIGNER" | "CLIENT";
  personLabel?: string;
  personName?: string;
  className?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = requests.find((r) => r.id === selectedId) ?? null;

  return (
    <>
      <div className={className}>
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={{ ...request, deliverablesCount: request.deliverables.length }}
            personLabel={personLabel}
            personName={personName}
            onClick={() => setSelectedId(request.id)}
          />
        ))}
      </div>

      <RequestDetailDialog
        key={selected?.id ?? "none"}
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        request={selected}
        role={role}
        personLabel={personLabel}
        personName={personName}
      />
    </>
  );
}
