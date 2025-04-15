
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BudgetFormData, Budget, EXPENSE_CATEGORIES } from '@/lib/types';
import { useTransactions } from '@/context/TransactionContext';
import { format, addMonths } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  month: z.string().min(1, 'Month is required'),
});

interface BudgetFormProps {
  editBudget?: Budget;
  onCancel?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  editBudget,
  onCancel,
}) => {
  const { addBudget, updateBudget } = useTransactions();
  const isEditMode = !!editBudget;
  
  // Generate month options (current month and next 6 months)
  const now = new Date();
  const monthOptions = Array.from({ length: 7 }, (_, i) => {
    const date = addMonths(now, i);
    return format(date, 'MMM yyyy');
  });

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editBudget
      ? {
          category: editBudget.category,
          amount: editBudget.amount,
          month: editBudget.month,
        }
      : {
          category: '',
          amount: 0,
          month: format(now, 'MMM yyyy'),
        },
  });

  const onSubmit = (data: BudgetFormData) => {
    if (isEditMode && editBudget) {
      updateBudget({
        id: editBudget.id,
        ...data,
      });
    } else {
      addBudget(data);
    }
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="bg-primary text-primary-foreground">
            {isEditMode ? 'Update' : 'Add'} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetForm;
