// Locale-independent formatting. Browsers and Node format en-IN currency and dates slightly
// differently (e.g. "Sep" vs "Sept"), which breaks hydration of server-rendered client
// components; these helpers produce the same text everywhere.

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const IST_OFFSET_MS = 330 * 60 * 1000;

/** Whole rupees with Indian digit grouping, e.g. ₹3,63,024. */
export function formatInr(amount: number) {
  const rounded = Math.round(amount);
  const digits = String(Math.abs(rounded));
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rounded < 0 ? "-" : ""}₹${rest ? `${rest},` : ""}${lastThree}`;
}

/** Calendar date in India (IST), e.g. "4 Oct 2026" or "4 October 2026". */
export function formatIstDate(value: string | Date, month: "short" | "long" = "short") {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const names = month === "long" ? MONTHS_LONG : MONTHS_SHORT;
  return `${ist.getUTCDate()} ${names[ist.getUTCMonth()]} ${ist.getUTCFullYear()}`;
}
