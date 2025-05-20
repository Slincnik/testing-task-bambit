// Форматирование дат и значений
export default function formatValue(value, type) {
  if (!value) return "";
  if (type === "datetime" || type === "date") {
    const d = new Date(value);

    if (isNaN(d)) {
      return value;
    }
    return new Intl.DateTimeFormat("ru", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(d);
  }
  return value;
}
