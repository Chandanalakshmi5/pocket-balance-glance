
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, MonthlyData } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getMonthlyData: () => MonthlyData[];
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

  // Save to localStorage whenever transactions change
  React.useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

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

  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      getMonthlyData
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
