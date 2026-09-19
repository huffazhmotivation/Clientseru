"use client";

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

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(14,16,32,0.92)",
  boxShadow: "0 16px 40px -10px rgb(0 0 0 / 0.55)",
  fontSize: 12,
  color: "#f4f5fb",
};

const gridStroke = "rgba(255,255,255,0.08)";
const tickFill = "#8a91ad";
const cursorFill = "rgba(255,255,255,0.06)";

export function QuotaUsageBarChart({ data }: { data: { name: string; used: number; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} width={28} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
        <Bar dataKey="used" name="Terpakai" radius={[6, 6, 0, 0]} maxBarSize={28} isAnimationActive={false}>
          {data.map((entry, index) => {
            const ratio = entry.total > 0 ? entry.used / entry.total : 0;
            const color = ratio >= 0.9 ? "#f2478e" : ratio >= 0.7 ? "#f0a71f" : "#8f5cff";
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
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
        <Line
          type="monotone"
          dataKey="total"
          name="Request"
          stroke="#22b8f2"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#22b8f2", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WorkloadBarChart({ data }: { data: { name: string; active: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
        <XAxis type="number" tick={{ fontSize: 11, fill: tickFill }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: tickFill }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: cursorFill }} />
        <Bar dataKey="active" name="Request aktif" fill="#7c3aed" radius={[0, 6, 6, 0]} maxBarSize={18} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
