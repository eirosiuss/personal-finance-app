import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/data`;
axios.defaults.withCredentials = true;

export const useDataStore = create((set) => ({
  transactions: [],
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/transactions`);
      set({
        transactions: res.data,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch transactions",
      });
    }
  },
}));
