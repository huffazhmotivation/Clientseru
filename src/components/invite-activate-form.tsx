"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function InviteActivateForm({
  token,
}: {
  token: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/invite/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Terjadi kesalahan");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="w-full max-w-md space-y-5">
      <div>
        <h1 className="text-2xl font-bold">
          Buat Password
        </h1>

        <p className="text-sm text-gray-500">
          Aktifkan akun client kamu.
        </p>
      </div>


      <input
        type="password"
        placeholder="Password baru"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-lg px-4 py-3"
      />


      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}


      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-black text-white py-3"
      >
        {loading ? "Memproses..." : "Aktifkan Akun"}
      </button>
    </div>
  );
}