const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (value: Date | string) => dateFormatter.format(new Date(value));
export const formatDateTime = (value: Date | string) => dateTimeFormatter.format(new Date(value));

export const formatSigned = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export const percent = (used: number, total: number) =>
  total <= 0 ? 0 : Math.min(100, Math.round((used / total) * 100));

/** "Hari ini" / "Kemarin" / formatted date — used to group activity timelines. */
export function relativeDayLabel(value: Date | string): string {
  const date = new Date(value);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = startOf(new Date());
  const target = startOf(date);
  const diffDays = Math.round((today - target) / 86_400_000);

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return formatDate(date);
}
