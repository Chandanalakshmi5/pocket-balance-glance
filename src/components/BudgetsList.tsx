
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BudgetForm from './BudgetForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subMonths } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BudgetsList: React.FC = () => {
  const { budgets, getBudgetData, deleteBudget } = useTransactions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<string | null>(null);
  
  // Generate month options (current month and past 6 months)
  const now = new Date();
  const monthOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subMonths(now, i);
    return format(date, 'MMM yyyy');
  });
  
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const budgetData = getBudgetData(selectedMonth);
  
  const handleEdit = (budgetId: string) => {
    setEditingBudget(budgetId);
  };
  
  const handleDelete = (budgetId: string) => {
    setDeletingBudget(budgetId);
  };
  
  const confirmDelete = () => {
    if (deletingBudget) {
      deleteBudget(deletingBudget);
      setDeletingBudget(null);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budgets</CardTitle>
          <div className="flex items-center gap-2">
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
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {budgetData.length > 0 ? (
            <div className="border rounded-md divide-y">
              {budgetData.map((item, index) => {
                const budgetObj = budgets.find(b => b.category === item.category && b.month === selectedMonth);
                const isOverBudget = item.budget > 0 && item.actual > item.budget;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-muted/50"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium">{item.category}</div>
                      <div className="text-sm">
                        Budget: <span className="font-mono">{formatCurrency(item.budget)}</span>
                      </div>
                      <div className="text-sm">
                        Actual: <span className={`font-mono ${isOverBudget ? 'text-red-500 font-semibold' : ''}`}>
                          {formatCurrency(item.actual)}
                        </span>
                      </div>
                      <div className="text-sm">
                        Remaining: <span className={`font-mono ${item.remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {formatCurrency(item.remaining)}
                        </span>
                      </div>
                    </div>
                    
                    {budgetObj && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(budgetObj.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(budgetObj.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No budgets set for {selectedMonth}.
              <div className="mt-2">
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Budget
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Budget Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Budget Dialog */}
      <Dialog 
        open={!!editingBudget} 
        onOpenChange={(open) => !open && setEditingBudget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          {editingBudget && (
            <BudgetForm
              editBudget={budgets.find(b => b.id === editingBudget)}
              onCancel={() => setEditingBudget(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog 
        open={!!deletingBudget} 
        onOpenChange={(open) => !open && setDeletingBudget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetsList;
