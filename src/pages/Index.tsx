
import React, { useState } from 'react';
import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyChart from '@/components/MonthlyChart';
import TransactionsOverview from '@/components/TransactionsOverview';
import { TransactionProvider } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Index: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <TransactionProvider>
      <div className="min-h-screen flex flex-col bg-muted/10">
        <Header />
        
        <main className="flex-1 container p-4 md:p-6 mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Finance Dashboard</h1>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
          
          <TransactionsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <MonthlyChart />
            </div>
            <div>
              <TransactionList />
            </div>
          </div>
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
    </TransactionProvider>
  );
};

export default Index;
