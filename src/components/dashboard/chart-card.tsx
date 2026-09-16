"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell as RCell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/cn";

export function ChartCard({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-line bg-surface p-5 shadow-card", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e7e9ee",
  boxShadow: "0 12px 32px -8px rgb(15 17 21 / 0.18)",
  fontSize: 12,
};

export function QuotaUsageBarChart({ data }: { data: { name: string; used: number; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9aa1ae" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9aa1ae" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f3f4f7" }} />
        <Bar dataKey="used" name="Terpakai" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {data.map((entry, index) => {
            const ratio = entry.total > 0 ? entry.used / entry.total : 0;
            const color = ratio >= 0.9 ? "#f43f5e" : ratio >= 0.7 ? "#f59e0b" : "#6f5cf0";
            return <RCell key={index} fill={color} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RequestsPerMonthChart({ data }: { data: { month: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9aa1ae" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9aa1ae" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#e7e9ee" }} />
        <Line
          type="monotone"
          dataKey="total"
          name="Request"
          stroke="#6f5cf0"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#6f5cf0", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WorkloadBarChart({ data }: { data: { name: string; active: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef0f4" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#9aa1ae" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#4b5563" }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f3f4f7" }} />
        <Bar dataKey="active" name="Request aktif" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
