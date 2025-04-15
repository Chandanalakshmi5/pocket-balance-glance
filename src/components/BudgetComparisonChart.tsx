
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/context/TransactionContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subMonths } from 'date-fns';

const BudgetComparisonChart: React.FC = () => {
  const { getBudgetData } = useTransactions();
  
  // Generate month options (current month and past 6 months)
  const now = new Date();
  const monthOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subMonths(now, i);
    return format(date, 'MMM yyyy');
  });
  
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const budgetData = getBudgetData(selectedMonth);
  
  // Prepare data for chart - show top 6 categories only to avoid clutter
  const chartData = budgetData
    .slice(0, 6)
    .map(({ category, budget, actual }) => ({
      category,
      Budget: budget,
      Actual: actual,
    }));
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget vs. Actual</CardTitle>
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" width={100} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="Budget" fill="#1E88E5" />
                <Bar dataKey="Actual" fill="#E53E3E" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No budget data available for {selectedMonth}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
