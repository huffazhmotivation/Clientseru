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
    <div className={cn("rounded-xl glass p-5 shadow-card", className)}>
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
  border: "1px solid #e1ddca",
  boxShadow: "0 12px 32px -8px rgb(15 17 21 / 0.18)",
  fontSize: 12,
};

export function QuotaUsageBarChart({ data }: { data: { name: string; used: number; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae6d6" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9a9c8b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9a9c8b" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ece7d6" }} />
        <Bar dataKey="used" name="Terpakai" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {data.map((entry, index) => {
            const ratio = entry.total > 0 ? entry.used / entry.total : 0;
            const color = ratio >= 0.9 ? "#b05a45" : ratio >= 0.7 ? "#bd7038" : "#5f8247";
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eae6d6" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9a9c8b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9a9c8b" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#e1ddca" }} />
        <Line
          type="monotone"
          dataKey="total"
          name="Request"
          stroke="#5f8247"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#5f8247", strokeWidth: 0 }}
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
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eae6d6" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#9a9c8b" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#6c6f61" }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#ece7d6" }} />
        <Bar dataKey="active" name="Request aktif" fill="#4c7c80" radius={[0, 6, 6, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
