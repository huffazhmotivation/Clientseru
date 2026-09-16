"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "./ui";
import { send } from "@/lib/client-api";
import { useToast } from "./toast";

const OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "WORKING", label: "Dikerjakan" },
  { value: "REVISION", label: "Revisi" },
  { value: "DONE", label: "Selesai" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

export function StatusSelect({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const { push } = useToast();
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  async function onChange(next: string) {
    const previous = value;
    setValue(next);
    try {
      await send(`/api/requests/${requestId}`, "PATCH", { status: next });
      push({ kind: "success", title: "Status diperbarui" });
      startTransition(() => router.refresh());
    } catch (err) {
      setValue(previous);
      push({
        kind: "error",
        title: "Gagal mengubah status",
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }

  return (
    <div className="min-w-[150px]">
      <Select value={value} disabled={pending} onChange={(event) => onChange(event.target.value)}>
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
