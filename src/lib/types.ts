
export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
};

export type TransactionFormData = {
  amount: number;
  date: Date;
  description: string;
  type: 'income' | 'expense';
};

export type MonthlyData = {
  month: string;
  income: number;
  expense: number;
};
