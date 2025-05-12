import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";
import { api } from "../utils/axios.js";
import { ALBUM_ID_KEY } from "../utils/keys.js";

export const usePhotoStore = defineStore("photo", () => {
  const state = reactive({
    photos: [],
    albumIds: [],
    loading: false,
    sortKey: null,
    sortOrder: "asc",
    page: 1,
    perPage: 30,
  });

  const savedAlbumIds = localStorage.getItem(ALBUM_ID_KEY);
  if (savedAlbumIds) {
    state.albumIds = savedAlbumIds.split(",").map((id) => id.trim());
  }

  async function fetchPhotos(reset = false) {
    if (reset) {
      state.page = 1;
      state.photos = [];
    }
    state.loading = true;
    try {
      let url = "/photos";

      if (state.albumIds.length) {
        const params = state.albumIds.map((id) => `albumId=${id}`).join("&");
        url += `?${params}&_page=${state.page}&_limit=${state.perPage}`;
      } else {
        url += `?_page=${state.page}&_limit=${state.perPage}`;
      }
      const response = await api.get(url);

      if (reset) {
        state.photos = response.data;
      } else {
        state.photos = [...state.photos, ...response.data];
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

    const multiplier = state.sortOrder === "asc" ? 1 : -1;

    state.photos.sort((a, b) => {
      if (a[key] < b[key]) return -1 * multiplier;
      if (a[key] > b[key]) return 1 * multiplier;
      return 0;
    });
  }

  function setAlbumsIds(ids) {
    state.albumIds = ids;
    localStorage.setItem(ALBUM_ID_KEY, ids.join(","));
  }

  function loadMore() {
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

