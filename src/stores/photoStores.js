import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { useApi } from "../composables/useApi.js";
import { ALBUM_ID_KEY, PHOTOS_KEY } from "../utils/keys.js";

export const usePhotoStore = defineStore("photo", () => {
  const state = reactive({
    photos: [], // Отсортированных / фильтрованных
    allPhotos: [], // Массив всех фотографий
    albumIds: [],
    sortKey: null,
    sortOrder: "asc",
    page: 1,
    perPage: 30,
    hasMore: true, // Для проверки, нужно ли грузить новые данные
  });

  const { get, error, loading } = useApi();

  const savedAlbumIds = localStorage.getItem(ALBUM_ID_KEY);
  if (savedAlbumIds) {
    state.albumIds = savedAlbumIds.split(",").map((id) => id.trim());
  }

  async function fetchPhotos(reset = false) {
    if (reset) {
      resetPhotosState();
    }

    if (!state.hasMore) return;

    loading.value = true;
    try {
      const url = buildUrl();

      const response = await get(url);

      if (reset) {
        state.allPhotos = response;
      } else {
        state.allPhotos = [...state.allPhotos, ...response];
      }

      state.photos = state.allPhotos.slice(0, state.page * state.perPage);

      // Если данные закончились, прекратили загрузку
      if (response.length < state.perPage) {
        state.hasMore = false;
      }
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  function sortPhotos(key) {
    if (state.sortKey === key) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortOrder = "asc";
    }

    applySort();
  }

  function applySort() {
    if (!state.sortKey) return;

    const multiplier = state.sortOrder === "asc" ? 1 : -1;
    const key = state.sortKey;

    state.photos = [...state.allPhotos];
    state.photos.sort((a, b) => (a[key] > b[key] ? 1 : -1) * multiplier);

    // Отображаем только первые 30
    state.photos = state.photos.slice(0, state.perPage);
  }

  function resetSort() {
    state.sortKey = null;
    state.sortOrder = "asc";
    state.photos = [...state.allPhotos];
  }

  function buildUrl() {
    const query = new URLSearchParams();

    if (state.albumIds.length) {
      state.albumIds.forEach((id) => query.append("albumId", id));
    }

    query.append("_page", state.page.toString());
    query.append("_limit", state.perPage.toString());

    return `${PHOTOS_KEY}?${query.toString()}`;
  }

  function resetPhotosState() {
    state.page = 1;
    state.photos = [];
    state.hasMore = true;
  }

  function setAlbumsIds(ids) {
    state.albumIds = ids;
    localStorage.setItem(ALBUM_ID_KEY, ids.join(","));
  }

  function loadMore() {
    if (!state.hasMore || loading.value || state.sortKey || error.value) return;
    state.page += 1;
    state.photos = state.allPhotos.slice(0, state.page * state.perPage);
    fetchPhotos();
  }

  return {
    ...toRefs(state),
    loading,
    fetchPhotos,
    sortPhotos,
    setAlbumsIds,
    loadMore,
    resetSort,
  };
});
