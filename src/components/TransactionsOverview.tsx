
import React from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, CircleDollarSign } from 'lucide-react';

const TransactionsOverview: React.FC = () => {
  const { transactions } = useTransactions();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-finance-income' : 'text-finance-expense'}`}>
            {formatCurrency(balance)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-finance-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-income">
            {formatCurrency(totalIncome)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-finance-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-finance-expense">
            {formatCurrency(totalExpenses)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsOverview;
