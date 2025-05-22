const userLocale = navigator.languages
  ? navigator.languages[0]
  : navigator.language || navigator.userLanguage; // Определяем локаль пользователя (ru-RU, en-US и т.п)

const STAGE_SEMANTIC_NAMES = {
  P: "В работе",
  S: "Успешно",
  F: "Провалено",
};

export const dateFormatter = new Intl.DateTimeFormat(userLocale, {
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

export const numberFormatter = new Intl.NumberFormat(userLocale);

/**
 * Форматирует значение в зависимости от типа и ключа поля.
 * @param {Object} params - Параметры форматирования.
 * @param {unknown} params.data - Значение для форматирования.
 * @param {string} params.type - Тип поля (например, "datetime", "double").
 * @param {string} params.key - Ключ поля (например, "CATEGORY_ID").
 * @param {Object} params.categories - Объект типа КЛЮЧ-ЗНАЧЕНИЕ, где ключ ID категории.
 * @returns {string|*} Отформатированное значение или исходное, если форматирование не требуется.
 */
export default function formatValue({ data, type, key, categories }) {
  if (!data) return "";
  if (type === "datetime" || type === "date") {
    const d = new Date(data);

    if (isNaN(d)) {
      return data;
    }
    return dateFormatter.format(d);
  }

  if (type === "double") {
    return numberFormatter.format(data);
  }

  if (key === "STAGE_SEMANTIC_ID") {
    return STAGE_SEMANTIC_NAMES[data];
  }

  if (key === "CATEGORY_ID") {
    return categories[data]?.name || data;
  }

  return data;
}
