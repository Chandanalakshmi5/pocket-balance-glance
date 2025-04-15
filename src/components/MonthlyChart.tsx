
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MonthlyChart: React.FC = () => {
  const { getMonthlyData } = useTransactions();
  const monthlyData = getMonthlyData();

  // Custom tooltip formatter for currency
  const currencyFormatter = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {monthlyData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Add transactions to see your monthly chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={currencyFormatter}
                width={80}
              />
              <Tooltip 
                formatter={(value) => currencyFormatter(Number(value))}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="#38A169" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="Expense" 
                fill="#E53E3E" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
