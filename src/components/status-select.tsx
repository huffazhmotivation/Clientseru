"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "./ui";
import { send } from "@/lib/client-api";

const OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "WORKING", label: "Dikerjakan" },
  { value: "REVISION", label: "Revisi" },
  { value: "DONE", label: "Selesai" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

export function StatusSelect({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onChange(next: string) {
    const previous = value;
    setValue(next);
    setError(null);
    try {
      await send(`/api/requests/${requestId}`, "PATCH", { status: next });
      startTransition(() => router.refresh());
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Gagal mengubah status");
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
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
