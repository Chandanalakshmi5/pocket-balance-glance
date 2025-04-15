
export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
  category: string;
};

export type TransactionFormData = {
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
  category: string;
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};

export type CategoryTotal = {
  category: string;
  amount: number;
  color: string;
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  month: string; // Format: "MMM yyyy"
};

export type BudgetFormData = {
  category: string;
  amount: number;
  month: string;
};

export type CategoryBudgetData = {
  category: string;
  budget: number;
  actual: number;
  remaining: number;
};

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Personal Care',
  'Debt',
  'Savings',
  'Travel',
  'Gifts',
  'Other'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental',
  'Gifts',
  'Other'
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#FF6384',
  'Transportation': '#36A2EB',
  'Food': '#FFCE56',
  'Utilities': '#4BC0C0',
  'Entertainment': '#9966FF',
  'Healthcare': '#FF9F40',
  'Shopping': '#C9CBCF',
  'Education': '#7FD13B',
  'Personal Care': '#EA5F94',
  'Debt': '#607D8B',
  'Savings': '#1E88E5',
  'Travel': '#FFA726',
  'Gifts': '#8BC34A',
  'Other': '#9E9E9E',
  'Salary': '#66BB6A',
  'Freelance': '#26C6DA',
  'Business': '#42A5F5',
  'Investments': '#5C6BC0',
  'Rental': '#AB47BC',
  'Gift': '#EC407A'
};
