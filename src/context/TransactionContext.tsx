
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, MonthlyData, Budget, CategoryTotal, CategoryBudgetData, CATEGORY_COLORS, EXPENSE_CATEGORIES } from '@/lib/types';
import { format, parse, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getMonthlyData: () => MonthlyData[];
  getCategoryData: () => CategoryTotal[];
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  getBudgetData: (month: string) => CategoryBudgetData[];
  getMonthlyBudgetData: () => { month: string; budgeted: number; spent: number }[];
  getCurrentMonthSpending: () => { total: number, byCategory: Record<string, number> };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved, (key, value) => {
      // Convert ISO date strings back to Date objects
      if (key === 'date' && typeof value === 'string') {
        return new Date(value);
      }
      return value;
    }) : [];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever transactions change
  React.useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save to localStorage whenever budgets change
  React.useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [...prev, newTransaction]);
    toast.success("Transaction added");
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    toast.success("Transaction updated");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted");
  };

  const getMonthlyData = (): MonthlyData[] => {
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(transaction => {
      const monthKey = format(new Date(transaction.date), 'MMM yyyy');
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += transaction.amount;
      }
    });

    // Convert to array format for chart
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => {
        // Sort by date (month year)
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const getCategoryData = (): CategoryTotal[] => {
    const categoryTotals: Record<string, number> = {};
    
    // Sum up transaction amounts by category (only expenses)
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category || 'Other';
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += transaction.amount;
      });
    
    // Convert to array format for charts
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category] || '#9E9E9E'
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  };

  const getCurrentMonthSpending = () => {
    const now = new Date();
    const currentMonth = format(now, 'MMM yyyy');
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    
    let total = 0;
    const byCategory: Record<string, number> = {};
    
    // Initialize byCategory with zeros for all expense categories
    EXPENSE_CATEGORIES.forEach(category => {
      byCategory[category] = 0;
    });
    
    // Sum up transaction amounts for current month (only expenses)
    transactions
      .filter(t => 
        t.type === 'expense' && 
        isWithinInterval(new Date(t.date), { start, end })
      )
      .forEach(transaction => {
        const category = transaction.category || 'Other';
        byCategory[category] = (byCategory[category] || 0) + transaction.amount;
        total += transaction.amount;
      });
    
    return { total, byCategory };
  };

  // Budget management
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    // Check if budget for this category and month already exists
    const existingBudget = budgets.find(b => 
      b.category === budget.category && b.month === budget.month
    );
    
    if (existingBudget) {
      // Update existing budget instead
      updateBudget({ ...existingBudget, amount: budget.amount });
      return;
    }
    
    const newBudget = {
      ...budget,
      id: crypto.randomUUID()
    };
    
    setBudgets(prev => [...prev, newBudget]);
    toast.success("Budget added");
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev => 
      prev.map(budget => 
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
    toast.success("Budget updated");
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id));
    toast.success("Budget deleted");
  };

  const getBudgetData = (month: string): CategoryBudgetData[] => {
    // Get all budgets for the selected month
    const monthBudgets = budgets.filter(b => b.month === month);
    
    // Get all expense transactions for the selected month
    const monthStart = parse(month, 'MMM yyyy', new Date());
    const interval = { 
      start: startOfMonth(monthStart), 
      end: endOfMonth(monthStart) 
    };
    
    // Calculate actual spending by category
    const actualByCategory: Record<string, number> = {};
    transactions
      .filter(t => 
        t.type === 'expense' && 
        isWithinInterval(new Date(t.date), interval)
      )
      .forEach(transaction => {
        const category = transaction.category || 'Other';
        if (!actualByCategory[category]) {
          actualByCategory[category] = 0;
        }
        actualByCategory[category] += transaction.amount;
      });
    
    // Combine budget and actual data
    const result: CategoryBudgetData[] = [];
    
    // First add categories that have budgets
    monthBudgets.forEach(budget => {
      const actual = actualByCategory[budget.category] || 0;
      result.push({
        category: budget.category,
        budget: budget.amount,
        actual,
        remaining: budget.amount - actual
      });
    });
    
    // Then add categories that have expenses but no budget
    Object.entries(actualByCategory).forEach(([category, actual]) => {
      if (!monthBudgets.find(b => b.category === category)) {
        result.push({
          category,
          budget: 0,
          actual,
          remaining: -actual
        });
      }
    });
    
    return result.sort((a, b) => b.actual - a.actual);
  };

  const getMonthlyBudgetData = () => {
    const monthlyData: Record<string, { budgeted: number, spent: number }> = {};
    
    // Get all months with either transactions or budgets
    const allMonths = new Set<string>();
    transactions.forEach(t => {
      allMonths.add(format(new Date(t.date), 'MMM yyyy'));
    });
    budgets.forEach(b => {
      allMonths.add(b.month);
    });
    
    // For each month, calculate the total budgeted amount and actual spending
    Array.from(allMonths).forEach(month => {
      // Total budgeted amount for this month
      const budgeted = budgets
        .filter(b => b.month === month)
        .reduce((sum, b) => sum + b.amount, 0);
      
      // Parse month to get date range
      const monthDate = parse(month, 'MMM yyyy', new Date());
      const interval = { 
        start: startOfMonth(monthDate), 
        end: endOfMonth(monthDate) 
      };
      
      // Calculate actual spending for this month
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          isWithinInterval(new Date(t.date), interval)
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData[month] = { budgeted, spent };
    });
    
    // Convert to array and sort by month
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        budgeted: data.budgeted,
        spent: data.spent
      }))
      .sort((a, b) => {
        // Sort by date (month year)
        const dateA = parse(a.month, 'MMM yyyy', new Date());
        const dateB = parse(b.month, 'MMM yyyy', new Date());
        return dateA.getTime() - dateB.getTime();
      });
  };

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      getMonthlyData,
      getCategoryData,
      budgets,
      addBudget,
      updateBudget,
      deleteBudget,
      getBudgetData,
      getMonthlyBudgetData,
      getCurrentMonthSpending
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
