
import React, { useState } from 'react';
import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import BudgetsList from '@/components/BudgetsList';
import MonthlyBudgetChart from '@/components/MonthlyBudgetChart';
import SpendingInsights from '@/components/SpendingInsights';
import TransactionsOverview from '@/components/TransactionsOverview';
import { TransactionProvider } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BudgetForm from '@/components/BudgetForm';

const Index: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false);

  return (
    <TransactionProvider>
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        
        <main className="flex-1 container p-4 md:p-6 mx-auto max-w-7xl">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
                <Button 
                  onClick={() => setIsAddBudgetDialogOpen(true)}
                  variant="outline"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Budget
                </Button>
              </div>
            </div>
            
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <h1 className="text-3xl font-bold">Finance Dashboard</h1>
              
              <TransactionsOverview />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <MonthlyChart />
                <CategoryPieChart />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <BudgetComparisonChart />
                <SpendingInsights />
              </div>
            </TabsContent>
            
            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <h1 className="text-3xl font-bold">Transactions</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <CategoryPieChart />
                </div>
                <div>
                  <TransactionList />
                </div>
              </div>
            </TabsContent>
            
            {/* Budgeting Tab */}
            <TabsContent value="budgeting" className="space-y-6">
              <h1 className="text-3xl font-bold">Budgeting</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <BudgetsList />
                <MonthlyBudgetChart />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <BudgetComparisonChart />
                <SpendingInsights />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <BudgetForm onCancel={() => setIsAddBudgetDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </TransactionProvider>
  );
};

export default Index;
