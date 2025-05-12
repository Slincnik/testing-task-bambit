import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { api } from "../utils/axios.js";
import { ALBUM_ID_KEY, PHOTOS_KEY } from "../utils/keys.js";

export const usePhotoStore = defineStore("photo", () => {
  const state = reactive({
    photos: [],
    albumIds: [],
    loading: false,
    sortKey: null,
    sortOrder: "asc",
    page: 1,
    perPage: 30,
    hasMore: true, // Для проверки, нужно ли грузить новые данные
  });

  const savedAlbumIds = localStorage.getItem(ALBUM_ID_KEY);
  if (savedAlbumIds) {
    state.albumIds = savedAlbumIds.split(",").map((id) => id.trim());
  }

  async function fetchPhotos(reset = false) {
    if (reset) {
      resetPhotosState();
    }

    if (!state.hasMore) return;

    state.loading = true;
    try {
      const url = buildUrl();

      const response = await api.get(url);
      const data = response.data;

      if (reset) {
        state.photos = data;
      } else {
        state.photos = [...state.photos, ...data];
      }

      // Если данные закончились, прекратили загрузку
      if (data.length < state.perPage) {
        state.hasMore = false;
      }
    } catch (error) {
      console.error("Произошла ошибка");
    } finally {
      state.loading = false;
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

    state.photos.sort((a, b) => (a[key] > b[key] ? 1 : -1) * multiplier);
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
    if (!state.hasMore || state.loading) return;
    state.page += 1;
    fetchPhotos();
  }

  return {
    ...toRefs(state),
    fetchPhotos,
    sortPhotos,
    setAlbumsIds,
    loadMore,
  };
});
