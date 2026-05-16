export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Rent/Mortgage'
  | 'Bills'
  | 'Groceries'
  | 'Travel'
  | 'Miscellaneous';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface ExpenseSummary {
  total: number;
  byCategory: Record<ExpenseCategory, number>;
  count: number;
}