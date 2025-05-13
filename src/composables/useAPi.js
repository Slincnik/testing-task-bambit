import { ref } from "vue";
import { api } from "../utils/axios";
import { useToast } from "vue-toastification";

export function useApi() {
  const error = ref(null);
  const loading = ref(false);
  const toast = useToast();

  const request = async (method, url, options = {}) => {
    error.value = null;
    loading.value = true;

    try {
      const response = await api[method](url, options);
      return response.data;
    } catch (err) {
      error.value = {
        message:
          err.response?.data?.message || "Произошла ошибка при загрузке данных",
        status: err.response?.status,
        details: err.response?.data,
      };
      toast.error(error.value.message);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const get = (url, params) => request("get", url, { params });
  const post = (url, data) => request("post", url, data);
  const put = (url, data) => request("put", url, data);
  const remove = (url) => request("delete", url);

  return {
    error,
    loading,
    get,
    post,
    put,
    delete: remove,
  };
}
