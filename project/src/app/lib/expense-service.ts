import { Expense, ExpenseCategory } from './types';

const STORAGE_KEY = 'spendwise_expenses';

export const expenseService = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const expenses = expenseService.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newExpense;
  },

  deleteExpense: (id: string): void => {
    const expenses = expenseService.getExpenses();
    const updated = expenses.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getCategoryTotals: (expenses: Expense[]) => {
    const totals: Record<string, number> = {};
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  },

  getSummary: (expenses: Expense[], days: number) => {
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - days));
    const filtered = expenses.filter(e => new Date(e.date) >= cutoff);
    const total = filtered.reduce((sum, e) => sum + e.amount, 0);
    return {
      total,
      count: filtered.length,
      expenses: filtered
    };
  }
};