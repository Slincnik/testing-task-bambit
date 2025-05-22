import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { useApi } from "../composables/useApi.js";
import {
  FIELD_KEYS,
  FIELDS_URL,
  STATUS_URL,
  USERS_URL,
  DEALS_URL,
  IDS_KEY,
  CATEGORIES_URL,
} from "../utils/keys.js";

export const useDealStore = defineStore("deal", () => {
  const state = reactive({
    deals: [],
    fields: {},
    statuses: {},
    users: {},
    loading: false,
    filter: {
      idFrom: null,
      idTo: null,
    },
    categories: {},
    sortKey: "",
    sortOrder: "asc",
  });

  const { get, error, loading } = useApi();

  const savedIds = localStorage.getItem(IDS_KEY);

  if (savedIds) {
    const newIds = JSON.parse(savedIds);
    state.filter.idFrom = newIds.idFrom;
    state.filter.idTo = newIds.idTo;
  }

  /**
   * Загружает метаданные полей сделки.
   * @returns {Promise<void>}
   */
  async function fetchFields() {
    const res = await get(FIELDS_URL);
    state.fields = Object.fromEntries(
      Object.entries(res.result).filter(([key]) => FIELD_KEYS.includes(key))
    );
  }

  /**
   * Загружает статусы сделок.
   * @returns {Promise<void>}
   */
  async function fetchStatuses() {
    const res = await get(STATUS_URL);
    state.statuses = Object.fromEntries(
      res.result.map((s) => [s.STATUS_ID, s])
    );
  }

  /**
   * Загружает пользователей.
   * @returns {Promise<void>}
   */
  async function fetchUsers() {
    const res = await get(USERS_URL);
    state.users = Object.fromEntries(res.result.map((u) => [u.ID, u]));
  }

  /**
   * Загружает категории сделок.
   * @returns {Promise<void>}
   */
  async function fetchCategories() {
    const res = await get(CATEGORIES_URL);
    state.categories = Object.fromEntries(
      res.result.categories.map((c) => [c.id, c])
    );
  }

  /**
   * Загружает сделки с учётом фильтра и сортировки.
   * @param {boolean} [reset=false] - Сбросить текущий список сделок перед загрузкой.
   * @returns {Promise<void>}
   */
  async function fetchDeals(reset = false) {
    state.loading = true;
    try {
      if (reset) state.deals = [];
      const { idFrom, idTo } = state.filter;

      // Позволяем искать по одному из полей или без них вовсе,
      // если оба поля пустые, фильтр не будет добавлен, и запрос вернёт все сделки
      const filter = {};
      if (idFrom) filter[">ID"] = idFrom;
      if (idTo) filter["<ID"] = idTo;
      const url = buildBitrixUrl(DEALS_URL, {
        filter,
        select: FIELD_KEYS,
      });
      const res = await get(url);
      state.deals = convertDeals(res.result);
    } finally {
      state.loading = false;
    }
  }

  /**
   * Формирует URL для Bitrix24 API с учётом фильтра и select-полей.
   * @param {string} base - Базовый URL.
   * @param {Object} params - Параметры запроса.
   * @param {Object} [params.filter] - Объект фильтрации.
   * @param {string[]} [params.select] - Массив ключей для выборки.
   * @returns {string} Сформированный URL.
   */
  function buildBitrixUrl(base, params = {}) {
    const url = new URL(base);
    const search = new URLSearchParams();

    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        search.append(`filter[${key}]`, value);
      });
    }
    if (params.select) {
      params.select.forEach((key, idx) => search.append(`select[${idx}]`, key));
    }

    url.search = search.toString();

    return url.toString();
  }

  /**
   * Меняет ключ и порядок сортировки.
   * @param {string} key - Ключ сортировки.
   */
  function sortingBy(key) {
    if (state.sortKey === key) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortOrder = "asc";
    }
  }

  /**
   * Преобразует массив сделок, подставляя имена пользователей и статусов.
   * @param {Object[]} result - Массив сделок из API.
   * @returns {Object[]} Преобразованный массив сделок.
   */
  function convertDeals(result) {
    return result.map((item) => {
      const stagedStatus = state.statuses[item.STAGE_ID];
      console.log(stagedStatus, "STAGED STATUS");

      const sourcesNamed = state.statuses[item.SOURCE_ID]

      const currentAssignedUser = state.users[item.ASSIGNED_BY_ID];

      const currentCreatedUser = state.users[item.CREATED_BY_ID]

      return {
        ...item,
        STAGE_ID: stagedStatus ? stagedStatus.NAME : item.STAGE_ID,
        CREATED_BY_ID: currentCreatedUser
          ? `${currentCreatedUser.NAME} ${currentCreatedUser.LAST_NAME}`
          : null,
        ASSIGNED_BY_ID: currentAssignedUser
          ? `${currentAssignedUser.NAME} ${currentAssignedUser.LAST_NAME}`
          : null,
        SOURCE_ID: sourcesNamed ? sourcesNamed.NAME : item.SOURCE_ID,
      };
    });
  }

  /**
   * Устанавливает значения фильтра по id.
   * @param {{ idFrom: number | null, idTo: number | null }} -
   *   idFrom - начальный id, idTo - конечный id.
   *   Если какой-либо id равен null, то фильтр будет отменен.
   *   @example
   *     setFilter({ idFrom: 1, idTo: 10 });
   *     setFilter({ idFrom: null, idTo: null }); // отмена фильтра
   */
  function setFilter({ idFrom, idTo }) {
    state.filter.idFrom = idFrom;
    state.filter.idTo = idTo;

    localStorage.setItem(IDS_KEY, JSON.stringify({ idTo, idFrom }));
  }

  /**
   * Загружает все необходимые справочники и сделки.
   * @param {boolean} [reset=false] - Сбросить текущий список сделок перед загрузкой.
   * @returns {Promise<void>}
   */
  async function fetchAll(reset = false) {
    await Promise.all([
      fetchFields(),
      fetchStatuses(),
      fetchUsers(),
      fetchCategories(),
    ]);
    await fetchDeals(reset);
  }

  return {
    state,
    sortingBy,
    fetchAll,
    fetchDeals,
    setFilter,
    loading,
    error,
  };
});
