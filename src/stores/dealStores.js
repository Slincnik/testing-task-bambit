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
} from "../utils/keys.js";

export const useDealStore = defineStore("deal", () => {
  const state = reactive({
    deals: [],
    fields: {},
    statuses: [],
    users: [],
    loading: false,
    filter: {
      idFrom: 2,
      idTo: 23560,
    },
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

  async function fetchFields() {
    const res = await get(FIELDS_URL);
    state.fields = Object.fromEntries(
      Object.entries(res.result).filter(([key]) => FIELD_KEYS.includes(key))
    );
  }

  async function fetchStatuses() {
    const res = await get(STATUS_URL);
    state.statuses = res.result;
  }

  async function fetchUsers() {
    const res = await get(USERS_URL);
    state.users = res.result;
  }

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

  function sortingBy(key) {
    if (state.sortKey === key) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortOrder = "asc";
    }
  }

  function convertDeals(result) {
    return result.map((item) => {
      const stagedStatus = state.statuses.find(
        ({ STATUS_ID }) => STATUS_ID === item.STAGE_ID
      );

      const sourcesNamed = state.statuses.find(
        ({ STATUS_ID }) => STATUS_ID === item.SOURCE_ID
      );

      const currentAssignedUser = state.users.find(
        ({ ID }) => ID === item.ASSIGNED_BY_ID
      );

      const currentCreatedUser = state.users.find(
        ({ ID }) => ID === item.CREATED_BY_ID
      );

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

  function setFilter({ idFrom, idTo }) {
    state.filter.idFrom = idFrom;
    state.filter.idTo = idTo;

    localStorage.setItem(IDS_KEY, JSON.stringify({ idTo, idFrom }));
  }

  async function fetchAll(reset = false) {
    await Promise.all([fetchFields(), fetchStatuses(), fetchUsers()]);
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
