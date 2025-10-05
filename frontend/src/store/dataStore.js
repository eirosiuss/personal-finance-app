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
  themes: [],
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

  uploadTransactions: async (transactions) => {
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/transactions/upload`, {
        transactions,
      });
      set({ transactions: res.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload transactions",
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

  addBudget: async (budget) => {
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/budgets/add`, budget);
      set({
        budgets: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add budget",
      });
    }
  },

  editBudget: async (oldCategory, updatedBudget) => {
    set({ error: null });
    try {
      const res = await axios.put(`${API_URL}/budgets/edit/${oldCategory}`, {
        newTitle: updatedBudget.newTitle,
        newMaximum: updatedBudget.newMaximum,
        newTheme: updatedBudget.newTheme,
      });
      set({ budgets: res.data.budgets });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update budget",
      });
    }
  },

  deleteBudget: async (category) => {
    set({ error: null });
    try {
      const res = await axios.delete(`${API_URL}/budgets/delete/${category}`);
      set({
        budgets: res.data.budgets,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete budget",
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

  addPot: async (pot) => {  
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/pots/add`, pot);
      set({
        pots: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add pot",
      });
    }
  },

  editPot: async (oldPot, updatedPot) => {
    set({ error: null });
    try {
      const res = await axios.put(`${API_URL}/budgets/edit/${oldPot}`, {
        newName: updatedPot.newTitle,
        newTarget: updatedPot.newMaximum,
        newTheme: updatedPot.newTheme,
      });
      set({ pots: res.data.pots });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update pots",
      });
    }
  },

  deletePot: async (name) => {
    set({ error: null });
    try {
      const res = await axios.delete(`${API_URL}/pots/delete/${name}`);
      set({
        pot: res.data.pot,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete pot",
      });
    }
  },

  depositPot: async (name, amount) => {
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/pots/deposit`, { name, amount });
      set({ pots: res.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to deposit to pot",
      });
    }
  },

  withdrawPot: async (name, amount) => {
    set({ error: null });
    try {
      const res = await axios.post(`${API_URL}/pots/withdraw`, {
        name,
        amount,
      });
      set({ pots: res.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to withdraw from pot",
      });
    }
  },

  fetchThemes: async () => {
    set({ error: null });
    try {
      const res = await axios.get(`${API_URL}/themes`);
      set({
        themes: res.data,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch themes",
      });
    }
  },
}));
