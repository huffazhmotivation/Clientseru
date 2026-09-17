"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui";

export function ClientFilter({
  clients,
  selected,
}: {
  clients: { id: string; company: string }[];
  selected?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("client", value);
    else params.delete("client");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <Select
      value={selected ?? ""}
      onChange={(event) => onChange(event.target.value)}
      className="max-w-[220px]"
    >
      <option value="">Semua client</option>
      {clients.map((client) => (
        <option key={client.id} value={client.id}>
          {client.company}
        </option>
      ))}
    </Select>
  );
}
