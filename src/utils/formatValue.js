const userLocale = navigator.languages
  ? navigator.languages[0]
  : navigator.language || navigator.userLanguage; // Определяем локаль пользователя (ru-RU, en-US и т.п)

const STAGE_SEMANTIC_NAMES = {
  P: "В работе",
  S: "Успешно",
  F: "Провалено",
};

// Форматирование дат и значений
export default function formatValue({ data, type, key, categories }) {
  if (!data) return "";
  if (type === "datetime" || type === "date") {
    const d = new Date(data);

    if (isNaN(d)) {
      return data;
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

  if (key === "STAGE_SEMANTIC_ID") {
    return STAGE_SEMANTIC_NAMES[data];
  }

  if (key === "CATEGORY_ID") {
    console.log(categories);
    return categories.find(({ id }) => id === Number(data))?.name || data;
  }

  return data;
}
