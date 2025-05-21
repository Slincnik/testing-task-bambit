const userLocale = navigator.languages
  ? navigator.languages[0]
  : navigator.language || navigator.userLanguage; // Определяем локаль пользователя (ru-RU, en-US и т.п)

// Форматирование дат и значений
export default function formatValue(value, type) {
  if (!value) return "";
  if (type === "datetime" || type === "date") {
    const d = new Date(value);

    if (isNaN(d)) {
      return value;
    }
    return new Intl.DateTimeFormat(userLocale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(d);
  }

  if (type === "double") {
    const formatNumber = new Intl.NumberFormat(userLocale).format(data);
    return formatNumber;
  }

  return data;
}
