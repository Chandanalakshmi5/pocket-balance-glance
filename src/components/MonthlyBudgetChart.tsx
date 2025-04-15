
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';

const MonthlyBudgetChart: React.FC = () => {
  const { getMonthlyBudgetData } = useTransactions();
  const chartData = getMonthlyBudgetData();
  
  // Sort data by date and take only the most recent 6 months
  const recentData = [...chartData]
    .slice(-6) // Take last 6 months
    .map(item => ({
      month: item.month,
      Budget: item.budgeted,
      Actual: item.spent,
    }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {recentData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="Budget" fill="#1E88E5" />
                <Bar dataKey="Actual" fill="#E53E3E" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available. Add some budgets to see this chart.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyBudgetChart;
