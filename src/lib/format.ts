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
