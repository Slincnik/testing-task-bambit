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

  /**
   * Получает фотографии с сервера.
   * Если есть параметр reset, то сбрасывает состояние.
   * @param {boolean} [reset=false] - сбросить состояние до режима по умолчанию
   */
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

  /**
   * Сортирует фотографии.
   * @param {string} key - поле, по которому происходит сортировка
   */
  function sortPhotos(key) {
    if (state.sortKey === key) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = key;
      state.sortOrder = "asc";
    }

    applySort();
  }

  /**
   * Применяет сортировку к отсортированному массиву фотографий.
   * Если state.sortKey === null, то ничего не делает.
   */
  function applySort() {
    if (!state.sortKey) return;

    const multiplier = state.sortOrder === "asc" ? 1 : -1;
    const key = state.sortKey;

    state.photos = [...state.allPhotos];
    state.photos.sort((a, b) => (a[key] > b[key] ? 1 : -1) * multiplier);

    // Отображаем только первые 30
    state.photos = state.photos.slice(0, state.perPage);
  }

  /**
   * Сброс сортировки до значений по умолчанию.
   */
  function resetSort() {
    state.sortKey = null;
    state.sortOrder = "asc";
    state.photos = [...state.allPhotos];
  }

  /**
   * Создает URL для запроса фотографий.
   * URL-адрес содержит идентификаторы альбомов, если таковые имеются, а также параметры _page и _limit.
   * @returns {string} URL строка
   */
  function buildUrl() {
    const query = new URLSearchParams();

    if (state.albumIds.length) {
      state.albumIds.forEach((id) => query.append("albumId", id));
    }

    query.append("_page", state.page.toString());
    query.append("_limit", state.perPage.toString());

    return `${PHOTOS_KEY}?${query.toString()}`;
  }

  /**
   * Сбрасывает состояние фотографий.
   */
  function resetPhotosState() {
    state.page = 1;
    state.photos = [];
    state.hasMore = true;
  }

  /**
   * Устанавливает идентификаторы альбомов и сохраняет их в локальном хранилище.
   * @param {number[]} ids TИдентификаторы альбомов, которые нужно установить.
   */
  function setAlbumsIds(ids) {
    state.albumIds = ids;
    localStorage.setItem(ALBUM_ID_KEY, ids.join(","));
  }

  /**
   * При достижении конца списка загружается больше фотографий.
   * Загружается больше фотографий, если доступно больше фотографий (значение state.hasMore - true),
   * запрос еще не загружается, нет активной сортировки и ошибки.
   * Увеличивает номер текущей страницы, обновляет список фотографий новой страницей и извлекает новые фотографии.
   */
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
