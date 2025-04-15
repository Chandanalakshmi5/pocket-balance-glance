
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

const SpendingInsights: React.FC = () => {
  const { transactions, getCurrentMonthSpending, getMonthlyData } = useTransactions();
  
  // Get current month's spending
  const { total: currentMonthTotal, byCategory: currentMonthByCategory } = getCurrentMonthSpending();
  
  // Get monthly data for trends
  const monthlyData = getMonthlyData();
  
  // Calculate insights
  const insights = [];
  
  // No transactions
  if (transactions.length === 0) {
    insights.push({
      type: 'info',
      icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
      text: 'Start by adding some transactions to get spending insights',
    });
  } else {
    // Get highest spending category
    let highestCategory = '';
    let highestAmount = 0;
    
    Object.entries(currentMonthByCategory).forEach(([category, amount]) => {
      if (amount > highestAmount) {
        highestCategory = category;
        highestAmount = amount;
      }
    });
    
    if (highestCategory && highestAmount > 0) {
      insights.push({
        type: 'warning',
        icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
        text: `Your highest expense category is ${highestCategory} with ${formatCurrency(highestAmount)}`,
      });
    }
    
    // Compare with previous month
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[monthlyData.length - 1];
      const prevMonth = monthlyData[monthlyData.length - 2];
      
      const percentChange = ((currentMonth.expense - prevMonth.expense) / prevMonth.expense) * 100;
      
      if (percentChange > 10) {
        insights.push({
          type: 'warning',
          icon: <TrendingUp className="h-5 w-5 text-red-500" />,
          text: `Your spending increased by ${percentChange.toFixed(1)}% compared to last month`,
        });
      } else if (percentChange < -10) {
        insights.push({
          type: 'success',
          icon: <TrendingDown className="h-5 w-5 text-green-500" />,
          text: `Your spending decreased by ${Math.abs(percentChange).toFixed(1)}% compared to last month`,
        });
      }
    }
  }
  
  // If we don't have any insights yet, add a default one
  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
      text: 'Add more transaction data to get detailed spending insights',
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5">{insight.icon}</div>
              <p>{insight.text}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

// Helper function
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default SpendingInsights;
