import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? `${import.meta.env.VITE_BACKEND_URL}/api/data`
    : "/api/data";
axios.defaults.withCredentials = true;

export const useDataStore = create((set) => ({
  transactions: [],
  budgets: [],
  pots: [],
  error: null,

  fetchTransactions: async () => {
    set({ error: null });
    try {
      const res = await axios.get(`${API_URL}/transactions`);
      set({
        transactions: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch transactions",
      });
    }
  },

  fetchBudgets: async () => {
    set({ error: null });
    try {
      const res = await axios.get(`${API_URL}/budgets`);
      set({
        budgets: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch budgets",
      });
    }
  },

  fetchPots: async () => {
    set({ error: null });
    try {
      const res = await axios.get(`${API_URL}/pots`);
      set({
        pots: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch pots",
      });
    }
  },

  addBudget: async (budget) => {
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/add-budget`, budget);
      set({
        budgets: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add budget",
      });
    }
  },

  deleteBudget: async (category) => {
    set({ error: null });
    try {
      const res = await axios.delete(`${API_URL}/delete-budget/${category}`);
      set({
      budgets: res.data.budgets,
    });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add budget",
      });
    }
  },
}));
