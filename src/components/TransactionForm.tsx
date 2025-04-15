
import React, { useEffect } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { TransactionFormData, Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types';
import { format } from 'date-fns';
import { useTransactions } from '@/context/TransactionContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  date: z.date(),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
});

interface TransactionFormProps {
  editTransaction?: Transaction;
  onCancel?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  editTransaction,
  onCancel,
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const isEditMode = !!editTransaction;

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editTransaction
      ? {
          amount: editTransaction.amount,
          date: new Date(editTransaction.date),
          description: editTransaction.description,
          type: editTransaction.type,
          category: editTransaction.category || '',
        }
      : {
          amount: 0,
          date: new Date(),
          description: '',
          type: 'expense',
          category: '',
        },
  });

  // Update available categories when transaction type changes
  const transactionType = form.watch('type');
  
  // Reset category when transaction type changes
  useEffect(() => {
    form.setValue('category', '');
  }, [transactionType, form]);

  const onSubmit = (data: TransactionFormData) => {
    if (isEditMode && editTransaction) {
      updateTransaction({
        id: editTransaction.id,
        ...data,
      });
    } else {
      addTransaction(data);
    }
    
    if (!isEditMode) {
      form.reset({
        amount: 0,
        date: new Date(),
        description: '',
        type: 'expense',
        category: '',
      });
    } else if (onCancel) {
      onCancel();
    }
  };

  // Get appropriate category options based on transaction type
  const categoryOptions = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
                  {categoryOptions.map((category) => (
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
              <FormLabel>Amount</FormLabel>
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
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
            {isEditMode ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
